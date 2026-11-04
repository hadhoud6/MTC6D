"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HERO_SLIDES = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"] as const;
const SLIDE_INTERVAL = 5000;

interface HeroProps {
  isActive?: boolean;
  onNext?: () => void;
}

export default function Hero({ isActive = true, onNext }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isActive]);

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleScrollClick = () => {
    if (onNext) {
      onNext();
    } else {
      window.dispatchEvent(new CustomEvent("mtc-goto-panel", { detail: { index: 1 } }));
    }
  };

  return (
    <div
      className="relative flex h-full min-h-[100dvh] w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {HERO_SLIDES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <button
        type="button"
        onClick={goToPreviousSlide}
        aria-label="Image précédente"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-2xl text-white/90 backdrop-blur-sm transition-colors hover:border-brand-orange hover:bg-black/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange md:left-8"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Image suivante"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-2xl text-white/90 backdrop-blur-sm transition-colors hover:border-brand-orange hover:bg-black/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange md:right-8"
      >
        <span aria-hidden="true">›</span>
      </button>

      <div className="absolute bottom-8 left-6 z-10 flex gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm md:left-8">
        {HERO_SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Afficher l’image ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 ${
              index === currentSlide ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleScrollClick}
        aria-label="Faire défiler vers la section suivante"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-full"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1 hover:border-brand-orange transition-colors">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/80" />
        </div>
      </button>
    </div>
  );
}
