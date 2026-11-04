"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useMotionValue, type SpringOptions } from "framer-motion";

export interface ScrollProgressProps {
  className?: string;
  springOptions?: SpringOptions;
}

export function ScrollProgress({
  className,
  springOptions,
}: ScrollProgressProps) {
  const pathname = usePathname();
  const isHomePage =
    !pathname ||
    pathname === "/" ||
    pathname === "/fr" ||
    pathname === "/en" ||
    pathname === "/fr/" ||
    pathname === "/en/";

  const { scrollYProgress } = useScroll();
  const panelProgress = useMotionValue(0);

  useEffect(() => {
    if (!isHomePage) return;

    const onPanelChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (typeof customEvent.detail?.index === "number") {
        panelProgress.set(customEvent.detail.index / 5);
      }
    };

    window.addEventListener("mtc-panel-change", onPanelChange);
    return () => window.removeEventListener("mtc-panel-change", onPanelChange);
  }, [isHomePage, panelProgress]);

  const rawProgress = isHomePage ? panelProgress : scrollYProgress;
  const scaleX = useSpring(rawProgress, springOptions ?? { stiffness: 280, damping: 18, mass: 0.3 });

  return (
    <motion.div
      className={className}
      style={{
        scaleX,
        transformOrigin: "0%",
      }}
    />
  );
}
