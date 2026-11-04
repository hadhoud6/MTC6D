"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import HTMLFlipBook from "react-pageflip";
import FlipBookPage from "./FlipBookPage";
import FlipBookControls from "./FlipBookControls";
import { useTranslations } from "next-intl";
import { BookOpen, Sparkles } from "lucide-react";
import { PAGE_RATIO, SPREAD_RATIO } from "./constants";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

type FlipBookProps = {
  pdfUrl?: string;
};

type BookDimensions = { width: number; height: number; isMobile: boolean };

function getFallbackDimensions(): BookDimensions {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const frameWidth =
    typeof window !== "undefined"
      ? Math.floor(window.innerWidth * 0.95)
      : 400;
  const width = Math.max(180, isMobile ? frameWidth : Math.floor(frameWidth / 2));

  return {
    width,
    height: Math.max(220, Math.round(width / PAGE_RATIO)),
    isMobile,
  };
}

export default function FlipBook({ pdfUrl = "/catalogue.pdf" }: FlipBookProps) {
  const t = useTranslations("catalogue");

  // Document state
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfPageSize, setPdfPageSize] = useState<{ width: number; height: number } | null>(null);

  // UI state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [bookDimensions, setBookDimensions] = useState<BookDimensions>(getFallbackDimensions);
  const [hasRenderedMobilePage, setHasRenderedMobilePage] = useState<boolean>(false);
  const [showMobileWarning, setShowMobileWarning] = useState<boolean>(false);

  // Refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bookFrameRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef<boolean>(false);

  const handleMobilePageRendered = useCallback(() => {
    setHasRenderedMobilePage(true);
    setShowMobileWarning(false);
  }, []);

  // Load PDF Document manually via pdfjs
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setLoadError(null);

    if (typeof window !== "undefined") {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }

    const loadingTask = pdfjs.getDocument(pdfUrl);

    loadingTask.promise
      .then((doc) => {
        if (!isCancelled) {
          setPdfDocument(doc);
          setNumPages(doc.numPages);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("PDF load error:", err);
          setLoadError(err?.message || "Failed to load catalogue PDF");
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      try {
        loadingTask.destroy();
      } catch {
        // ignore destroy error
      }
    };
  }, [pdfUrl]);

  // Initialize Sound Effect
  useEffect(() => {
    try {
      const audio = new Audio("/sounds/book-opening.mp3");
      audio.volume = 0.55;
      audio.preload = "auto";
      audio.load();
      audioRef.current = audio;
    } catch {
      // Audio initialization fallback
    }

    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const frame = bookFrameRef.current;
    if (!frame) return;

    const updateDimensions = () => {
      const rect = frame.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const pageWidth = Math.max(180, Math.floor(isMobile ? rect.width : rect.width / 2));
      const pageHeight = Math.max(220, Math.round(pageWidth / PAGE_RATIO));
      setBookDimensions({ width: pageWidth, height: pageHeight, isMobile });
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(frame);
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [isLoading, isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // react-pageflip can ignore startPage when it is mounted while the
  // responsive layout is settling. Explicitly move past the almost-white
  // cover once the mobile instance has a stable size.
  useEffect(() => {
    if (isLoading || !bookDimensions.isMobile || !flipBookRef.current) return;

    const timer = window.setTimeout(() => {
      try {
        flipBookRef.current?.pageFlip().turnToPage(1);
        setCurrentPage(1);
      } catch {
        // The page-flip instance may still be mounting; the next resize or
        // user interaction will initialize it normally.
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [isLoading, bookDimensions.isMobile, bookDimensions.width, bookDimensions.height]);

  // Show a useful recovery path instead of leaving an iPhone user with a
  // blank book if Safari/Chrome cannot allocate enough canvas memory.
  useEffect(() => {
    setHasRenderedMobilePage(false);
    setShowMobileWarning(false);
  }, [pdfUrl]);

  useEffect(() => {
    if (isLoading || !pdfDocument || !bookDimensions.isMobile || hasRenderedMobilePage) return;

    const timer = window.setTimeout(() => {
      if (!hasRenderedMobilePage) setShowMobileWarning(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [isLoading, pdfDocument, bookDimensions.isMobile, hasRenderedMobilePage]);

  // Play Page Turn Sound Effect
  const playFlipSound = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser audio policy prevented auto play
        });
      }
    } catch {
      // Ignore audio playback issues
    }
  }, [soundEnabled]);

  // Keep the page index in sync after the animation; sound plays as a flip starts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFlip = useCallback((e: any) => {
    if (e && typeof e.data === "number") {
      setCurrentPage(e.data);
    }
  }, []);

  const handleFlipState = useCallback((e: { data?: string }) => {
    if (e?.data === "flipping") playFlipSound();
  }, [playFlipSound]);

  // Navigation handlers
  const handlePrevPage = () => {
    if (flipBookRef.current) {
      try {
        flipBookRef.current.pageFlip().flipPrev();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNextPage = () => {
    if (flipBookRef.current) {
      try {
        flipBookRef.current.pageFlip().flipNext();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePageJump = (pageIdx: number) => {
    if (flipBookRef.current && pageIdx >= 0 && pageIdx < numPages) {
      try {
        flipBookRef.current.pageFlip().turnToPage(pageIdx);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  const handleZoomIn = () => setZoomScale((s) => Math.min(s + 0.15, 1.5));
  const handleZoomOut = () => setZoomScale((s) => Math.max(s - 0.15, 0.8));
  const handleResetZoom = () => setZoomScale(1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "m" || e.key === "M") {
        handleToggleSound();
      } else if (e.key === "f" || e.key === "F") {
        handleToggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-center justify-center transition-colors duration-300 ${isFullscreen
          ? "fixed inset-0 z-50 overflow-y-auto bg-white/95 p-4 backdrop-blur-xl sm:p-8"
      : "relative my-2"
        }`}
    >
      {/* Main Flipbook Showcase */}
      {isLoading ? (
        <div className="w-full max-w-3xl min-h-[460px] sm:min-h-[580px] rounded-2xl bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-xl flex flex-col items-center justify-center p-8 text-center animate-pulse">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <BookOpen className="w-8 h-8 animate-bounce" />
            </div>
            <Sparkles className="w-5 h-5 text-brand-orange absolute -top-1 -right-1 animate-spin" />
          </div>
          <h3 className="font-serif text-2xl text-brand-dark font-normal mb-2">
            {t("loading")}
          </h3>
          <p className="text-neutral-500 text-sm max-w-md font-sans">
            {t("loadingProgress")}
          </p>
          {/* Animated loading bar */}
          <div className="w-48 h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-6">
            <div className="w-full h-full bg-brand-orange origin-left animate-[loading-bar_1.5s_infinite_ease-in-out]" />
          </div>
        </div>
      ) : loadError ? (
        <div className="w-full max-w-xl p-8 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700">
          <p className="font-serif text-xl mb-3">Erreur de chargement du catalogue</p>
          <p className="text-sm text-red-600 mb-6">{loadError}</p>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            Télécharger le PDF directement
          </a>
        </div>
      ) : numPages > 0 && pdfDocument ? (
        <div className="relative flex w-full flex-col items-center justify-center">
          {/* Wide saddle-stitched notebook frame */}
          <div
            ref={bookFrameRef}
            className="relative w-[min(95vw,205dvh)] shrink-0 rounded-[28px] bg-[#f4f5f6] shadow-[0_0_24px_rgba(242,92,35,0.2),0_0_70px_rgba(242,92,35,0.14),0_28px_70px_rgba(0,0,0,0.28)]"
            style={{ aspectRatio: bookDimensions.isMobile ? `${PAGE_RATIO} / 1` : `${SPREAD_RATIO} / 1` }}
          >
            <div className="absolute inset-0 isolate overflow-hidden rounded-[28px] bg-[#f4f5f6]">
              <div
                className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                {/* StPageFlip HTMLFlipBook Component */}
                <HTMLFlipBook
                  key={`flipbook-${bookDimensions.isMobile ? "mobile" : "desktop"}-${bookDimensions.width}x${bookDimensions.height}`}
                  ref={flipBookRef}
                  width={bookDimensions.width}
                  height={bookDimensions.height}
                  size="fixed"
                  minWidth={180}
                  maxWidth={1200}
                  minHeight={220}
                  maxHeight={1200}
                  maxShadowOpacity={0.35}
                  showCover={false}
                  mobileScrollSupport={true}
                  onFlip={handleFlip}
                  onChangeState={handleFlipState}
                  className="relative z-10 select-none cursor-grab active:cursor-grabbing"
                  style={{ margin: "0 auto" }}
                  usePortrait={bookDimensions.isMobile}
                  startPage={bookDimensions.isMobile ? 1 : 0}
                  drawShadow={true}
                  flippingTime={700}
                  startZIndex={0}
                  autoSize={false}
                  clickEventForward={true}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={!bookDimensions.isMobile}
                  disableFlipByClick={false}
                >
                  {Array.from({ length: numPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isEven = pageNum % 2 === 0;

                    return (
                      <FlipBookPage
                        key={`page-${pageNum}`}
                        pageNumber={pageNum}
                        pdfDocument={pdfDocument}
                        totalCount={numPages}
                        width={bookDimensions.width}
                        height={bookDimensions.height}
                        isEven={isEven}
                        onPageSize={index === 0 ? setPdfPageSize : undefined}
                        onRendered={pageNum === 2 ? handleMobilePageRendered : undefined}
                      />
                    );
                  })}
                </HTMLFlipBook>
              </div>

              {/* Soft crease toward the spine */}
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(50,55,60,0.035)_35%,rgba(35,40,45,0.14)_50%,rgba(50,55,60,0.035)_65%,transparent)]"
                aria-hidden="true"
              />

              {/* Two small metal staples, hidden on portrait/mobile */}
              {!bookDimensions.isMobile && (
                <>
                  <span className="pointer-events-none absolute left-1/2 top-[27%] z-30 h-8 w-1 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#8c9399,#f7f8f8_45%,#737b82)] shadow-[0_1px_2px_rgba(0,0,0,0.35)]" aria-hidden="true" />
                  <span className="pointer-events-none absolute left-1/2 top-[73%] z-30 h-8 w-1 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#8c9399,#f7f8f8_45%,#737b82)] shadow-[0_1px_2px_rgba(0,0,0,0.35)]" aria-hidden="true" />
                </>
              )}
            </div>
          </div>

          {showMobileWarning && (
            <div
              className="mx-4 mt-4 w-full max-w-xl rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-4 text-center text-brand-dark shadow-sm"
              role="alert"
            >
              <p className="font-display text-lg font-bold">{t("mobileFallbackTitle")}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{t("mobileFallbackMessage")}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                {t("mobileFallbackRetry")}
              </button>
            </div>
          )}

          {/* Actual PDF page dimensions, useful when preparing a landscape re-export */}
          {pdfPageSize && (
            <p className="mt-3 text-center text-[11px] text-white/55">
              PDF : {Math.round(pdfPageSize.width)} × {Math.round(pdfPageSize.height)} pt — {pdfPageSize.width >= pdfPageSize.height ? "paysage" : "portrait"}
            </p>
          )}

          {/* Luxury Controls Toolbar */}
          <FlipBookControls
            currentPage={currentPage}
            totalPages={numPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageJump={handlePageJump}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            zoomScale={zoomScale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
          />
        </div>
      ) : null}
    </div>
  );
}
