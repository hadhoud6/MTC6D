import type { Metadata, Viewport } from "next";
import { Amiri, Caveat, Cinzel, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cinzel",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARBRERIE TUNIS CARTHAGE | Since 1989",
  description: "MARBRERIE TUNIS CARTHAGE — experts en marbre, granit et pierre naturelle depuis 1989.",
  openGraph: {
    title: "MARBRERIE TUNIS CARTHAGE | Since 1989",
    description: "Experts en marbre, granit et pierre naturelle depuis 1989.",
    siteName: "MARBRERIE TUNIS CARTHAGE",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${playfair.variable} ${amiri.variable} ${cinzel.variable} ${caveat.variable} bg-brand-light text-brand-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
