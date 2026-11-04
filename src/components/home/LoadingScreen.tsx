"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { siteConfig } from "@/data/siteConfig";
import BrandLogo from "@/components/common/BrandLogo";

const SESSION_KEY = "mtc-loading-shown";

export default function LoadingScreen() {
  const t = useTranslations("loading");
  const [show, setShow] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const liquidContainerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wipePathRef = useRef<SVGPathElement>(null);
  const wipeSvgRef = useRef<SVGSVGElement>(null);

  const revealHome = () => {
    document.getElementById("mtc-home-content")?.classList.remove("invisible");
  };

  useEffect(() => {
    setIsClient(true);
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) {
      revealHome();
      return;
    }

    setShow(true);
    sessionStorage.setItem(SESSION_KEY, "true");
  }, []);

  useEffect(() => {
    if (!show) return;

    // Curved wipe path parameters (0-1000 coordinate space)
    // Initially covers 100% of viewport with black: M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z
    const curveState = {
      y: 1000,
      controlY: 1000,
    };

    const updatePath = () => {
      if (wipePathRef.current) {
        wipePathRef.current.setAttribute(
          "d",
          `M 0 0 L 1000 0 L 1000 ${curveState.y} Q 500 ${curveState.controlY} 0 ${curveState.y} Z`
        );
      }
    };

    const progressObj = { value: 0 };

    // Master GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        revealHome();
        setShow(false);
      },
    });

    // Safari can pause or interrupt long animation timelines when the tab
    // changes visibility. Never leave the homepage behind a permanent loader.
    const failsafeTimer = window.setTimeout(() => {
      revealHome();
      setShow(false);
    }, 8000);

    // Reset initial states
    if (liquidContainerRef.current) {
      liquidContainerRef.current.style.height = "0%";
    }
    if (counterRef.current) {
      counterRef.current.textContent = "0%";
    }
    tl.set(logoWrapperRef.current, { scale: 1, opacity: 1, y: 0 });

    // Phase 1 & 2: Liquid Water Fill Rising over 5.0 seconds
    tl.to(progressObj, {
      value: 100,
      duration: 5.0,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = progressObj.value;
        if (liquidContainerRef.current) {
          // Rise from 0% to 106% so liquid completely covers the top of the logo
          liquidContainerRef.current.style.height = `${val * 1.06}%`;
        }
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(val)}%`;
        }
      },
    });

    // Phase 3: Scale-up filled logo with orange glow (~0.5s)
    tl.to(
      logoWrapperRef.current,
      {
        scale: 1.25,
        filter: "drop-shadow(0 0 35px rgba(239, 93, 54, 0.65))",
        duration: 0.5,
        ease: "power2.out",
      },
      "+=0.1"
    );

    // Phase 4: Curved Black Wipe Transition peeling away to reveal homepage (~1.0s)
    // Logo floats up and fades as the curved wave sweeps upward
    tl.to(
      logoWrapperRef.current,
      {
        y: -100,
        opacity: 0,
        scale: 1.35,
        duration: 0.6,
        ease: "power2.in",
      },
      "+=0.1"
    );

    // The curved wipe: controlY moves faster to create an upward curved arch
    tl.to(
      curveState,
      {
        y: 0,
        controlY: -160,
        duration: 0.95,
        ease: "power3.inOut",
        onUpdate: updatePath,
      },
      "-=0.45"
    );

    // Final flatten to 0
    tl.to(
      curveState,
      {
        controlY: 0,
        duration: 0.15,
        ease: "power1.out",
        onUpdate: updatePath,
      }
    );

    return () => {
      tl.kill();
      window.clearTimeout(failsafeTimer);
    };
  }, [show]);

  // Keep the black opening layer in the server-rendered HTML so the Hero
  // cannot flash before hydration starts the animation.
  if (isClient && !show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none bg-black"
      role="status"
      aria-live="polite"
      aria-label={t("text")}
    >
      {/* Hidden image to guarantee instant browser decode of the logo asset */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.assets.logo}
        alt=""
        className="hidden"
        aria-hidden="true"
      />

      {/* SVG Canvas for the curved black wipe overlay */}
      <svg
        ref={wipeSvgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full text-black pointer-events-auto"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
      >
        <path
          ref={wipePathRef}
          d="M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z"
          fill="#000000"
        />
      </svg>

      {/* Centered Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={logoWrapperRef}
          className="relative flex flex-col items-center justify-center transition-shadow duration-500"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* Logo Frame: 140px width x 215px height (286x439 aspect ratio) */}
          <div className="relative w-36 h-[221px] md:w-44 md:h-[270px]">
            {/* 1. Neutral Base Silhouette: visible against black background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.22)",
                WebkitMaskImage: `url(${siteConfig.assets.logo})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: `url(${siteConfig.assets.logo})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />

            {/* 2. Liquid Fill Layer: clipped by the exact same logo silhouette */}
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage: `url(${siteConfig.assets.logo})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: `url(${siteConfig.assets.logo})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            >
              {/* Rising Fluid Container from bottom (0% to 106% height) */}
              <div
                ref={liquidContainerRef}
                className="absolute inset-x-0 bottom-0 overflow-hidden"
                style={{
                  height: "0%",
                  willChange: "height",
                }}
              >
                {/* Full-width water body */}
                <div className="relative w-full h-full bg-[#ef5d36]">
                  {/* Wave 2: Back Wave (Translucent coral/amber highlight) */}
                  <div
                    className="absolute -top-3.5 left-0 w-[300%] h-6 flex animate-[mtc-wave-back_2.4s_linear_infinite] pointer-events-none"
                    style={{ opacity: 0.65 }}
                  >
                    <svg
                      viewBox="0 0 600 24"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ffa07a]"
                    >
                      <path d="M 0 12 Q 75 0 150 12 T 300 12 T 450 12 T 600 12 L 600 24 L 0 24 Z" />
                    </svg>
                    <svg
                      viewBox="0 0 600 24"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ffa07a]"
                    >
                      <path d="M 0 12 Q 75 0 150 12 T 300 12 T 450 12 T 600 12 L 600 24 L 0 24 Z" />
                    </svg>
                    <svg
                      viewBox="0 0 600 24"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ffa07a]"
                    >
                      <path d="M 0 12 Q 75 0 150 12 T 300 12 T 450 12 T 600 12 L 600 24 L 0 24 Z" />
                    </svg>
                  </div>

                  {/* Wave 1: Front Wave (Vibrant brand orange #ef5d36) */}
                  <div className="absolute -top-3 left-0 w-[300%] h-5 flex animate-[mtc-wave-front_1.7s_linear_infinite] pointer-events-none">
                    <svg
                      viewBox="0 0 600 20"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ef5d36]"
                    >
                      <path d="M 0 10 Q 75 0 150 10 T 300 10 T 450 10 T 600 10 L 600 20 L 0 20 Z" />
                    </svg>
                    <svg
                      viewBox="0 0 600 20"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ef5d36]"
                    >
                      <path d="M 0 10 Q 75 0 150 10 T 300 10 T 450 10 T 600 10 L 600 20 L 0 20 Z" />
                    </svg>
                    <svg
                      viewBox="0 0 600 20"
                      preserveAspectRatio="none"
                      className="w-1/3 h-full fill-[#ef5d36]"
                    >
                      <path d="M 0 10 Q 75 0 150 10 T 300 10 T 450 10 T 600 10 L 600 20 L 0 20 Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Percentage Counter */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <span
              ref={counterRef}
              className="text-[1.35rem] font-light tracking-[0.2em] text-white/80 font-mono"
            >
              0%
            </span>
            <BrandLogo size="sm" className="scale-[1.2] opacity-60" />
          </div>
        </div>
      </div>

      {/* Seamless looping wave keyframe animations */}
      <style jsx global>{`
        @keyframes mtc-wave-front {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes mtc-wave-back {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
