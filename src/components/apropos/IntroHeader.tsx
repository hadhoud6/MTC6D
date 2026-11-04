import Image from "next/image";
import { getTranslations } from "next-intl/server";

type IntroHeaderProps = {
  locale: string;
};

export default async function IntroHeader({ locale }: IntroHeaderProps) {
  const t = await getTranslations({ locale, namespace: "apropos.intro" });

  return (
    <header className="relative pt-28 pb-16 md:pt-36 md:pb-24 text-center px-4 sm:px-6 lg:px-8">
      {/* Subtle decorative background glow for luxury depth */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-orange/[0.03] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Kicker label */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-6 sm:w-10 bg-brand-orange/40" />
          <span className="font-caveat italic text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-brand-orange">
            {t("kicker")}
          </span>
          <span className="h-px w-6 sm:w-10 bg-brand-orange/40" />
        </div>

        {/* Large luxury serif heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-brand-dark tracking-tight leading-[1.12] mb-8 max-w-4xl mx-auto">
          {t("title")}
        </h1>

        {/* Editorial lead paragraphs */}
        <div className="space-y-4 text-base sm:text-lg md:text-xl font-light text-neutral-600 leading-relaxed max-w-3xl mx-auto">
          <p>{t("paragraph1")}</p>
          <p className="text-neutral-500 text-sm sm:text-base md:text-lg">
            {t("paragraph2")}
          </p>
        </div>

        {/* Subtle accent divider */}
        <div className="mt-10 mb-12 flex justify-center items-center gap-2">
          <span className="h-px w-12 bg-black/[0.08]" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
          <span className="h-px w-12 bg-black/[0.08]" />
        </div>

        {/* Intro Header banner image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden border border-black/[0.06] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] bg-neutral-100">
          <Image
            // SWAP: temporary stock photo, replace with real client photo
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt={t("title")}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
