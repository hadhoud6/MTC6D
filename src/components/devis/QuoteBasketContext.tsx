"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { products as catalogueProducts } from "@/data/products";
import { FINISH_VALUES } from "@/data/finishes";
import { PRODUCT_TYPE_VALUES } from "@/data/productTypes";
import type { Product } from "@/types/content";
import type { DevisFormInput } from "@/lib/validations/devisSchema";

export const QUOTE_STORAGE_KEY = "mtc3d.quoteDraft.v1";
export const OPEN_CATALOGUE_SESSION_KEY = "mtc3d.openCatalogueFromQuote";

export type QuoteProductDraft = DevisFormInput["products"][number];
export type QuoteContactDraft = Partial<Omit<DevisFormInput, "products">>;

type QuoteBasketContextValue = {
  ready: boolean;
  products: QuoteProductDraft[];
  contactDraft: QuoteContactDraft | null;
  count: number;
  isFull: boolean;
  isCatalogueProductSelected: (product: Product) => boolean;
  canAddCatalogueProduct: (product: Product) => boolean;
  toggleCatalogueProduct: (product: Product) => void;
  addCatalogueProduct: (product: Product) => void;
  updateQuoteProducts: (products: QuoteProductDraft[]) => void;
  updateContactDraft: (draft: QuoteContactDraft) => void;
  removeQuoteProduct: (index: number) => void;
  clearQuote: () => void;
};

const QuoteBasketContext = createContext<QuoteBasketContextValue | null>(null);

