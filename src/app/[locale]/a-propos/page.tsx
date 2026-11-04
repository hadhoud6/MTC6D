import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import FadeInSection from "@/components/common/FadeInSection";
import IntroHeader from "@/components/apropos/IntroHeader";
import HistoireTimeline from "@/components/apropos/HistoireTimeline";
import ValeursSection from "@/components/apropos/ValeursSection";
import CertificationsSection from "@/components/apropos/CertificationsSection";
import CoordonneesSection from "@/components/apropos/CoordonneesSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apropos.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AProposPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-light selection:bg-brand-orange/20 selection:text-brand-dark">
      {/* 1. Intro Header */}
      <FadeInSection>
        <IntroHeader locale={locale} />
      </FadeInSection>

      {/* 2. Histoire — Interactive Timeline */}
      <FadeInSection delay={0.1}>
        <HistoireTimeline locale={locale} />
      </FadeInSection>

      {/* 3. Valeurs */}
      <FadeInSection delay={0.1}>
        <ValeursSection locale={locale} />
      </FadeInSection>

      {/* 4. Certifications */}
      <FadeInSection delay={0.1}>
        <CertificationsSection locale={locale} />
      </FadeInSection>

      {/* 5. Coordonnées (Closing Section) */}
      <FadeInSection delay={0.1}>
        <CoordonneesSection locale={locale} />
      </FadeInSection>
    </div>
  );
}
