import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FadeInSection from "@/components/common/FadeInSection";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <section className="min-h-screen bg-brand-light px-4 pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <FadeInSection>
          <header className="mb-12 text-center md:mb-16">
            <h1 className="font-display text-4xl font-bold text-brand-dark md:text-5xl lg:text-6xl">
              {t("pageTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted md:text-xl">
              {t("pageIntro")}
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            {/* Left Column: Contact Details, Hours, WhatsApp, Socials, Map */}
            <div className="lg:col-span-5">
              <ContactInfo locale={locale} />
            </div>

            {/* Right Column: Message Form */}
            <div className="lg:col-span-7">
              <div className="sticky top-28">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
