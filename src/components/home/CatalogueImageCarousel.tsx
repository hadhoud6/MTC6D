"use client";

import { memo, useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { motion } from "framer-motion";
import { CATALOGUE_CAROUSEL_TRANSITION } from "@/lib/motion";

function ChevronLeftIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="15 18 9 12 15 6" /></svg>;
}

function ChevronRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>;
}

export type CatalogueImageCarouselProps = {
  images: string[];
  alt: string;
  expanded: boolean;
  onToggle: () => void;
};

const CatalogueImageCarousel = memo(function CatalogueImageCarousel({
  images,
  alt,
  expanded,
  onToggle,
}: CatalogueImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!expanded) setIndex(0);
  }, [expanded]);

  const prev = useCallback(() => {
    setIndex((value) => (value - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((value) => (value + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!hasMultiple || typeof window === "undefined") return;
    const previous = images[(index - 1 + images.length) % images.length];
    const following = images[(index + 1) % images.length];
    [previous, following].forEach((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
    });
  }, [hasMultiple, images, index]);

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const delta = event.changedTouches[0]?.clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  }, [hasMultiple, next, prev]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }, [onToggle]);

  const visibleIndexes = Array.from(new Set([
    (index - 1 + images.length) % images.length,
    index,
    (index + 1) % images.length,
  ]));

  return (
    <div
      className={`relative cursor-pointer overflow-hidden bg-brand-dark/5 ${
        expanded ? "aspect-[16/9]" : "aspect-[4/3]"
      }`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={expanded ? `Collapse ${alt}` : `Expand ${alt}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {visibleIndexes.map((imageIndex) => (
        <motion.img
          key={`${alt}-${imageIndex}`}
          src={images[imageIndex]}
          alt={imageIndex === index ? alt : ""}
          aria-hidden={imageIndex === index ? undefined : true}
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: imageIndex === index ? 1 : 0 }}
          animate={{ opacity: imageIndex === index ? 1 : 0 }}
          transition={CATALOGUE_CAROUSEL_TRANSITION}
        />
      ))}

      {hasMultiple && expanded ? (
        <>
          <button type="button" onClick={(event) => { event.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/60" aria-label="Previous image"><ChevronLeftIcon /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); next(); }} className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/60" aria-label="Next image"><ChevronRightIcon /></button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, imageIndex) => <span key={imageIndex} className={`h-1.5 rounded-full ${imageIndex === index ? "w-4 bg-brand-orange" : "w-1.5 bg-white/70"}`} />)}
          </div>
        </>
      ) : null}
    </div>
  );
});

export default CatalogueImageCarousel;
