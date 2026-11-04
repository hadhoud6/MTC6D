"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type CatalogueIntroProps = {
  onComplete?: () => void;
};

export default function CatalogueIntro({ onComplete }: CatalogueIntroProps) {
  const t = useTranslations("catalogue");
  const [isShowing, setIsShowing] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsShowing(false);
  }, []);

  // Entrance & Hold sequence timer
  useEffect(() => {
    // Total hold time: entrance ~0.8s + hold ~1.4s = ~2.2s before fading starts
    const timer = setTimeout(() => {
      setIsShowing(false);
    }, 2200);

    // Allow user to skip immediately with click or key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        setIsShowing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isDone) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsDone(true);
        onComplete?.();
      }}
    >
      {isShowing && (
        <motion.div
          key="catalogue-fullscreen-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 sm:px-10 text-center select-none cursor-pointer overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
        >
          {/* Subtle Ambient Radial Flare */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,93,54,0.14)_0%,_transparent_65%)]"
            aria-hidden="true"
          />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center">
            {/* Kicker with glowing flanking lines */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6"
            >
              <span
                className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#ef5d36] to-[#ef5d36]"
                style={{
                  boxShadow: "0 0 10px rgba(239, 93, 54, 0.8)",
                }}
              />
              <span
                className="text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-white"
                style={{
                  textShadow:
                    "0 0 8px rgba(255, 255, 255, 0.9), 0 0 18px rgba(239, 93, 54, 0.8), 0 0 32px rgba(239, 93, 54, 0.5)",
                }}
              >
                {t("kicker")}
              </span>
              <span
                className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#ef5d36] to-[#ef5d36]"
                style={{
                  boxShadow: "0 0 10px rgba(239, 93, 54, 0.8)",
                }}
              />
            </motion.div>

            {/* Glowing Title */}
            <motion.h1
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight leading-[1.1] mb-6"
              style={{
                textShadow:
                  "0 0 12px rgba(255, 255, 255, 0.95), 0 0 24px rgba(255, 255, 255, 0.6), 0 0 40px rgba(239, 93, 54, 0.9), 0 0 75px rgba(239, 93, 54, 0.7), 0 0 110px rgba(239, 93, 54, 0.4)",
              }}
            >
              {t("title")}
            </motion.h1>

            {/* Glowing Luxury Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center items-center gap-2.5 mb-6"
            >
              <span
                className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#ef5d36]/70 to-[#ef5d36]"
                style={{ boxShadow: "0 0 8px rgba(239, 93, 54, 0.6)" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-white"
                style={{
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(239, 93, 54, 0.9), 0 0 35px rgba(239, 93, 54, 0.7)",
                }}
              />
              <span
                className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent via-[#ef5d36]/70 to-[#ef5d36]"
                style={{ boxShadow: "0 0 8px rgba(239, 93, 54, 0.6)" }}
              />
            </motion.div>

            {/* Glowing Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl text-neutral-100 font-light leading-relaxed max-w-2xl mx-auto"
              style={{
                textShadow:
                  "0 0 10px rgba(255, 255, 255, 0.6), 0 0 22px rgba(239, 93, 54, 0.5), 0 0 45px rgba(239, 93, 54, 0.3)",
              }}
            >
              {t("subtitle")}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
