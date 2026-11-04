import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] px-4 text-center font-sans">
        <h1 className="text-4xl font-bold text-[#1a1a1a]">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page introuvable / Page not found</p>
        <div className="mt-8">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-brand-dark bg-transparent px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all duration-300 hover:bg-brand-dark hover:text-white"
          >
            Retour à l&apos;accueil / Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
