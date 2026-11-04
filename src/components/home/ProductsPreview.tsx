"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import FadeInSection from "@/components/common/FadeInSection";
import { TextEffect } from "@/components/core/text-effect";
import GhostButton from "@/components/common/GhostButton";
import { siteConfig } from "@/data/siteConfig";
import ProductsCataloguePopup from "./ProductsCataloguePopup";
import { OPEN_CATALOGUE_SESSION_KEY } from "@/components/devis/QuoteBasketContext";

interface ProductsPreviewProps {
  isActive?: boolean;
}

export default function ProductsPreview({ isActive = true }: ProductsPreviewProps) {
  const t = useTranslations("products");
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const bgUrl = siteConfig.assets.productsSectionBackground;

  useEffect(() => {
    if (window.sessionStorage.getItem(OPEN_CATALOGUE_SESSION_KEY) !== "1") return;
    window.sessionStorage.removeItem(OPEN_CATALOGUE_SESSION_KEY);
    setCatalogueOpen(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <>
      <div
        onMouseMove={handleMouseMove}
        className="relative flex h-full min-h-[100dvh] w-full items-center justify-center overflow-hidden px-4 py-8 text-center"
      >
        {/* Parallax Background with Mouse Tracking & Subtle Scaling */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: mousePos.x * -25,
            y: mousePos.y * -25,
            scale: isActive ? 1.06 : 1,
          }}
          transition={{
            x: { type: "spring", stiffness: 100, damping: 20 },
            y: { type: "spring", stiffness: 100, damping: 20 },
            scale: { duration: 1.2, ease: "easeOut" },
          }}
          aria-hidden
        >
          <Image
            src={bgUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.52) 50%, rgba(0, 0, 0, 0.72) 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 lg:px-8">
          <FadeInSection trigger={isActive} delay={0.1}>
            <TextEffect
              per="word"
              as="h2"
              preset="slide"
              trigger={isActive}
              className="mb-6 font-display text-4xl font-bold text-white max-md:text-3xl max-[480px]:text-2xl sm:text-5xl"
              style={{ textShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
            >
              {t("title")}
            </TextEffect>
          </FadeInSection>

          <FadeInSection trigger={isActive} delay={0.25}>
            <p
              className="mx-auto mb-8 max-w-3xl text-base sm:text-lg leading-relaxed text-white/90 md:mb-10"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              {t("description")}
            </p>
          </FadeInSection>

          <FadeInSection trigger={isActive} delay={0.4}>
            <div className="inline-block">
              <GhostButton
                variant="orange"
                size="lg"
                onClick={() => setCatalogueOpen(true)}
              >
                {t("viewAll")}
              </GhostButton>
            </div>
          </FadeInSection>
        </div>
      </div>

      <ProductsCataloguePopup open={catalogueOpen} onClose={() => setCatalogueOpen(false)} />
    </>
  );
}
