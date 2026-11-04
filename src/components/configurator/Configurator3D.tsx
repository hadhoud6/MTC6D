"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import GhostButton from "@/components/common/GhostButton";
import { useQuoteBasket } from "@/components/devis/QuoteBasketContext";
import { flyQuoteArrow } from "@/lib/flyQuoteArrow";
import { configuratorMarbles } from "@/data/configuratorMarbles";
import type { Locale, Product } from "@/types/content";
import { localized } from "@/types/content";
import KitchenViewer, {
  type ConfiguratorFinish,
} from "@/components/configurator/KitchenViewer";

const REFERENCE_IMAGE = "/configurateur/kitchen-reference.webp";

export default function Configurator3D({ locale }: { locale: Locale }) {
  const t = useTranslations("configurator.tool");
  const tConfig = useTranslations("configurator");
  const activeLocale = useLocale() as Locale;
  const displayLocale = locale ?? activeLocale;

  const [selected, setSelected] = useState<Product>(configuratorMarbles[0]);
  const [finish, setFinish] = useState<ConfiguratorFinish>("lustre");

  const {
    addCatalogueProduct,
    isCatalogueProductSelected,
    canAddCatalogueProduct,
  } = useQuoteBasket();

  const inQuote = isCatalogueProductSelected(selected);
  const canAdd = canAddCatalogueProduct(selected);
  const textureUrl = useMemo(() => selected.image, [selected]);

  const handleAdd = (event: React.MouseEvent<HTMLElement>) => {
    if (inQuote || !canAdd) return;
    addCatalogueProduct(selected);
    flyQuoteArrow(event.currentTarget);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-28 md:px-8 md:pt-36">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-brand-dark md:text-5xl">
            {tConfig("title")}
          </h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-brand-dark/75">
            {tConfig("description")}
          </p>
        </div>
        <figure className="w-40 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={REFERENCE_IMAGE}
            alt={t("referenceAlt")}
            className="h-28 w-full rounded-xl object-cover shadow-md"
          />
          <figcaption className="mt-2 text-center text-xs text-brand-dark/60">
            {t("referenceCaption")}
          </figcaption>
        </figure>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#1c1a18] shadow-xl">
        <div className="aspect-[16/10] min-h-[420px] w-full sm:aspect-[16/9]">
          <KitchenViewer
            textureUrl={textureUrl}
            finish={finish}
            loadingLabel={t("loading")}
            unavailableLabel={t("webglUnavailable")}
            referenceImage={REFERENCE_IMAGE}
            referenceAlt={t("referenceAlt")}
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
          {t("dragHint")}
        </p>
        <p className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {localized(selected.name, displayLocale)}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-dark">
            {t("marbleLabel")}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {configuratorMarbles.map((product) => {
              const active = product.slug === selected.slug;
              return (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setSelected(product)}
                  aria-pressed={active}
                  className={`group overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition hover:shadow-md ${
                    active
                      ? "border-brand-orange"
                      : "border-black/[0.06] hover:border-brand-orange/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={localized(product.name, displayLocale)}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="block px-3 py-2.5">
                    <span className="block truncate text-sm font-semibold text-brand-dark">
                      {localized(product.name, displayLocale)}
                    </span>
                    <span className="block text-xs text-brand-dark/60">
                      {localized(product.tag, displayLocale)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-dark/65">
            {t("surfacesNote")}
          </p>
        </div>

        <div className="lg:w-72">
          <h2 className="font-display text-xl font-bold text-brand-dark">
            {t("finishLabel")}
          </h2>
          <div className="mt-4 flex rounded-full border border-black/10 bg-white p-1">
            {(
              [
                { value: "lustre", label: t("finishPolished") },
                { value: "ponceMat", label: t("finishMatte") },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFinish(option.value)}
                aria-pressed={finish === option.value}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  finish === option.value
                    ? "bg-brand-dark text-white"
                    : "text-brand-dark/70 hover:text-brand-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brand-dark/65">
            {t("finishNote")}
          </p>

          <div className="mt-6">
            <GhostButton
              variant="orange"
              size="lg"
              fullWidth
              disabled={inQuote || !canAdd}
              onClick={handleAdd}
            >
              {inQuote ? t("addedToQuote") : t("addToQuote")}
            </GhostButton>
            {!canAdd && !inQuote ? (
              <p className="mt-3 text-center text-sm text-brand-dark/65">
                {t("quoteFull")}
              </p>
            ) : null}
            {inQuote ? (
              <div className="mt-3 text-center">
                <Link
                  href="/devis"
                  className="text-sm font-medium text-brand-orange underline-offset-4 hover:underline"
                >
                  {t("viewQuote")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
