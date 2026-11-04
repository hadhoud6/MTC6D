import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomePanelManager from "@/components/home/HomePanelManager";
import LoadingScreen from "@/components/home/LoadingScreen";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LoadingScreen />
      <div id="mtc-home-content" className="invisible">
        <HomePanelManager />
      </div>
    </>
  );
}
