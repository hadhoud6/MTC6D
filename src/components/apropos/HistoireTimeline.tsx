"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { histoireMilestones, type Milestone } from "@/data/histoire";
import { localized, type Locale } from "@/types/content";

type HistoireTimelineProps = {
  locale: string;
};

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function HistoireTimeline({ locale }: HistoireTimelineProps) {
  const t = useTranslations("apropos.histoire");
  const currentLocale = (locale === "en" ? "en" : "fr") as Locale;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const activeMilestone: Milestone = histoireMilestones[currentIndex];

  const handleSelect = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < histoireMilestones.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <section
      id="histoire"
      className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      aria-label={t("title")}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-brand-orange mb-3">
          {t("kicker")}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight">
          {t("title")}
        </h2>
      </div>

      {/* Interactive Horizontal Timeline Navigation Track */}
      <div className="relative mb-12 md:mb-16">
        {/* Subtle background connecting line */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px bg-black/[0.08] -translate-y-1/2 hidden sm:block"
          aria-hidden="true"
        />

        {/* Milestone Buttons Track */}
        <div className="flex items-center justify-between sm:justify-around gap-2 overflow-x-auto pb-4 sm:pb-0 px-2 no-scrollbar">
          {histoireMilestones.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.year}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`group relative flex flex-col items-center py-2 px-3 sm:px-5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 ${
                  isActive
                    ? "text-brand-orange"
                    : "text-neutral-400 hover:text-neutral-800"
                }`}
                aria-pressed={isActive}
                aria-label={`${item.year} — ${localized(item.title, currentLocale)}`}
              >
                {/* Visual marker dot */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 mb-2 border ${
                    isActive
                      ? "bg-brand-orange border-brand-orange ring-4 ring-brand-orange/20 scale-125"
                      : "bg-white border-neutral-300 group-hover:border-neutral-500 group-hover:scale-110"
                  }`}
                />

                {/* Year Label */}
                <span
                  className={`font-serif text-lg sm:text-xl transition-all duration-300 ${
                    isActive ? "font-semibold scale-105" : "font-normal"
                  }`}
                >
                  {item.year}
                </span>

                {/* Optional mini pill tag on active */}
                {item.tag && (
                  <span
                    className={`mt-1 text-[10px] tracking-wider uppercase transition-opacity duration-300 hidden md:inline-block ${
                      isActive ? "opacity-100 text-neutral-500 font-medium" : "opacity-0"
                    }`}
                  >
                    {localized(item.tag, currentLocale)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Card with Framer Motion AnimatePresence */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-black/[0.06] shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] p-6 sm:p-10 md:p-14 min-h-[320px] flex flex-col justify-between">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeMilestone.year}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {/* Top metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] pb-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-brand-orange tracking-tight">
                  {activeMilestone.year}
                </span>
                {activeMilestone.tag && (
                  <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium bg-neutral-100 text-neutral-700">
                    {localized(activeMilestone.tag, currentLocale)}
                  </span>
                )}
              </div>

              {activeMilestone.subtitle && (
                <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium">
                  {localized(activeMilestone.subtitle, currentLocale)}
                </span>
              )}
            </div>

            {/* Content row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div
                className={`${
                  activeMilestone.image ? "lg:col-span-7" : "lg:col-span-12"
                } space-y-4`}
              >
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-brand-dark leading-snug">
                  {localized(activeMilestone.title, currentLocale)}
                </h3>
                <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
                  {localized(activeMilestone.description, currentLocale)}
                </p>
              </div>

              {activeMilestone.image && (
                <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-72 w-full rounded-2xl overflow-hidden border border-black/[0.06] bg-neutral-100 shadow-inner">
                  <Image
                    src={activeMilestone.image}
                    alt={localized(activeMilestone.title, currentLocale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Controls & Step Counter */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-black/[0.06]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-brand-orange/70" />
            <span>
              {t("stepIndicator", {
                current: currentIndex + 1,
                total: histoireMilestones.length,
              })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 ${
                currentIndex === 0
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed opacity-50"
                  : "border-black/[0.1] text-neutral-700 hover:border-brand-orange hover:text-brand-orange hover:bg-neutral-50 active:scale-95"
              }`}
              aria-label={t("prevAria")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === histoireMilestones.length - 1}
              className={`p-3 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 ${
                currentIndex === histoireMilestones.length - 1
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed opacity-50"
                  : "border-black/[0.1] text-neutral-700 hover:border-brand-orange hover:text-brand-orange hover:bg-neutral-50 active:scale-95"
              }`}
              aria-label={t("nextAria")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
