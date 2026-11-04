"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usineMachines } from "@/data/usine";
import type { UsineMachine } from "@/data/usine";
import type { Locale } from "@/types/content";
import { localized } from "@/types/content";
import ModalPortal from "@/components/common/ModalPortal";
import CatalogueImageCarousel from "./CatalogueImageCarousel";
import { CATALOGUE_CONTENT_TRANSITION, CATALOGUE_CONTENT_VARIANTS, CATALOGUE_FADE_TRANSITION, CATALOGUE_FADE_VARIANTS } from "@/lib/motion";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

const CatalogueCard = memo(function CatalogueCard({
  machine,
  expanded,
  onToggle,
}: {
  machine: UsineMachine;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const locale = useLocale() as Locale;
  const title = localized(machine.title, locale);
  const category = localized(machine.category, locale);
  const description = localized(machine.description, locale);
  const handleToggle = useCallback(() => onToggle(machine.id), [onToggle, machine.id]);

  return (
    <motion.article
      data-catalogue-card={machine.id}
      style={{ borderRadius: 16 }}
      className={`relative overflow-hidden bg-white ${expanded ? "z-10 md:col-span-2 lg:col-span-2" : "cursor-pointer"}`}
      onClick={() => { if (!expanded) handleToggle(); }}
    >
      <CatalogueImageCarousel images={machine.images} alt={title} expanded={expanded} onToggle={handleToggle} />
      <div className={`p-4 ${expanded ? "md:p-6" : ""}`}>
        <div className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-0.5 font-serif text-xs text-white">{category}</div>
        <h3 className={`font-display font-bold text-brand-dark ${expanded ? "mb-3 text-xl md:text-2xl" : "mb-1 text-base md:text-lg"}`}>{title}</h3>
        {!expanded ? <p className="line-clamp-2 font-serif text-sm text-text-muted">{description}</p> : null}
        <AnimatePresence initial={false}>
          {expanded ? <motion.div key="expanded-machine" layout="position" variants={CATALOGUE_CONTENT_VARIANTS} initial="hidden" animate="visible" exit="exit" transition={CATALOGUE_CONTENT_TRANSITION}><p className="font-serif text-sm leading-relaxed text-text-muted md:text-base">{description}</p></motion.div> : null}
        </AnimatePresence>
      </div>
      {expanded ? <button type="button" onClick={(e) => { e.stopPropagation(); handleToggle(); }} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/60" aria-label="Collapse"><ChevronUpIcon /></button> : null}
    </motion.article>
  );
});

export default function UsineCataloguePopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("usine");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expandedId) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const frame = window.requestAnimationFrame(() => {
      const card = Array.from(
        container.querySelectorAll<HTMLElement>("[data-catalogue-card]"),
      ).find((item) => item.dataset.catalogueCard === expandedId);
      if (!card) return;

      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const targetScrollTop =
        container.scrollTop +
        cardRect.top -
        containerRect.top +
        cardRect.height / 2 -
        container.clientHeight / 2;

      container.scrollTo({
        top: Math.max(
          0,
          Math.min(targetScrollTop, container.scrollHeight - container.clientHeight),
        ),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [expandedId]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((previous) => (previous === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setExpandedId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setExpandedId(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  return (
    <ModalPortal>
      <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false}>
        {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="usine-catalogue-popup-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-4 md:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={CATALOGUE_FADE_VARIANTS}
          transition={CATALOGUE_FADE_TRANSITION}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            className="relative flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-brand-light shadow-xl md:rounded-3xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={CATALOGUE_FADE_VARIANTS}
            transition={CATALOGUE_FADE_TRANSITION}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full border border-brand-dark/10 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 md:right-6 md:top-6"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div
              ref={scrollContainerRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6"
            >
              <header className="mb-5 border-b border-black/5 px-12 pb-5 text-center md:mb-6 md:px-6 md:pb-6">
                <h2
                  id="usine-catalogue-popup-title"
                  className="font-display text-2xl font-bold text-brand-dark md:text-4xl"
                >
                  {t("title")}
                </h2>
                <p className="mt-2 font-serif text-sm text-text-muted md:text-base">
                  {t("description")}
                </p>
              </header>

              <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
                {usineMachines.map((machine) => (
                  <CatalogueCard
                    key={machine.id}
                    machine={machine}
                    expanded={expandedId === machine.id}
                    onToggle={toggleExpanded}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        ) : null}
      </AnimatePresence>
      </MotionConfig>
    </ModalPortal>
  );
}
