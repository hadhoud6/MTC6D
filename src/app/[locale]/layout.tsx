import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ScrollProgress } from "@/components/core/scroll-progress";
import Navbar from "@/components/layout/Navbar";
import FloatingSocialBar from "@/components/layout/FloatingSocialBar";
import LayoutFooter from "@/components/layout/LayoutFooter";
import { QuoteBasketFloatingButton, QuoteBasketProvider } from "@/components/devis/QuoteBasketContext";
import { routing } from "@/lib/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <QuoteBasketProvider>
        <ScrollProgress
          className="fixed top-0 left-0 h-0.5 w-full z-[60] pointer-events-none bg-[linear-gradient(to_right,rgba(239,93,54,0),#ef5d36_75%,#ef5d36_100%)]"
          springOptions={{ stiffness: 280, damping: 18, mass: 0.3 }}
        />
        <Navbar />
        <main>{children}</main>
        <FloatingSocialBar />
        <LayoutFooter />
        <QuoteBasketFloatingButton />
      </QuoteBasketProvider>
    </NextIntlClientProvider>
  );
}
