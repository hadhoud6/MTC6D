"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { products } from "@/data/products";
import { PRODUCT_TYPE_VALUES, type ProductTypeValue } from "@/data/productTypes";
import type { Locale, Product } from "@/types/content";
import { localized } from "@/types/content";
import { useQuoteBasket } from "@/components/devis/QuoteBasketContext";
import { flyQuoteArrow } from "@/lib/flyQuoteArrow";
import CatalogueImageCarousel from "@/components/home/CatalogueImageCarousel";
import FadeInSection from "@/components/common/FadeInSection";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

const CatalogueCard = memo(function CatalogueCard({
  product,
  locale,
  expanded,
  onToggle,
  inQuote,
  canAddToQuote,
  basketReady,
  onToggleQuote,
}: {
  product: Product;
  locale: Locale;
  expanded: boolean;
  onToggle: (id: string) => void;
  inQuote: boolean;
  canAddToQuote: boolean;
  basketReady: boolean;
  onToggleQuote: (product: Product) => void;
}) {
  const t = useTranslations("products");
  const name = localized(product.name, locale);
  const category = localized(product.category, locale);
  const description = localized(product.description, locale);
  const finish = localized(product.finish, locale);
  const handleToggle = useCallback(() => onToggle(product.id), [onToggle, product.id]);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ${expanded ? "md:col-span-2 lg:col-span-2" : "cursor-pointer"}`}
      onClick={() => {
        if (!expanded) handleToggle();
      }}
    >
      <div className="relative">
        <CatalogueImageCarousel
          images={product.images}
          alt={name}
          expanded={expanded}
          onToggle={handleToggle}
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (!inQuote && canAddToQuote && basketReady) {
              flyQuoteArrow(event.currentTarget);
            }
            onToggleQuote(product);
          }}
          disabled={!basketReady || (!inQuote && !canAddToQuote)}
          aria-pressed={inQuote}
          aria-label={`${inQuote ? t("addedToQuote") : canAddToQuote ? t("addToQuote") : t("maximumQuoteProducts")} — ${name}`}
          className={`absolute bottom-3 right-3 z-20 inline-flex min-h-11 max-w-[calc(100%-1.5rem)] items-center justify-center whitespace-normal rounded-full px-4 py-2 text-center font-sans text-xs font-semibold text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-orange sm:text-sm ${
            inQuote
              ? "bg-brand-dark hover:bg-brand-orange"
              : canAddToQuote && basketReady
                ? "bg-brand-orange hover:bg-brand-dark"
                : "cursor-not-allowed bg-brand-dark/70"
          }`}
        >
          {inQuote ? t("addedToQuote") : canAddToQuote ? t("addToQuote") : t("maximumQuoteProducts")}
        </button>
      </div>

      <div className="p-4 md:p-5">
        <div className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-0.5 font-serif text-xs text-white">
          {category}
        </div>
        <h3 className="mb-1 font-display text-base font-bold text-brand-dark md:text-lg">
          {name}
        </h3>
        <p className="font-serif text-sm leading-relaxed text-text-muted">
          {description}
        </p>
        <p className="mt-3 font-serif text-sm text-text-muted">
          <span className="font-semibold text-brand-dark">{t("finishLabel")}</span> {finish}
        </p>
      </div>
    </article>
  );
});

export default function ProductsPageContent({ locale }: { locale: Locale }) {
  const t = useTranslations("products");
  const tType = useTranslations("devis.productTypes");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<ProductTypeValue | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    ready: basketReady,
    isCatalogueProductSelected,
    canAddCatalogueProduct,
    toggleCatalogueProduct,
  } = useQuoteBasket();

  const filteredGroups = useMemo(() => {
    const query = normalizeSearch(searchTerm.trim());

    return PRODUCT_TYPE_VALUES
      .filter((type) => activeType === "all" || type === activeType)
      .map((type) => {
        const items = products.filter((product) => product.productType === type);
        const matches = query
          ? items.filter((product) => {
              const searchableText = [
                localized(product.name, locale),
                localized(product.tag, locale),
                localized(product.category, locale),
                localized(product.description, locale),
                localized(product.finish, locale),
                product.slug,
                tType(product.productType),
              ].join(" ");
              return normalizeSearch(searchableText).includes(query);
            })
          : items;

        return { type, products: matches };
      })
      .filter((group) => !query || group.products.length > 0);
  }, [activeType, locale, searchTerm, tType]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((previous) => (previous === id ? null : id));
  }, []);
  const handleToggleQuote = useCallback(
    (product: Product) => {
      toggleCatalogueProduct(product);
    },
    [toggleCatalogueProduct],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:px-8">
      <FadeInSection>
        <header className="mb-8 text-center md:mb-10">
          <h1 className="font-display text-3xl font-bold text-brand-dark sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl font-serif text-base leading-relaxed text-text-muted md:text-lg">
            {t("description")}
          </p>
        </header>
      </FadeInSection>

      <div className="mb-8 grid gap-4 rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm md:p-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-brand-dark">{t("searchLabel")}</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setExpandedId(null);
            }}
            placeholder={t("searchPlaceholder")}
            className="min-h-11 w-full rounded-xl border border-brand-dark/15 bg-brand-light px-4 py-2 font-serif text-sm text-brand-dark outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-brand-dark">{t("filterByType")}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterByType")}>
            <button
              type="button"
              aria-pressed={activeType === "all"}
              onClick={() => {
                setActiveType("all");
                setExpandedId(null);
              }}
              className={`min-h-10 rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${
                activeType === "all"
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-orange"
              }`}
            >
              {t("allTypes")}
            </button>
            {PRODUCT_TYPE_VALUES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={activeType === type}
                onClick={() => {
                  setActiveType(type);
                  setExpandedId(null);
                }}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${
                  activeType === type
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-orange"
                }`}
              >
                {tType(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <section key={group.type} aria-labelledby={`products-group-${group.type}`}>
              <div className="mb-4 flex items-center justify-between border-b border-brand-dark/10 pb-2">
                <h2
                  id={`products-group-${group.type}`}
                  className="font-display text-xl font-bold text-brand-dark md:text-2xl"
                >
                  {tType(group.type)}
                </h2>
                <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-xs font-semibold text-text-muted">
                  {group.products.length}
                </span>
              </div>

              {group.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
                  {group.products.map((product) => (
                    <CatalogueCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      expanded={expandedId === product.id}
                      onToggle={toggleExpanded}
                      inQuote={isCatalogueProductSelected(product)}
                      canAddToQuote={canAddCatalogueProduct(product)}
                      basketReady={basketReady}
                      onToggleQuote={handleToggleQuote}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-brand-dark/15 bg-white/60 px-4 py-5 font-serif text-sm text-text-muted">
                  {t("noProducts")}
                </p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <p
          role="status"
          className="rounded-xl border border-dashed border-brand-dark/15 bg-white/60 px-4 py-8 text-center font-serif text-sm text-text-muted"
        >
          {t("noResults")}
        </p>
      )}
    </div>
  );
}
