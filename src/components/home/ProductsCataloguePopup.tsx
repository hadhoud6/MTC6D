"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { products } from "@/data/products";
import { PRODUCT_TYPE_VALUES, type ProductTypeValue } from "@/data/productTypes";
import type { Locale, Product } from "@/types/content";
import { localized } from "@/types/content";
import ModalPortal from "@/components/common/ModalPortal";
import { useQuoteBasket } from "@/components/devis/QuoteBasketContext";
import { flyQuoteArrow } from "@/lib/flyQuoteArrow";
import CatalogueImageCarousel from "./CatalogueImageCarousel";
import { CATALOGUE_CONTENT_TRANSITION, CATALOGUE_CONTENT_VARIANTS, CATALOGUE_FADE_TRANSITION, CATALOGUE_FADE_VARIANTS } from "@/lib/motion";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function useProductCopy(product: Product) {
  const locale = useLocale() as Locale;

  return {
    name: localized(product.name, locale),
    category: localized(product.category, locale),
    description: localized(product.description, locale),
    finish: localized(product.finish, locale),
    tag: localized(product.tag, locale),
  };
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h16M7 12h10m-7 6h4" />
    </svg>
  );
}

const CatalogueCard = memo(function CatalogueCard({
  product,
  expanded,
  onToggle,
  inQuote,
  canAddToQuote,
  basketReady,
  onToggleQuote,
}: {
  product: Product;
  expanded: boolean;
  onToggle: (id: string) => void;
  inQuote: boolean;
  canAddToQuote: boolean;
  basketReady: boolean;
  onToggleQuote: (product: Product) => void;
}) {
  const t = useTranslations("products");
  const copy = useProductCopy(product);
  const handleToggle = useCallback(() => onToggle(product.id), [onToggle, product.id]);

  return (
    <motion.article
      data-catalogue-card={product.id}
      style={{ borderRadius: 16 }}
      className={`relative overflow-hidden bg-white ${expanded ? "z-10 md:col-span-2 lg:col-span-2" : "cursor-pointer"}`}
      onClick={() => {
        if (!expanded) handleToggle();
      }}
    >
      <div className="relative">
        <CatalogueImageCarousel
          images={product.images}
          alt={copy.name}
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
          aria-label={`${inQuote ? t("addedToQuote") : canAddToQuote ? t("addToQuote") : t("maximumQuoteProducts")} — ${copy.name}`}
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

      <div className={`p-4 ${expanded ? "md:p-6" : ""}`}>
        <div className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-0.5 font-serif text-xs text-white">
          {copy.category}
        </div>
        <h3
          className={`font-display font-bold text-brand-dark ${
            expanded ? "mb-3 text-xl md:text-2xl" : "mb-1 text-base md:text-lg"
          }`}
        >
          {copy.name}
        </h3>
        {!expanded ? (
          <p className="line-clamp-2 min-h-[2.75rem] font-serif text-sm leading-relaxed text-text-muted">
            {copy.description}
          </p>
        ) : null}
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="expanded-product"
              layout="position"
              variants={CATALOGUE_CONTENT_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={CATALOGUE_CONTENT_TRANSITION}
            >
              <p className="mb-4 font-serif text-sm leading-relaxed text-text-muted md:text-base">
                {copy.description}
              </p>
              <p className="font-serif text-sm text-text-muted">
                <span className="font-semibold text-brand-dark">{t("finishLabel")}</span>{" "}
                {copy.finish}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {expanded ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleToggle();
          }}
          className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/60"
          aria-label="Collapse"
        >
          <ChevronUpIcon />
        </button>
      ) : null}
    </motion.article>
  );
});

