import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import CataloguePageContent from "@/components/catalogue/CataloguePageContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogue.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CataloguePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-light selection:bg-brand-orange/20 selection:text-brand-dark pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Subtle luxury ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-brand-orange/[0.04] via-brand-orange/[0.01] to-transparent"
        aria-hidden="true"
      />

      <CataloguePageContent pdfUrl="/catalogue.pdf" />
    </div>
  );
}

