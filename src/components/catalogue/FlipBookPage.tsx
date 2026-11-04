"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PAGE_RATIO } from "./constants";

type FlipBookPageProps = {
  pageNumber: number;
  pdfDocument: PDFDocumentProxy | null;
  totalCount: number;
  width: number;
  height?: number;
  isCover?: boolean;
  isBackCover?: boolean;
  isEven?: boolean;
  onPageSize?: (size: { width: number; height: number }) => void;
  onRendered?: () => void;
};

export const FlipBookPage = forwardRef<HTMLDivElement, FlipBookPageProps>(
  (
    {
      pageNumber,
      pdfDocument,
      totalCount,
      width,
      height,
      isCover = false,
      isBackCover = false,
      isEven = false,
      onPageSize,
      onRendered,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRendered, setIsRendered] = useState<boolean>(false);
    const [renderError, setRenderError] = useState<string | null>(null);

    useEffect(() => {
      if (!pdfDocument || !canvasRef.current || width <= 0) return;

      let isCancelled = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let renderTask: any = null;

      const renderPage = async () => {
        try {
          setIsRendered(false);
          setRenderError(null);

          const page = await pdfDocument.getPage(pageNumber);
          if (isCancelled || !canvasRef.current) return;

          const canvas = canvasRef.current;
          const unscaledViewport = page.getViewport({ scale: 1 });
          onPageSize?.({ width: unscaledViewport.width, height: unscaledViewport.height });
          const frameHeight = height ?? width / PAGE_RATIO;
          const scale = Math.min(
            width / unscaledViewport.width,
            frameHeight / unscaledViewport.height,
          );
          const viewport = page.getViewport({ scale });

          // iPhones have a high device-pixel ratio. Rendering all 50 catalogue
          // pages at 2x/3x simultaneously can exhaust Safari's canvas memory
          // budget and leave the FlipBook blank. A 1x mobile canvas remains
          // sharp enough at the displayed page size and keeps the reader stable.
          const pixelRatio =
            typeof window !== "undefined"
              ? window.innerWidth < 768
                ? 1
                : Math.min(window.devicePixelRatio || 1, 2)
              : 1;

          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.height = Math.floor(viewport.height * pixelRatio);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Reset any previous transforms and scale for HiDPI
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

          renderTask = page.render({
            canvasContext: ctx,
            viewport,
          });

          await renderTask.promise;

          if (!isCancelled) {
            setIsRendered(true);
            onRendered?.();
          }
        } catch (err: unknown) {
          // Ignore cancellation errors during fast page flips
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((err as any)?.name !== "RenderingCancelledException" && !isCancelled) {
            console.error(`Error rendering page ${pageNumber}:`, err);
            setRenderError("Page render failed");
          }
        }
      };

      renderPage();

      return () => {
        isCancelled = true;
        if (renderTask) {
          try {
            renderTask.cancel();
          } catch {
            // ignore cancel error
          }
        }
      };
    }, [pdfDocument, pageNumber, width, height, onPageSize, onRendered]);

    return (
      <div
        ref={ref}
        className={`relative select-none overflow-hidden ${
          isEven ? "border-r border-black/[0.12]" : "border-l border-black/[0.12]"
        }`}
        style={{
          width: `${width}px`,
          height: height ? `${height}px` : "auto",
          backgroundColor: "#f4f5f6",
          backgroundImage:
            isEven
              ? "linear-gradient(270deg, rgba(255,255,255,0.42), transparent 34%, rgba(40,45,50,0.035))"
              : "linear-gradient(90deg, rgba(255,255,255,0.42), transparent 34%, rgba(40,45,50,0.035))",
        }}
        data-density={isCover || isBackCover ? "hard" : "soft"}
      >
        {/* PDF Canvas Container */}
        <div className="relative flex h-full w-full items-center justify-center bg-[#f7f4ee]">
          <canvas
            ref={canvasRef}
            className={`transition-opacity duration-300 pointer-events-none block max-w-full max-h-full ${
              isRendered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Skeleton loading placeholder until canvas render finishes */}
          {!isRendered && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100/80 animate-pulse z-0"
              style={{ width: `${width}px`, height: height ? `${height}px` : "100%" }}
            >
              <div className="w-7 h-7 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mb-2" />
              <span className="text-xs text-neutral-400 font-sans tracking-wide">
                {pageNumber} / {totalCount}
              </span>
            </div>
          )}

          {renderError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-xs p-4 text-center">
              {renderError}
            </div>
          )}
        </div>

        {/* Realistic spine gradient overlay for book depth */}
        {!isCover && !isBackCover && (
          <div
            className={`pointer-events-none absolute inset-y-0 w-8 z-10 ${
              isEven
                ? "right-0 bg-gradient-to-l from-black/[0.12] via-black/[0.03] to-transparent"
                : "left-0 bg-gradient-to-r from-black/[0.12] via-black/[0.03] to-transparent"
            }`}
            aria-hidden="true"
          />
        )}

        {/* Subtle page fold highlight edge */}
        <div
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.05]"
          aria-hidden="true"
        />

        {/* Bottom subtle page number pill */}
        <div
          className={`pointer-events-none absolute bottom-3 z-20 ${
            isCover || isBackCover ? "hidden" : isEven ? "left-4" : "right-4"
          }`}
        >
          <span className="text-[11px] font-mono font-medium text-neutral-400/90 bg-white/80 px-2 py-0.5 rounded shadow-sm backdrop-blur-[2px]">
            {pageNumber}
          </span>
        </div>
      </div>
    );
  }
);

FlipBookPage.displayName = "FlipBookPage";

export default FlipBookPage;
