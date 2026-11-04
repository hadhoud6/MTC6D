"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TextEffect } from "@/components/core/text-effect";
import GhostButton from "@/components/common/GhostButton";
import { siteConfig } from "@/data/siteConfig";
import ConfiguratorPopup from "./ConfiguratorPopup";

import { motion } from "framer-motion";
import FadeInSection from "@/components/common/FadeInSection";

interface ConfiguratorTeaserProps {
  isActive?: boolean;
}

export default function ConfiguratorTeaser({ isActive = true }: ConfiguratorTeaserProps) {
  const t = useTranslations("configurator");
  const [popupOpen, setPopupOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        <motion.div
          className="absolute inset-0"
          animate={{
            x: mousePos.x * -20,
            y: mousePos.y * -20,
            scale: isActive ? 1.05 : 1,
          }}
          transition={{
            x: { type: "spring", stiffness: 100, damping: 20 },
            y: { type: "spring", stiffness: 100, damping: 20 },
            scale: { duration: 1.2, ease: "easeOut" },
          }}
          aria-hidden
        >
          <Image
            src={siteConfig.assets.configuratorBackground}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/65 pointer-events-none" aria-hidden />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white lg:px-8">
          <FadeInSection trigger={isActive} delay={0.1}>
            <TextEffect
              per="word"
              as="h2"
              preset="slide"
              trigger={isActive}
              className="font-display text-3xl sm:text-4xl font-bold md:text-5xl"
            >
              {t("title")}
            </TextEffect>
          </FadeInSection>

          <FadeInSection trigger={isActive} delay={0.25}>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-white/85 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </FadeInSection>

          <FadeInSection trigger={isActive} delay={0.4}>
            <div className="mt-8 sm:mt-10 inline-block">
              <GhostButton
                variant="orange"
                size="lg"
                onClick={() => setPopupOpen(true)}
              >
                {t("cta")}
              </GhostButton>
            </div>
          </FadeInSection>
        </div>
      </div>

      <ConfiguratorPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );
}
