"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { routing } from "@/lib/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/20 p-1 backdrop-blur-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === loc
              ? "bg-brand-orange text-brand-dark"
              : "text-white/80 hover:text-white"
          }`}
          aria-current={locale === loc ? "true" : undefined}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
