"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/types/content";

// The 3D viewer uses WebGL and browser-only APIs, so it loads on the
// client only; the server renders a loading placeholder instead.
const Configurator3D = dynamic(
  () => import("@/components/configurator/Configurator3D"),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-28 md:px-8 md:pt-36">
        <div className="aspect-[16/10] min-h-[420px] w-full animate-pulse rounded-3xl bg-brand-dark/10 sm:aspect-[16/9]" />
      </div>
    ),
  },
);

export default function Configurator3DLoader({
  locale,
}: {
  locale: Locale;
}) {
  return <Configurator3D locale={locale} />;
}
