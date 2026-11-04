"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import GhostButton from "@/components/common/GhostButton";
import UsineCataloguePopup from "./UsineCataloguePopup";

gsap.registerPlugin(ScrollTrigger, SplitText);

const USINE_SLIDES = ["/0.jpg", "/00.jpg", "/1.jpg", "/2.jpg"] as const;
const SLIDE_INTERVAL = 5000;

interface UsineShowcaseProps {
  isActive?: boolean;
}

export default function UsineShowcase({ isActive }: UsineShowcaseProps) {
  const t = useTranslations("usine");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  useEffect(() => {
    if (isActive === false) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % USINE_SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    // If isActive is explicitly controlled (panel mode)
    if (typeof isActive === "boolean") {
      if (!isActive) return;

      let split: SplitText | null = null;
      const ctx = gsap.context(() => {
        split = SplitText.create(".usine-heading", {
          type: "words,lines",
          mask: "words",
        });

        gsap.from(split.words, {
          y: "100%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
        });

        gsap.from(".usine-animate", {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });
      }, sectionRef);

      return () => {
        split?.revert();
        ctx.revert();
      };
    }

    // Fallback if standalone mode without panel controller
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(".usine-heading", {
        type: "words,lines",
        mask: "words",
      });

      gsap.from(split.words, {
        y: "100%",
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".usine-animate", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [isActive]);

  return (
    <>
      <div
        ref={sectionRef}
        className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="usine-animate relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
              {USINE_SLIDES.map((src, index) => (
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
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="usine-animate flex flex-col justify-center">
              <h2 className="usine-heading font-display text-2xl sm:text-3xl font-bold text-brand-dark md:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-text-muted md:mt-5">
                {t("description")}
              </p>
              <div className="mt-6 sm:mt-8">
                <GhostButton
                  variant="black"
                  size="lg"
                  onClick={() => setCatalogueOpen(true)}
                >
                  {t("cta")}
                </GhostButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UsineCataloguePopup open={catalogueOpen} onClose={() => setCatalogueOpen(false)} />
    </>
  );
}
