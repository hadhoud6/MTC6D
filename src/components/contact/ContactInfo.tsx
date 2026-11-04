import { getTranslations } from "next-intl/server";
import { siteConfig, getWhatsAppUrl } from "@/data/siteConfig";
import CompanyMap from "@/components/maps/CompanyMap";
import { localized, type Locale } from "@/types/content";

type ContactInfoProps = {
  locale: string;
};

export default async function ContactInfo({ locale }: ContactInfoProps) {
  const t = await getTranslations({ locale, namespace: "contact.info" });
  const tSocial = await getTranslations({ locale, namespace: "social" });
  const currentLocale = (locale === "en" ? "en" : "fr") as Locale;
  const whatsappUrl = getWhatsAppUrl();

  const socialLinks = [
    {
      key: "facebook",
      label: tSocial("facebook"),
      href: siteConfig.social.facebook,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: tSocial("instagram"),
      href: siteConfig.social.instagram,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: "linkedin",
      label: tSocial("linkedin"),
      href: siteConfig.social.linkedin,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      key: "youtube",
      label: tSocial("youtube"),
      href: siteConfig.social.youtube,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contact Details Card */}
      <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <header className="mb-6">
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-text-muted">{t("subtitle")}</p>
        </header>

        <dl className="space-y-5">
          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("addressLabel")}
              </dt>
              <dd className="mt-0.5 text-base font-medium text-brand-dark">
                {siteConfig.address}
              </dd>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("phoneLabel")}
              </dt>
              <dd className="mt-0.5 text-base font-medium text-brand-dark">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="transition hover:text-brand-orange hover:underline"
                >
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("emailLabel")}
              </dt>
              <dd className="mt-0.5 text-base font-medium text-brand-dark">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all transition hover:text-brand-orange hover:underline"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
          </div>
        </dl>

        {/* WhatsApp Business CTA */}
        <div className="mt-8 border-t border-brand-dark/10 pt-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-xl bg-emerald-600 px-5 py-4 text-white transition hover:bg-emerald-700 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold leading-tight">{t("whatsappCta")}</p>
                <p className="text-xs text-white/80">{t("whatsappDesc")}</p>
              </div>
            </div>
            <svg className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Business Hours Card */}
      <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-brand-dark">
            {t("hoursTitle")}
          </h3>
        </div>

        <ul className="space-y-2.5 divide-y divide-brand-dark/5">
          {siteConfig.hours.map((entry, index) => {
            const dayLabel = localized(entry.day, currentLocale);
            const hoursLabel =
              typeof entry.hours === "string"
                ? entry.hours
                : localized(entry.hours, currentLocale);

            return (
              <li
                key={index}
                className={`flex items-center justify-between text-sm ${index > 0 ? "pt-2.5" : ""}`}
              >
                <span className="font-semibold text-brand-dark">{dayLabel}</span>
                <span className="text-text-muted">{hoursLabel}</span>
              </li>
            );
          })}
        </ul>

        {siteConfig.hoursNote && (
          <p className="mt-4 rounded-lg bg-brand-light p-3 text-xs italic text-text-muted">
            {localized(siteConfig.hoursNote, currentLocale)}
          </p>
        )}
      </div>

      {/* Social Links Card */}
      <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-4 font-display text-lg font-bold text-brand-dark">
          {t("socialTitle")}
        </h3>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ key, label, href, icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-2.5 rounded-full border border-brand-dark/15 bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition hover:border-brand-orange hover:bg-brand-orange hover:text-white"
            >
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Map Card */}
      <div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-3 font-display text-lg font-bold text-brand-dark">
          {t("mapTitle")}
        </h3>
        <div className="overflow-hidden rounded-xl">
          <CompanyMap
            className="h-[400px] w-full md:h-[500px]"
            directionsLabel={t("directions")}
          />
        </div>
      </div>
    </div>
  );
}
