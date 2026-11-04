"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";
import GhostButton from "@/components/common/GhostButton";
import BrandLogo from "@/components/common/BrandLogo";
import { siteConfig } from "@/data/siteConfig";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { key: "accueil", href: "/" },
  { key: "apropos", href: "/a-propos" },
  { key: "usine", href: "#usine" },
  { key: "produits", href: "#produits" },
  { key: "configurateur", href: "#configurateur" },
  { key: "projets", href: "#projets" },
  { key: "devis", href: "/devis" },
  { key: "contact", href: "/contact" },
] as const;

const blackAtTopRoutes = ["/devis", "/contact", "/a-propos", "/catalogue"];

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHomePage =
    !pathname ||
    pathname === "/" ||
    pathname === "/fr" ||
    pathname === "/en" ||
    pathname === "/fr/" ||
    pathname === "/en/";
  const isCataloguePage = Boolean(
    pathname &&
      (pathname === "/catalogue" ||
        pathname.endsWith("/catalogue") ||
        pathname.endsWith("/catalogue/")),
  );
  const useBlackAtTop = Boolean(
    pathname &&
      blackAtTopRoutes.some(
        (route) =>
          pathname === route ||
          pathname.endsWith(route) ||
          pathname.endsWith(`${route}/`),
      ),
  );
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanelId, setActivePanelId] = useState<string>("accueil");
  const [isPanelLight, setIsPanelLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to homepage panel changes
  useEffect(() => {
    if (!isHomePage) return;

    const onPanelChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number; id: string; isLight?: boolean }>;
      if (customEvent.detail) {
        setActivePanelId(customEvent.detail.id);
        setIsPanelLight(Boolean(customEvent.detail.isLight));
      }
    };

    window.addEventListener("mtc-panel-change", onPanelChange);
    return () => window.removeEventListener("mtc-panel-change", onPanelChange);
  }, [isHomePage]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHomePage) {
      if (href === "/" || href === "#accueil") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("mtc-goto-panel", { detail: { index: 0, id: "accueil" } }));
        setMobileOpen(false);
        return;
      }
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.replace("#", "");
        window.dispatchEvent(new CustomEvent("mtc-goto-panel", { detail: { id } }));
        setMobileOpen(false);
        return;
      }
    }
    setMobileOpen(false);
  };

  const isLightMode = isHomePage ? isPanelLight : scrolled || useBlackAtTop;

  const navLinkClass = isLightMode
    ? "text-brand-dark/80 hover:text-brand-orange"
    : "text-white/90 hover:text-brand-orange";

  if (isCataloguePage) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src={siteConfig.assets.logo}
              alt=""
              width={48}
              height={48}
              className="h-9 w-auto shrink-0 sm:h-10 md:h-12"
              priority
            />
            <BrandLogo size="sm" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2.5 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src={siteConfig.assets.logo}
              alt=""
              width={48}
              height={48}
              className="h-9 w-auto shrink-0 sm:h-10 md:h-12"
              priority
            />
            <BrandLogo size="sm" />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
            {navItems.map((item) => {
              const isPanelActive =
                isHomePage &&
                ((item.href === "#" + activePanelId) ||
                  (item.href === "/" && activePanelId === "accueil"));

              const linkClass = isPanelActive
                ? "text-brand-orange font-bold text-sm transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-brand-orange after:rounded-full"
                : `text-sm font-semibold transition-colors ${navLinkClass}`;

              return item.href.startsWith("#") ? (
                isHomePage ? (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={linkClass}
                  >
                    {t(item.key)}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    href={`/${item.href}`}
                    className={linkClass}
                  >
                    {t(item.key)}
                  </Link>
                )
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={linkClass}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <GhostButton
              href="/catalogue"
              variant={isLightMode ? "black" : "orange"}
              size="sm"
              className="hidden md:inline-flex scale-[1.1]"
            >
              {t("catalogue")}
            </GhostButton>
            <button
              type="button"
              className="relative z-50 flex h-9 w-9 sm:h-10 sm:w-10 flex-col items-center justify-center gap-1.5 xl:hidden cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={mobileOpen}
            >
              <span
                className={`block h-0.5 w-6 transition-all ${isLightMode || mobileOpen ? "bg-brand-dark" : "bg-white"} ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all ${isLightMode || mobileOpen ? "bg-brand-dark" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all ${isLightMode || mobileOpen ? "bg-brand-dark" : "bg-white"} ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-40 flex w-[min(100%,20rem)] flex-col bg-brand-dark p-6 pt-20 xl:hidden"
              aria-label="Mobile"
            >
              {navItems.map((item, i) => {
                const isPanelActive =
                  isHomePage &&
                  ((item.href === "#" + activePanelId) ||
                    (item.href === "/" && activePanelId === "accueil"));

                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item.href.startsWith("#") ? (
                      isHomePage ? (
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className={`block border-b border-white/10 py-4 text-lg hover:text-brand-orange ${
                            isPanelActive ? "text-brand-orange font-bold" : "text-white"
                          }`}
                        >
                          {t(item.key)}
                        </a>
                      ) : (
                        <Link
                          href={`/${item.href}`}
                          onClick={() => setMobileOpen(false)}
                          className="block border-b border-white/10 py-4 text-lg text-white hover:text-brand-orange"
                        >
                          {t(item.key)}
                        </Link>
                      )
                    ) : (
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`block border-b border-white/10 py-4 text-lg hover:text-brand-orange ${
                          isPanelActive ? "text-brand-orange font-bold" : "text-white"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
              <div className="mt-6">
                <GhostButton
                  href="/catalogue"
                  onClick={() => setMobileOpen(false)}
                  variant="orange"
                  size="md"
                  fullWidth
                  className="scale-[1.1]"
                >
                  {t("catalogue")}
                </GhostButton>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
