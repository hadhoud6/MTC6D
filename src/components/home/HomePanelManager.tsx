"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "./Hero";
import VideoShowcase from "./VideoShowcase";
import UsineShowcase from "./UsineShowcase";
import ProductsPreview from "./ProductsPreview";
import ConfiguratorTeaser from "./ConfiguratorTeaser";
import ProjetsShowcase from "./ProjetsShowcase";
import Footer from "@/components/layout/Footer";
import PanelIndicator, { PanelInfo } from "./PanelIndicator";

export const HOME_PANELS: PanelInfo[] = [
  { id: "accueil", nameKey: "accueil", defaultLabel: "Accueil", isLight: false },
  { id: "video", nameKey: "video", defaultLabel: "Vidéo", isLight: true },
  { id: "usine", nameKey: "usine", defaultLabel: "L'usine", isLight: true },
  { id: "produits", nameKey: "produits", defaultLabel: "Nos Produits", isLight: false },
  { id: "configurateur", nameKey: "configurateur", defaultLabel: "Configurateur 3D", isLight: false },
  { id: "projets", nameKey: "projets", defaultLabel: "Nos Projets", isLight: false },
  { id: "footer", nameKey: "footer", defaultLabel: "Contact & Liens", isLight: true },
];

const TOTAL_PANELS = HOME_PANELS.length;
const TRANSITION_DURATION = 0.85; // seconds
const LOCK_TIME_MS = 850; // ms fallback unlock timeout

