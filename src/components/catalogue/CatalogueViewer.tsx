"use client";

import dynamic from "next/dynamic";
import { BookOpen, Sparkles } from "lucide-react";
import CatalogueErrorBoundary from "./CatalogueErrorBoundary";

// Dynamic import with ssr: false to prevent SSR canvas and DOM reference issues
const FlipBook = dynamic(() => import("./FlipBook"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-3xl min-h-[480px] sm:min-h-[580px] rounded-2xl bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-xl flex flex-col items-center justify-center p-8 text-center animate-pulse mx-auto">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
          <BookOpen className="w-8 h-8 animate-bounce" />
        </div>
        <Sparkles className="w-5 h-5 text-brand-orange absolute -top-1 -right-1 animate-spin" />
      </div>
      <h3 className="font-serif text-2xl text-brand-dark font-normal mb-2">
        Chargement du catalogue interactif...
      </h3>
      <p className="text-neutral-500 text-sm max-w-md font-sans">
        Préparation des pages en haute définition
      </p>
      <div className="w-48 h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-6">
        <div className="w-full h-full bg-brand-orange origin-left animate-[loading-bar_1.5s_infinite_ease-in-out]" />
      </div>
    </div>
  ),
});

type CatalogueViewerProps = {
  pdfUrl?: string;
};

export default function CatalogueViewer({ pdfUrl = "/catalogue.pdf" }: CatalogueViewerProps) {
  return (
    <div className="w-full">
      <CatalogueErrorBoundary pdfUrl={pdfUrl}>
        <FlipBook pdfUrl={pdfUrl} />
      </CatalogueErrorBoundary>
    </div>
  );
}
