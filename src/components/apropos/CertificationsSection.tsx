import { getTranslations } from "next-intl/server";
import { Award, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { certifications, type Certification } from "@/data/certifications";
import { localized, type Locale } from "@/types/content";

type CertificationsSectionProps = {
  locale: string;
};

const certIcons = [Award, ShieldCheck, CheckCircle2, Sparkles];

export default async function CertificationsSection({
  locale,
}: CertificationsSectionProps) {
  const t = await getTranslations({ locale, namespace: "apropos.certifications" });
  const currentLocale = (locale === "en" ? "en" : "fr") as Locale;

  return (
    <section
      id="certifications"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      aria-label={t("title")}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
        <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-brand-orange mb-3">
          {t("kicker")}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight">
          {t("title")}
        </h2>
      </div>

      {/* Clean minimal row of certification cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {certifications.map((cert: Certification, index: number) => {
          const Icon = certIcons[index % certIcons.length];

          return (
            <div
              key={cert.id}
              className="bg-neutral-50/60 rounded-2xl border border-black/[0.05] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:border-black/[0.1] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider font-semibold uppercase bg-white border border-black/[0.06] text-brand-orange shadow-2xs">
                    {cert.code}
                  </span>
                  <Icon className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-lg font-medium text-brand-dark mb-2 leading-snug">
                  {localized(cert.title, currentLocale)}
                </h3>

                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  {localized(cert.description, currentLocale)}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400">
                <span>{localized(cert.badge, currentLocale)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