export default function HomePanelManager() {
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const activePanelIndexRef = useRef(0);
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerPanelRef = useRef<HTMLDivElement>(null);

  // Keep activePanelIndexRef in sync with state
  useEffect(() => {
    activePanelIndexRef.current = activePanelIndex;
  }, [activePanelIndex]);

  // Clean up lock timer on unmount
  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  const isModalOpen = useCallback(() => {
    if (typeof document === "undefined") return false;
    return (
      document.querySelector('[role="dialog"]') !== null ||
      document.querySelector('[aria-modal="true"]') !== null ||
      document.querySelector('nav[aria-label="Mobile"]') !== null ||
      document.querySelector('[data-modal="true"]') !== null
    );
  }, []);

  const unlockScroll = useCallback(() => {
    isLockedRef.current = false;
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, []);

  const goToPanel = useCallback((targetIndex: number) => {
    const nextIndex = ((targetIndex % TOTAL_PANELS) + TOTAL_PANELS) % TOTAL_PANELS;

    if (activePanelIndexRef.current === nextIndex) return;

    // Lock transitions to prevent event flooding / skipping
    isLockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
      lockTimerRef.current = null;
    }, LOCK_TIME_MS);

    // Reset footer scroll position when moving to footer panel
    if (nextIndex === TOTAL_PANELS - 1 && footerPanelRef.current) {
      footerPanelRef.current.scrollTop = 0;
    }

    activePanelIndexRef.current = nextIndex;
    setActivePanelIndex(nextIndex);

    const panel = HOME_PANELS[nextIndex];
    if (panel && typeof window !== "undefined") {
      if (window.location.hash !== `#${panel.id}`) {
        window.history.replaceState(null, "", `#${panel.id}`);
      }
      window.dispatchEvent(
        new CustomEvent("mtc-panel-change", {
          detail: {
            index: nextIndex,
            id: panel.id,
            isLight: panel.isLight,
          },
        }),
      );
    }
  }, []);

  const goToNext = useCallback(() => {
    if (isLockedRef.current || isModalOpen()) return;
    goToPanel(activePanelIndexRef.current + 1);
  }, [goToPanel, isModalOpen]);

  const goToPrev = useCallback(() => {
    if (isLockedRef.current || isModalOpen()) return;
    goToPanel(activePanelIndexRef.current - 1);
  }, [goToPanel, isModalOpen]);

  // Initial hash check on mount & custom navigation event listener
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const index = HOME_PANELS.findIndex((p) => p.id === hash);
      if (index !== -1) {
        goToPanel(index);
      }
    };

    handleInitialHash();

    const onCustomGoto = (e: Event) => {
      const customEvent = e as CustomEvent<{ id?: string; index?: number }>;
      if (typeof customEvent.detail?.index === "number") {
        goToPanel(customEvent.detail.index);
      } else if (customEvent.detail?.id) {
        const idx = HOME_PANELS.findIndex((p) => p.id === customEvent.detail.id);
        if (idx !== -1) {
          goToPanel(idx);
        }
      }
    };

    window.addEventListener("mtc-goto-panel", onCustomGoto);
    window.addEventListener("hashchange", handleInitialHash);

    // Initial broadcast of active panel for Navbar / UI
    window.dispatchEvent(
      new CustomEvent("mtc-panel-change", {
        detail: {
          index: 0,
          id: HOME_PANELS[0].id,
          isLight: HOME_PANELS[0].isLight,
        },
      }),
    );

    return () => {
      window.removeEventListener("mtc-goto-panel", onCustomGoto);
      window.removeEventListener("hashchange", handleInitialHash);
    };
  }, [goToPanel]);

  // Mouse wheel listener
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer: NodeJS.Timeout | null = null;

    const onWheel = (e: WheelEvent) => {
      if (isModalOpen()) return;

      if (isLockedRef.current) {
        e.preventDefault();
        return;
      }

      // Check if active panel is Footer and has internal scrollable content
      const isFooterPanel = activePanelIndexRef.current === TOTAL_PANELS - 1;
      const footerEl = footerPanelRef.current;

      if (isFooterPanel && footerEl && footerEl.scrollHeight > footerEl.clientHeight + 4) {
        if (e.deltaY > 0) {
          // Scrolling down
          const atBottom = footerEl.scrollTop + footerEl.clientHeight >= footerEl.scrollHeight - 6;
          if (!atBottom) {
            // Allow native internal scroll inside footer
            return;
          }
        } else if (e.deltaY < 0) {
          // Scrolling up
          const atTop = footerEl.scrollTop <= 6;
          if (!atTop) {
            // Allow native internal scroll inside footer
            return;
          }
        }
      }

      // Prevent default document vertical scroll
      e.preventDefault();

      accumulatedDelta += e.deltaY;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 200);

      const threshold = 25;
      if (accumulatedDelta >= threshold) {
        accumulatedDelta = 0;
        goToNext();
      } else if (accumulatedDelta <= -threshold) {
        accumulatedDelta = 0;
        goToPrev();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [goToNext, goToPrev, isModalOpen]);

  // Touch swipe listener (Mobile & Tablet)
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (isModalOpen() || !e.touches[0]) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isModalOpen() || touchStartY.current === null || touchStartX.current === null || !e.touches[0]) {
        return;
      }
      const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
      const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);

      const isFooterPanel = activePanelIndexRef.current === TOTAL_PANELS - 1;
      const footerEl = footerPanelRef.current;

      if (isFooterPanel && footerEl && footerEl.scrollHeight > footerEl.clientHeight + 4) {
        const swipingUp = e.touches[0].clientY < touchStartY.current; // scrolling downwards
        const atBottom = footerEl.scrollTop + footerEl.clientHeight >= footerEl.scrollHeight - 6;
        const atTop = footerEl.scrollTop <= 6;

        if ((swipingUp && !atBottom) || (!swipingUp && !atTop)) {
          // Allow internal scrolling in footer
          return;
        }
      }

      if (diffY > diffX && diffY > 10) {
        // Vertical swipe, prevent native overscroll
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (
        isModalOpen() ||
        touchStartY.current === null ||
        !e.changedTouches[0] ||
        isLockedRef.current
      ) {
        touchStartY.current = null;
        touchStartX.current = null;
        return;
      }

      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;

      touchStartY.current = null;
      touchStartX.current = null;

      const isFooterPanel = activePanelIndexRef.current === TOTAL_PANELS - 1;
      const footerEl = footerPanelRef.current;

      if (isFooterPanel && footerEl && footerEl.scrollHeight > footerEl.clientHeight + 4) {
        if (deltaY < 0) {
          // Swiping up (trying to advance to next panel)
          const atBottom = footerEl.scrollTop + footerEl.clientHeight >= footerEl.scrollHeight - 10;
          if (!atBottom) return;
        } else {
          // Swiping down (trying to go to previous panel)
          const atTop = footerEl.scrollTop <= 10;
          if (!atTop) return;
        }
      }

      // Minimum swipe distance of 40px and within 650ms
      if (Math.abs(deltaY) > 40 && deltaTime < 650) {
        if (deltaY < 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goToNext, goToPrev, isModalOpen]);

  // Keyboard navigation listener (Accessibility)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen()) return;

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const isFooterPanel = activePanelIndexRef.current === TOTAL_PANELS - 1;
      const footerEl = footerPanelRef.current;

      if (isFooterPanel && footerEl && footerEl.scrollHeight > footerEl.clientHeight + 4) {
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          const atBottom = footerEl.scrollTop + footerEl.clientHeight >= footerEl.scrollHeight - 10;
          if (!atBottom) {
            footerEl.scrollBy({ top: 120, behavior: "smooth" });
            e.preventDefault();
            return;
          }
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          const atTop = footerEl.scrollTop <= 10;
          if (!atTop) {
            footerEl.scrollBy({ top: -120, behavior: "smooth" });
            e.preventDefault();
            return;
          }
        }
      }

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          goToNext();
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goToPrev();
          break;
        case "Home":
          e.preventDefault();
          goToPanel(0);
          break;
        case "End":
          e.preventDefault();
          goToPanel(TOTAL_PANELS - 1);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrev, goToPanel, isModalOpen]);

  // Lock body scroll on homepage
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const activePanel = HOME_PANELS[activePanelIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-brand-dark select-none"
      role="region"
      aria-label="Présentation en panneaux pleine page"
    >
      {/* Side Dots Navigation Indicator */}
      <PanelIndicator
        panels={HOME_PANELS}
        activeIndex={activePanelIndex}
        onSelect={goToPanel}
        isLightActive={activePanel?.isLight}
      />

      {/* Main Panels Vertical Slider Container */}
      <motion.div
        className="w-full h-full flex flex-col"
        animate={{ y: `-${activePanelIndex * 100}%` }}
        transition={{
          duration: TRANSITION_DURATION,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={unlockScroll}
        style={{ willChange: "transform" }}
      >
        {/* Panel 0: Hero */}
        <section
          id="accueil"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center"
          aria-hidden={activePanelIndex !== 0}
        >
          <Hero isActive={activePanelIndex === 0} onNext={goToNext} />
        </section>

        {/* Panel 1: Video Showcase */}
        <section
          id="video"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center bg-white"
          aria-hidden={activePanelIndex !== 1}
        >
          <VideoShowcase isActive={activePanelIndex === 1} />
        </section>

        {/* Panel 2: Usine Showcase */}
        <section
          id="usine"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center bg-white"
          aria-hidden={activePanelIndex !== 2}
        >
          <UsineShowcase isActive={activePanelIndex === 2} />
        </section>

        {/* Panel 3: Products Preview */}
        <section
          id="produits"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center bg-brand-dark"
          aria-hidden={activePanelIndex !== 3}
        >
          <ProductsPreview isActive={activePanelIndex === 3} />
        </section>

        {/* Panel 4: Configurator Teaser */}
        <section
          id="configurateur"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center bg-brand-dark"
          aria-hidden={activePanelIndex !== 4}
        >
          <ConfiguratorTeaser isActive={activePanelIndex === 4} />
        </section>

        {/* Panel 5: Projets Showcase */}
        <section
          id="projets"
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-hidden flex items-center justify-center bg-brand-dark"
          aria-hidden={activePanelIndex !== 5}
        >
          <ProjetsShowcase isActive={activePanelIndex === 5} />
        </section>

        {/* Panel 6: Footer */}
        <section
          id="footer"
          ref={footerPanelRef}
          className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] shrink-0 relative overflow-y-auto overflow-x-hidden bg-white flex flex-col justify-end select-text overscroll-contain"
          aria-hidden={activePanelIndex !== 6}
        >
          <div className="w-full mt-auto">
            <Footer />
          </div>
        </section>
      </motion.div>
    </div>
  );
}
