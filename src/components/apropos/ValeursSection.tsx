import { getTranslations } from "next-intl/server";
import { Gem, Compass, Layers, ShieldCheck } from "lucide-react";
import { valeurs, type Valeur } from "@/data/valeurs";
import { localized, type Locale } from "@/types/content";

type ValeursSectionProps = {
  locale: string;
};

const iconMap = {
  gem: Gem,
  compass: Compass,
  layers: Layers,
  "shield-check": ShieldCheck,
};

export default async function ValeursSection({ locale }: ValeursSectionProps) {
  const t = await getTranslations({ locale, namespace: "apropos.valeurs" });
  const currentLocale = (locale === "en" ? "en" : "fr") as Locale;

  return (
    <section
      id="valeurs"
      className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label={t("title")}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-brand-orange mb-3">
          {t("kicker")}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight">
          {t("title")}
        </h2>
      </div>

      {/* Grid of Minimal Cards with Generous Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {valeurs.map((valeur: Valeur) => {
          const IconComponent = iconMap[valeur.iconName] || Gem;

          return (
            <div
              key={valeur.id}
              className="group relative bg-white rounded-2xl border border-black/[0.06] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:border-brand-orange/30 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.05)]"
            >
              <div>
                {/* Top Number and Icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-neutral-400 tracking-wider">
                    {valeur.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/[0.06] text-brand-orange flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Value Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-brand-dark mb-4 group-hover:text-brand-orange transition-colors duration-200">
                  {localized(valeur.title, currentLocale)}
                </h3>

                {/* Value Short Line */}
                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                  {localized(valeur.description, currentLocale)}
                </p>
              </div>

              {/* Minimal bottom hairline accent */}
              <div className="mt-8 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                <span className="h-0.5 w-0 bg-brand-orange transition-all duration-300 group-hover:w-8" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
