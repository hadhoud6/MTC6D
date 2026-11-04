"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Download,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import GhostButton from "@/components/common/GhostButton";

type FlipBookControlsProps = {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageJump: (page: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
};

export default function FlipBookControls({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageJump,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  zoomScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: FlipBookControlsProps) {
  const t = useTranslations("catalogue");

  const [inputVal, setInputVal] = React.useState<string>(String(currentPage + 1));

  React.useEffect(() => {
    setInputVal(String(currentPage + 1));
  }, [currentPage]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputVal, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageJump(val - 1);
    } else {
      setInputVal(String(currentPage + 1));
    }
  };

  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        {/* Left: Navigation Buttons & Page Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Page */}
          <button
            type="button"
            onClick={onPrevPage}
            disabled={isFirstPage}
            title={t("prevPage")}
            aria-label={t("prevPage")}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 hover:bg-brand-orange hover:text-white text-neutral-700 disabled:opacity-35 disabled:hover:bg-neutral-100 disabled:hover:text-neutral-700 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Indicator / Quick Jump */}
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-xl border border-black/[0.06] text-xs sm:text-sm font-sans"
          >
            <span className="text-neutral-400 font-medium hidden xs:inline">Page</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={handleInputSubmit}
              className="w-8 sm:w-10 text-center font-semibold text-brand-dark bg-white border border-neutral-200 rounded-lg py-0.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-xs sm:text-sm transition-colors"
              aria-label="Numéro de page"
            />
            <span className="text-neutral-400">/</span>
            <span className="font-semibold text-neutral-600 min-w-5 text-center">
              {totalPages || "—"}
            </span>
          </form>

          {/* Next Page */}
          <button
            type="button"
            onClick={onNextPage}
            disabled={isLastPage}
            title={t("nextPage")}
            aria-label={t("nextPage")}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 hover:bg-brand-orange hover:text-white text-neutral-700 disabled:opacity-35 disabled:hover:bg-neutral-100 disabled:hover:text-neutral-700 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-50 p-1 rounded-xl border border-black/[0.06]">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={zoomScale <= 0.8}
            title={t("zoomOut")}
            aria-label={t("zoomOut")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white hover:text-brand-orange hover:shadow-xs transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-medium text-neutral-500 px-1.5 select-none">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={zoomScale >= 1.5}
            title={t("zoomIn")}
            aria-label={t("zoomIn")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white hover:text-brand-orange hover:shadow-xs transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomScale !== 1 && (
            <button
              type="button"
              onClick={onResetZoom}
              title={t("fitWidth")}
              aria-label={t("fitWidth")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-brand-orange hover:bg-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Sound, Fullscreen, Download actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? t("soundOff") : t("soundOn")}
            aria-label={soundEnabled ? t("soundOff") : t("soundOn")}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
              soundEnabled
                ? "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white"
                : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
            aria-label={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-brand-dark transition-all duration-200 cursor-pointer active:scale-95"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Direct Download Button */}
          <GhostButton
            href="/catalogue.pdf"
            download="Catalogue-Marbrerie-Tunis-Carthage.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title={t("downloadPdf")}
            aria-label={t("downloadPdf")}
            variant="black"
            size="sm"
            rounded="xl"
            className="px-3 py-2 sm:px-3.5 sm:py-2.5"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("downloadPdf")}</span>
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
