"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/data/siteConfig";

const YT_PLAYING = 1;
const YT_BUFFERING = 3;

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
  getPlayerState: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoShowcaseProps {
  isActive?: boolean;
}

export default function VideoShowcase({ isActive }: VideoShowcaseProps) {
  const t = useTranslations("video");
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const isInViewRef = useRef(false);
  const isMutedRef = useRef(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const applyPlayback = useCallback((shouldPlay: boolean) => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;

    if (shouldPlay) {
      if (isMutedRef.current) {
        player.mute();
      } else {
        player.unMute();
      }
      player.playVideo();
      return;
    }

    const state = player.getPlayerState();
    if (state === YT_PLAYING || state === YT_BUFFERING) {
      player.pauseVideo();
    }
  }, []);

  useEffect(() => {
    const initPlayer = () => {
      if (!playerContainerRef.current || playerRef.current) return;

      new window.YT!.Player(playerContainerRef.current, {
        videoId: siteConfig.assets.youtubeVideoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            playerReadyRef.current = true;
            const iframe = playerContainerRef.current?.querySelector("iframe");
            if (iframe) {
              iframe.style.pointerEvents = "none";
            }
            event.target.mute();
            applyPlayback(isInViewRef.current);
          },
        },
      });
    };

    if (typeof isActive === "boolean") {
      isInViewRef.current = isActive;
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        initPlayer();
      };
    }

    return () => {
      playerReadyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [applyPlayback, isActive]);

  // Respond immediately when isActive prop changes
  useEffect(() => {
    if (typeof isActive === "boolean") {
      isInViewRef.current = isActive;
      applyPlayback(isActive);
    }
  }, [isActive, applyPlayback]);

  // Fallback observer if isActive prop is not provided (standalone mode)
  useEffect(() => {
    if (typeof isActive === "boolean") return;

    const container = videoContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        isInViewRef.current = entry.isIntersecting;
        applyPlayback(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isActive, applyPlayback]);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-white px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div
          ref={videoContainerRef}
          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10"
        >
          <div ref={playerContainerRef} className="pointer-events-none absolute inset-0 h-full w-full" />

          <button
            type="button"
            onClick={toggleMute}
            className="pointer-events-auto absolute right-4 bottom-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/75"
            aria-label={isMuted ? t("unmute") : t("mute")}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
