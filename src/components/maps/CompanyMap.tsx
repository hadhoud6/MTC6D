"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import "maplibre-gl/dist/maplibre-gl.css";
import "./company-map.css";

// Free, no-key map: OpenFreeMap vector tiles (OpenStreetMap data) rendered
// with MapLibre GL. The Positron style is fetched and every "symbol" layer
// is removed before the map is created, so no place names, road names or
// POI icons/labels are drawn at all. The only label on the map is the
// company marker below. This is not possible with the plain Google Maps
// embed iframe, which has no styling option and needs a billed API key
// for a styled JavaScript map.
//
// Attribution stays on: MapLibre shows the style's attribution control
// and the OpenStreetMap ODbL licence requires it.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const ZOOM = 16;
const LOAD_TIMEOUT_MS = 12000;

type CompanyMapProps = {
  className?: string;
  directionsLabel: string;
};

export default function CompanyMap({
  className = "",
  directionsLabel,
}: CompanyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const { latitude, longitude, googleMapsUrl } = siteConfig.location;

  // The footer map is on every page and MapLibre is a large chunk, so
  // only load it once the map is about to scroll into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let timedOut = false;
    let map: import("maplibre-gl").Map | null = null;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      map?.remove();
      map = null;
      if (!cancelled) setFailed(true);
    }, LOAD_TIMEOUT_MS);

    const init = async () => {
      try {
        // Dynamic import keeps MapLibre out of the initial bundle; it
        // only runs in the browser, never during server rendering.
        const maplibregl = await import("maplibre-gl");
        if (cancelled || timedOut) return;

        const response = await fetch(STYLE_URL);
        if (!response.ok) throw new Error(`map style ${response.status}`);
        const style = (await response.json()) as {
          layers?: { type?: string }[];
        } & Record<string, unknown>;
        if (Array.isArray(style.layers)) {
          style.layers = style.layers.filter(
            (layer) => layer.type !== "symbol",
          );
        }
        if (cancelled || timedOut) return;

        map = new maplibregl.Map({
          container: el,
          style: style as unknown as maplibregl.StyleSpecification,
          center: [longitude, latitude],
          zoom: ZOOM,
          // Don't trap page scrolling over the map. Attribution is
          // left at its default (on) — see the note at the top of this file.
          scrollZoom: false,
        });
        map.addControl(
          new maplibregl.NavigationControl({ visualizePitch: false }),
          "top-right",
        );

        const markerEl = document.createElement("div");
        markerEl.className = "mtc-map-marker";
        const label = document.createElement("span");
        label.className = "mtc-map-marker__label";
        label.textContent = siteConfig.name;
        const pin = document.createElement("span");
        pin.className = "mtc-map-marker__pin";
        pin.setAttribute("aria-hidden", "true");
        markerEl.append(label, pin);

        new maplibregl.Marker({ element: markerEl, anchor: "bottom" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        let hasLoaded = false;
        map.on("load", () => {
          if (cancelled || timedOut) return;
          hasLoaded = true;
          window.clearTimeout(timeout);
          setLoaded(true);
        });
        // Only a failure before the first load replaces the map: a
        // single bad tile after load must not hide a working map.
        map.on("error", () => {
          if (!cancelled && !timedOut && !hasLoaded) setFailed(true);
        });
      } catch {
        if (!cancelled && !timedOut) setFailed(true);
      }
    };

    void init();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      map?.remove();
      map = null;
    };
  }, [visible, latitude, longitude, googleMapsUrl]);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-start justify-center gap-2 bg-stone-100 p-4 text-sm ${className}`}
      >
        <p className="font-semibold text-stone-900">{siteConfig.name}</p>
        <p className="text-stone-600">{siteConfig.address}</p>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-stone-900 underline underline-offset-4"
        >
          {directionsLabel} ↗
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 bg-stone-100"
        role="region"
        aria-label={siteConfig.name}
      >
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse bg-stone-100"
            aria-hidden="true"
          />
        )}
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-end gap-1 border-t border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-800 transition hover:text-black"
      >
        {directionsLabel} ↗
      </a>
    </div>
  );
}
