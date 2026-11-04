import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/types/content";
import UsinePageContent from "@/components/usine/UsinePageContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "usine.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function UsinePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-light selection:bg-brand-orange/20 selection:text-brand-dark">
      <UsinePageContent locale={locale as Locale} />
    </div>
  );
}
