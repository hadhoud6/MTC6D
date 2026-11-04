import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { defaultCountries } from "react-international-phone";
import FadeInSection from "@/components/common/FadeInSection";
import DevisForm from "@/components/devis/DevisForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devis.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DevisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("devis");
  const requestHeaders = await headers();
  const detectedCountry = (
    requestHeaders.get("x-vercel-ip-country") ?? requestHeaders.get("cf-ipcountry") ?? ""
  ).toLowerCase();
  const initialCountry = defaultCountries.some((country) => country[1] === detectedCountry)
    ? detectedCountry
    : undefined;

  return (
    <section className="bg-brand-light px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeInSection>
          <header className="mb-10 text-center md:mb-12">
            <h1 className="font-display text-4xl font-bold text-brand-dark md:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">{t("pageIntro")}</p>
          </header>
          <DevisForm locale={locale} initialCountry={initialCountry} />
        </FadeInSection>
      </div>
    </section>
  );
}
