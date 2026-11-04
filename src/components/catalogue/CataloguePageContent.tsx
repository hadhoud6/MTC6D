"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CatalogueIntro from "./CatalogueIntro";
import CatalogueViewer from "./CatalogueViewer";
import { Hand } from "lucide-react";

type CataloguePageContentProps = {
  pdfUrl?: string;
};

export default function CataloguePageContent({
  pdfUrl = "/catalogue.pdf",
}: CataloguePageContentProps) {
  const t = useTranslations("catalogue");
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <>
      {/* Full-screen Glowing Intro Animation Overlay */}
      <CatalogueIntro onComplete={() => setIsIntroComplete(true)} />

      {/* Main Catalogue Page Layout */}
      <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-white px-4 py-8 text-brand-dark sm:py-10">
        <div className="relative mx-auto max-w-[1800px] sm:px-2 lg:px-6">
        {/* Subtle top hint revealed with the flipbook */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isIntroComplete ? 1 : 0,
            y: isIntroComplete ? 0 : -10,
          }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex justify-center mb-3 sm:mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-orange/20 text-xs sm:text-sm text-neutral-600 shadow-xs backdrop-blur-xs select-none">
            <Hand className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            <span>{t("instructions")}</span>
          </div>
        </motion.div>

        {/* Flipbook Showcase: premium magazine presentation */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: isIntroComplete ? 1 : 0,
            scale: isIntroComplete ? 1 : 0.98,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center items-center my-2 sm:my-4"
        >
          <CatalogueViewer pdfUrl={pdfUrl} />
        </motion.section>
        </div>
      </main>
    </>
  );
}
