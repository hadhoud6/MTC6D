"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export type BrandLogoSize = "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  className?: string;
};

const arabicWordmark = "مــــعــــمــــل الــــرخــــام تــــونــــس قــــرطــــاج";

const sizeStyles: Record<BrandLogoSize, { name: string; arabic: string; since: string; sinceGap: string }> = {
  sm: {
    name: "text-[0.62rem] tracking-[0.16em] sm:text-[0.72rem]",
    arabic: "text-[0.62rem] sm:text-[0.7rem]",
    since: "text-[0.968rem]",
    sinceGap: "mt-0.5",
  },
  md: {
    name: "text-sm tracking-[0.2em]",
    arabic: "text-sm",
    since: "text-[1.21rem]",
    sinceGap: "mt-1",
  },
  lg: {
    name: "text-xl tracking-[0.24em] sm:text-2xl",
    arabic: "text-lg sm:text-xl",
    since: "text-[1.5125rem] sm:text-[1.815rem]",
    sinceGap: "mt-1.5",
  },
};

export default function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  const styles = sizeStyles[size];
  const color = "text-[#F25C23]";
  const latinNameRef = useRef<HTMLSpanElement>(null);
  const arabicNameRef = useRef<HTMLSpanElement>(null);
  const lineWidthsRef = useRef({ latin: 0, arabic: 0 });
  const [arabicFontSize, setArabicFontSize] = useState<number | null>(null);

  useEffect(() => {
    const latinName = latinNameRef.current;
    const arabicName = arabicNameRef.current;
    if (!latinName || !arabicName) return;
    lineWidthsRef.current = { latin: 0, arabic: 0 };

    const matchLineWidths = () => {
      const latinWidth = lineWidthsRef.current.latin || latinName.offsetWidth;
      const naturalArabicWidth = lineWidthsRef.current.arabic || arabicName.offsetWidth;
      const currentFontSize = Number.parseFloat(getComputedStyle(arabicName).fontSize);
      if (!latinWidth || !naturalArabicWidth || !currentFontSize) return;

      const nextFontSize = currentFontSize * (latinWidth / naturalArabicWidth);
      if (Number.isFinite(nextFontSize) && nextFontSize > 0) {
        setArabicFontSize((current) =>
          current === null || Math.abs(nextFontSize - current) > 0.05
            ? nextFontSize
            : current,
        );
      }
    };

    matchLineWidths();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((entries) => {
            for (const entry of entries) {
              if (entry.target === latinName) {
                lineWidthsRef.current.latin = entry.contentRect.width;
              } else if (entry.target === arabicName) {
                lineWidthsRef.current.arabic = entry.contentRect.width;
              }
            }
            matchLineWidths();
          });
    observer?.observe(latinName);
    observer?.observe(arabicName);
    void document.fonts?.ready.then(matchLineWidths);

    return () => observer?.disconnect();
  }, [size]);

  return (
    <span
      className={`inline-flex flex-col items-center justify-center text-center leading-none ${className}`}
      aria-label={`${siteConfig.name}, ${siteConfig.nameArabic}, Since ${siteConfig.founded}`}
    >
      <span className="flex flex-col items-center text-center leading-none">
        <span
          ref={latinNameRef}
          className={`font-cinzel font-bold uppercase ${styles.name} ${color}`}
        >
          {siteConfig.name}
        </span>
        <span
          ref={arabicNameRef}
          className={`inline-block text-center font-arabic font-normal ${styles.arabic} ${color}`}
          dir="rtl"
          aria-hidden="true"
          style={arabicFontSize ? { fontSize: `${arabicFontSize}px` } : undefined}
        >
          {arabicWordmark}
        </span>
      </span>
      <span className={`${styles.since} ${styles.sinceGap} font-caveat italic ${color}`}>
        Since {siteConfig.founded}
      </span>
    </span>
  );
}
