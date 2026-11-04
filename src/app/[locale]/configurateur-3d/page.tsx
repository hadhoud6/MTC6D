import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/types/content";
import Configurator3DLoader from "@/components/configurator/Configurator3DLoader";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configurator" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ConfigurateurPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-light selection:bg-brand-orange/20 selection:text-brand-dark">
      <Configurator3DLoader locale={locale as Locale} />
    </div>
  );
}