export default function ProductsCataloguePopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("products");
  const tType = useTranslations("devis.productTypes");
  const locale = useLocale() as Locale;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<ProductTypeValue | "all">("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
  const handleToggleQuote = useCallback((product: Product) => {
    toggleCatalogueProduct(product);
  }, [toggleCatalogueProduct]);

  const handleClose = useCallback(() => {
    setExpandedId(null);
    setSearchTerm("");
    setActiveType("all");
    setFilterOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!expandedId) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const frame = window.requestAnimationFrame(() => {
      const card = Array.from(
        container.querySelectorAll<HTMLElement>("[data-catalogue-card]"),
      ).find((item) => item.dataset.catalogueCard === expandedId);
      if (!card) return;

      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const targetScrollTop =
        container.scrollTop +
        cardRect.top -
        containerRect.top +
        cardRect.height / 2 -
        container.clientHeight / 2;

      container.scrollTo({
        top: Math.max(
          0,
          Math.min(targetScrollTop, container.scrollHeight - container.clientHeight),
        ),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [expandedId]);

  useEffect(() => {
    if (!open) {
      setExpandedId(null);
      setSearchTerm("");
      setActiveType("all");
      setFilterOpen(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  return (
    <ModalPortal>
      <MotionConfig reducedMotion="user">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="products-catalogue-popup-title"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-4 md:p-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={CATALOGUE_FADE_VARIANTS}
              transition={CATALOGUE_FADE_TRANSITION}
              onClick={(event) => {
                if (event.target === event.currentTarget) handleClose();
              }}
            >
              <motion.div
                className="relative flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-brand-light shadow-xl md:rounded-3xl"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={CATALOGUE_FADE_VARIANTS}
                transition={CATALOGUE_FADE_TRANSITION}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-4 top-4 z-30 flex size-11 items-center justify-center rounded-full border border-brand-dark/10 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 md:right-6 md:top-6"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>

                <div
                  ref={scrollContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6"
                >
                  <header className="mb-5 border-b border-black/5 px-12 pb-5 text-center md:mb-6 md:px-6 md:pb-6">
                    <h2
                      id="products-catalogue-popup-title"
                      className="font-display text-2xl font-bold text-brand-dark md:text-4xl"
                    >
                      {t("modalTitle")}
                    </h2>
                    <p className="mt-2 font-serif text-sm text-text-muted md:text-base">
                      {t("modalSubtitle")}
                    </p>
                  </header>

                  <div className="mb-6">
                    <button
                      type="button"
                      aria-expanded={filterOpen}
                      aria-controls="products-filter-panel"
                      onClick={() => setFilterOpen((current) => !current)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-5 py-2 font-sans text-sm font-semibold text-brand-dark shadow-sm transition-colors hover:border-brand-orange hover:text-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                    >
                      <FilterIcon />
                      {t("filterButton")}
                    </button>

                    <div
                      id="products-filter-panel"
                      hidden={!filterOpen}
                      className="mt-4 grid gap-4 rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm md:p-5"
                    >
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-brand-dark">
                          {t("searchLabel")}
                        </span>
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
                        <p className="mb-2 text-sm font-semibold text-brand-dark">
                          {t("filterByType")}
                        </p>
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
                  </div>

                  {filteredGroups.length > 0 ? (
                    <div className="space-y-9 pb-2">
                      {filteredGroups.map((group) => (
                        <section key={group.type} aria-labelledby={`products-group-${group.type}`}>
                          <div className="mb-4 flex items-center justify-between border-b border-brand-dark/10 pb-2">
                            <h3
                              id={`products-group-${group.type}`}
                              className="font-display text-xl font-bold text-brand-dark md:text-2xl"
                            >
                              {tType(group.type)}
                            </h3>
                            {group.products.length > 0 ? (
                              <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-xs font-semibold text-text-muted">
                                {group.products.length}
                              </span>
                            ) : null}
                          </div>

                          {group.products.length > 0 ? (
                            <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
                              {group.products.map((product) => (
                                <CatalogueCard
                                  key={product.id}
                                  product={product}
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
                    <p role="status" className="rounded-xl border border-dashed border-brand-dark/15 bg-white/60 px-4 py-8 text-center font-serif text-sm text-text-muted">
                      {t("noResults")}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MotionConfig>
    </ModalPortal>
  );
}
