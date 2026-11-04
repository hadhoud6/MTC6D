"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export interface PanelInfo {
  id: string;
  nameKey: string;
  defaultLabel: string;
  isLight?: boolean;
}

interface PanelIndicatorProps {
  panels: PanelInfo[];
  activeIndex: number;
  onSelect: (index: number) => void;
  isLightActive?: boolean;
}

export default function PanelIndicator({
  panels,
  activeIndex,
  onSelect,
  isLightActive = false,
}: PanelIndicatorProps) {
  const t = useTranslations("nav");

  return (
    <aside
      aria-label="Navigation des sections"
      className="fixed right-3 md:right-6 top-1/2 z-40 -translate-y-1/2 flex flex-col items-center gap-3 select-none pointer-events-auto"
    >
      <div
        className={`flex flex-col items-center gap-3 rounded-full px-2 py-3.5 backdrop-blur-md transition-colors duration-500 shadow-xl border ${
          isLightActive
            ? "bg-brand-dark/10 border-brand-dark/20 text-brand-dark"
            : "bg-black/30 border-white/15 text-white"
        }`}
      >
        {panels.map((panel, index) => {
          const isActive = activeIndex === index;
          const label = t.has(panel.nameKey) ? t(panel.nameKey) : panel.defaultLabel;

          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Aller à la section ${label}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center justify-center p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-full cursor-pointer"
            >
              {/* Tooltip on hover (desktop) */}
              <div
                className={`pointer-events-none absolute right-full mr-3 hidden rounded-lg px-2.5 py-1 text-xs font-medium tracking-wide whitespace-nowrap shadow-md transition-all duration-200 lg:block ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                } ${
                  isLightActive
                    ? "bg-brand-dark text-white"
                    : "bg-white text-brand-dark"
                }`}
              >
                {label}
              </div>

              {/* Dot element */}
              <div className="relative flex h-3 w-3 items-center justify-center">
                {isActive && (
                  <motion.span
                    layoutId="active-dot-ring"
                    className="absolute -inset-1 rounded-full border-2 border-brand-orange"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-1.5 w-1.5 bg-brand-orange scale-110"
                      : isLightActive
                      ? "h-1.5 w-1.5 bg-brand-dark/40 group-hover:scale-125 group-hover:bg-brand-dark"
                      : "h-1.5 w-1.5 bg-white/50 group-hover:scale-125 group-hover:bg-white"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