export function createEmptyQuoteProduct(): QuoteProductDraft {
  return {
    type: undefined,
    catalogProductId: undefined,
    variete: "",
    longueur: "",
    largeur: "",
    epaisseur: "",
    quantite: "",
    finition: undefined,
    otherFinitionText: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function normalizeProduct(value: unknown): QuoteProductDraft {
  const source = isRecord(value) ? value : {};
  const rawType = source.type;
  const rawFinish = source.finition;
  const rawCatalogId = asText(source.catalogProductId, 120);

  return {
    type: PRODUCT_TYPE_VALUES.includes(rawType as (typeof PRODUCT_TYPE_VALUES)[number])
      ? (rawType as QuoteProductDraft["type"])
      : undefined,
    catalogProductId:
      rawCatalogId && catalogueProducts.some((product) => product.slug === rawCatalogId)
        ? rawCatalogId
        : undefined,
    variete: asText(source.variete, 120),
    longueur: asText(source.longueur, 40),
    largeur: asText(source.largeur, 40),
    epaisseur: asText(source.epaisseur, 40),
    quantite: asText(source.quantite, 40),
    finition: FINISH_VALUES.includes(rawFinish as (typeof FINISH_VALUES)[number])
      ? (rawFinish as QuoteProductDraft["finition"])
      : undefined,
    otherFinitionText: asText(source.otherFinitionText, 160),
  };
}

function normalizeProducts(value: unknown): QuoteProductDraft[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 3).map(normalizeProduct);
}

const CONTACT_FIELDS = [
  "nom",
  "prenom",
  "email",
  "telephone",
  "telephoneCountry",
  "telephoneCountryName",
  "commentaire",
  "honeypot",
] as const;

function normalizeContactDraft(value: unknown): QuoteContactDraft | null {
  if (!isRecord(value)) return null;
  const contact: Record<string, string> = {};
  for (const field of CONTACT_FIELDS) {
    const length = field === "commentaire" ? 1000 : 300;
    if (typeof value[field] === "string") contact[field] = asText(value[field], length);
  }
  return contact as QuoteContactDraft;
}

function isEmptyProduct(product: QuoteProductDraft): boolean {
  return !(
    product.catalogProductId ||
    product.type ||
    product.variete ||
    product.longueur ||
    product.largeur ||
    product.epaisseur ||
    product.quantite ||
    product.finition ||
    product.otherFinitionText
  );
}

function findMatchingProduct(products: QuoteProductDraft[], product: Product): number {
  return products.findIndex(
    (item) =>
      item.catalogProductId === product.slug ||
      (item.type === product.productType && item.variete === product.slug),
  );
}

export function QuoteBasketProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<QuoteProductDraft[]>([]);
  const [contactDraft, setContactDraft] = useState<QuoteContactDraft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(QUOTE_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isRecord(parsed) && parsed.version === 1) {
          setProducts(normalizeProducts(parsed.products));
          setContactDraft(normalizeContactDraft(parsed.contactDraft));
        }
      }
    } catch {
      // Keep the empty quote if localStorage is unavailable or contains invalid JSON.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (products.length === 0 && !contactDraft) {
        window.localStorage.removeItem(QUOTE_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          QUOTE_STORAGE_KEY,
          JSON.stringify({ version: 1, products, contactDraft }),
        );
      }
    } catch {
      // Continue the current session even when storage is disabled or full.
    }
  }, [contactDraft, products, ready]);

  const isCatalogueProductSelected = useCallback(
    (product: Product) => findMatchingProduct(products, product) >= 0,
    [products],
  );

  const canAddCatalogueProduct = useCallback(
    (product: Product) =>
      isCatalogueProductSelected(product) ||
      products.length < 3 ||
      products.some(isEmptyProduct),
    [isCatalogueProductSelected, products],
  );

  const toggleCatalogueProduct = useCallback((product: Product) => {
    setProducts((current) => {
      const existingIndex = findMatchingProduct(current, product);
      if (existingIndex >= 0) {
        return current.filter((_, index) => index !== existingIndex);
      }

      const item: QuoteProductDraft = {
        ...createEmptyQuoteProduct(),
        type: product.productType,
        variete: product.slug,
        catalogProductId: product.slug,
      };
      const emptyIndex = current.findIndex(isEmptyProduct);
      if (emptyIndex >= 0) {
        return current.map((existing, index) => (index === emptyIndex ? item : existing));
      }
      if (current.length >= 3) return current;
      return [...current, item];
    });
  }, []);

  const addCatalogueProduct = useCallback((product: Product) => {
    setProducts((current) => {
      if (findMatchingProduct(current, product) >= 0) return current;
      const item: QuoteProductDraft = {
        ...createEmptyQuoteProduct(),
        type: product.productType,
        variete: product.slug,
        catalogProductId: product.slug,
      };
      const emptyIndex = current.findIndex(isEmptyProduct);
      if (emptyIndex >= 0) {
        return current.map((existing, index) => (index === emptyIndex ? item : existing));
      }
      return current.length < 3 ? [...current, item] : current;
    });
  }, []);

  const updateQuoteProducts = useCallback((nextProducts: QuoteProductDraft[]) => {
    setProducts((current) => {
      const normalized = normalizeProducts(nextProducts);
      if (JSON.stringify(current) === JSON.stringify(normalized)) return current;
      return normalized;
    });
  }, []);

  const updateContactDraft = useCallback((draft: QuoteContactDraft) => {
    setContactDraft((current) => {
      const normalized = normalizeContactDraft(draft);
      if (JSON.stringify(current) === JSON.stringify(normalized)) return current;
      return normalized;
    });
  }, []);

  const removeQuoteProduct = useCallback((index: number) => {
    setProducts((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const clearQuote = useCallback(() => {
    setProducts([]);
    setContactDraft(null);
    try {
      window.localStorage.removeItem(QUOTE_STORAGE_KEY);
    } catch {
      // State is still cleared in memory if storage is unavailable.
    }
  }, []);

  const count = products.filter((product) => !isEmptyProduct(product)).length;
  const isFull = products.length >= 3 && !products.some(isEmptyProduct);

  const value = useMemo<QuoteBasketContextValue>(
    () => ({
      ready,
      products,
      contactDraft,
      count,
      isFull,
      isCatalogueProductSelected,
      canAddCatalogueProduct,
      toggleCatalogueProduct,
      addCatalogueProduct,
      updateQuoteProducts,
      updateContactDraft,
      removeQuoteProduct,
      clearQuote,
    }),
    [
      ready,
      products,
      contactDraft,
      count,
      isFull,
      isCatalogueProductSelected,
      canAddCatalogueProduct,
      toggleCatalogueProduct,
      addCatalogueProduct,
      updateQuoteProducts,
      updateContactDraft,
      removeQuoteProduct,
      clearQuote,
    ],
  );

  return <QuoteBasketContext.Provider value={value}>{children}</QuoteBasketContext.Provider>;
}

export function useQuoteBasket() {
  const context = useContext(QuoteBasketContext);
  if (!context) throw new Error("useQuoteBasket must be used inside QuoteBasketProvider");
  return context;
}

export function QuoteBasketFloatingButton() {
  const { count } = useQuoteBasket();
  const t = useTranslations("devis.productControls");

  if (count < 1) return null;

  return (
    <Link
      key={count}
      id="quote-basket-button"
      href="/devis"
      aria-label={t("myQuoteCount", { count })}
      className="fixed bottom-5 right-4 z-[110] inline-flex min-h-12 items-center gap-2 rounded-full border border-brand-orange bg-brand-dark px-4 py-2 font-sans text-sm font-semibold text-white shadow-xl transition animate-[quote-pop_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <span>{t("myQuote")}</span>
      <span
        className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand-orange px-1.5 py-0.5 text-xs font-bold text-white"
        aria-live="polite"
      >
        {count}/3
      </span>
    </Link>
  );
}
