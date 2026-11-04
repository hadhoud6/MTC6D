"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Link } from "@/lib/i18n/routing";
import { siteConfig } from "@/data/siteConfig";
import CompanyMap from "@/components/maps/CompanyMap";

const footerLinks = [
  { key: "usine", panelId: "usine" },
  { key: "produits", panelId: "produits" },
  { key: "configurateur", panelId: "configurateur" },
  { key: "projets", panelId: "projets" },
  { key: "devis", href: "/devis", panelId: undefined },
  { key: "contact", href: "/contact", panelId: undefined },
  { key: "catalogue", href: "/catalogue", panelId: undefined },
] as const;

const socialItems = [
  { key: "facebook", href: siteConfig.social.facebook },
  { key: "instagram", href: siteConfig.social.instagram },
  { key: "youtube", href: siteConfig.social.youtube },
  { key: "linkedin", href: siteConfig.social.linkedin },
] as const;

export default function Footer({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tSocial = useTranslations("social");
  const isHomePage = Boolean(
    pathname &&
      (pathname === "/" || pathname === "/fr" || pathname === "/en" ||
        pathname === "/fr/" || pathname === "/en/"),
  );

  const handlePanelLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    panelId: string,
  ) => {
    event.preventDefault();

    if (!isHomePage) {
      window.location.assign(`/${locale}#${panelId}`);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("mtc-goto-panel", {
        detail: { id: panelId },
      }),
    );
  };

  return (
    <footer id="site-footer" className={`relative isolate overflow-hidden border-t border-stone-200 bg-white text-black ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-brand-orange/5 blur-3xl" />
        <Image
          src={siteConfig.assets.logo}
          alt=""
          width={480}
          height={480}
          className="absolute -left-16 bottom-[-5rem] h-[27rem] w-[27rem] object-contain opacity-[0.065] mix-blend-multiply sm:-left-12 lg:bottom-[-4rem]"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-12 px-4 py-16 md:grid-cols-2 lg:grid-cols-[0.85fr_1fr_1.65fr] lg:gap-x-16 lg:px-8">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-black">
            {tFooter("usefulLinks")}
          </h3>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.key}>
                {link.panelId ? (
                  <a
                    href={`/${locale}#${link.panelId}`}
                    onClick={(event) => handlePanelLinkClick(event, link.panelId)}
                    className="text-sm text-stone-600 transition hover:text-black"
                  >
                    {tNav(link.key)}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 transition hover:text-black"
                  >
                    {tNav(link.key)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-black">
            {tFooter("contactUs")}
          </h3>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="transition hover:text-black"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition hover:text-black"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>

        <div className="flex min-h-[24rem] flex-col md:col-span-2 lg:col-span-1 lg:min-h-[30rem]">
          <h3 className="mb-4 font-display text-lg font-bold text-black">
            {tFooter("mapTitle")}
          </h3>
          <div className="min-h-[22rem] flex-1 overflow-hidden rounded-xl border border-stone-200 bg-white/70 shadow-sm md:min-h-[26rem] lg:min-h-0">
            <CompanyMap
              className="h-full w-full"
              directionsLabel={tFooter("directions")}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row lg:px-8">
          <div className="flex gap-4">
            {socialItems.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tSocial(key)}
                className="text-sm text-stone-600 transition hover:text-black"
              >
                {tSocial(key)}
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-stone-500">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
