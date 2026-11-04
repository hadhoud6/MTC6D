"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function LayoutFooter() {
  const pathname = usePathname();
  const isHomePage =
    !pathname ||
    pathname === "/" ||
    pathname === "/fr" ||
    pathname === "/en" ||
    pathname === "/fr/" ||
    pathname === "/en/";

  if (isHomePage) {
    return null;
  }

  return <Footer />;
}
