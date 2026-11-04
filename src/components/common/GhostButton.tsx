"use client";

import React, { forwardRef } from "react";
import { Link } from "@/lib/i18n/routing";

const LocalizedLink = Link as unknown as React.ForwardRefExoticComponent<
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    { href: string } &
    React.RefAttributes<HTMLAnchorElement>
>;

export type GhostButtonVariant = "black" | "orange" | "white";
export type GhostButtonSize = "sm" | "md" | "lg";
export type GhostButtonRounded = "full" | "xl" | "lg" | "md" | "none";

export interface GhostButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GhostButtonVariant;
  size?: GhostButtonSize;
  rounded?: GhostButtonRounded;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<
  GhostButtonVariant,
  {
    border: string;
    text: string;
    fill: string;
    focusRing: string;
  }
> = {
  black: {
    border: "border-brand-dark",
    text: "text-brand-dark group-hover:text-white",
    fill: "bg-brand-dark",
    focusRing: "focus-visible:ring-brand-dark/30",
  },
  orange: {
    border: "border-brand-orange",
    text: "text-brand-orange group-hover:text-white",
    fill: "bg-brand-orange",
    focusRing: "focus-visible:ring-brand-orange/40",
  },
  white: {
    border: "border-white",
    text: "text-white group-hover:text-brand-dark",
    fill: "bg-white",
    focusRing: "focus-visible:ring-white/40",
  },
};

const sizeStyles: Record<GhostButtonSize, string> = {
  sm: "px-5 py-2 text-xs tracking-wider",
  md: "px-8 py-3.5 text-xs sm:text-sm tracking-widest",
  lg: "px-10 py-4 text-sm sm:text-base tracking-widest",
};

const roundedStyles: Record<GhostButtonRounded, string> = {
  full: "rounded-full",
  xl: "rounded-xl",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

export const GhostButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GhostButtonProps
>(function GhostButton(
  {
    variant = "black",
    size = "md",
    rounded = "full",
    href,
    target,
    rel,
    download,
    isLoading = false,
    fullWidth = false,
    disabled = false,
    className = "",
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const currentVariant = variantStyles[variant] ?? variantStyles.black;
  const currentSize = sizeStyles[size] ?? sizeStyles.md;
  const currentRounded = roundedStyles[rounded] ?? roundedStyles.full;

  const containerClasses = [
    "group relative inline-flex items-center justify-center overflow-hidden border bg-transparent font-bold uppercase select-none transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 isolate",
    currentVariant.border,
    currentVariant.focusRing,
    currentSize,
    currentRounded,
    fullWidth ? "w-full" : "w-fit",
    disabled || isLoading
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer active:scale-[0.98]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const fillSweepClasses = [
    "pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)]",
    currentVariant.fill,
    disabled || isLoading
      ? "group-hover:-translate-x-full"
      : "group-hover:translate-x-0 group-focus-visible:translate-x-0",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClasses = [
    "relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 font-bold",
    currentVariant.text,
  ]
    .filter(Boolean)
    .join(" ");

  const innerContent = (
    <>
      <span aria-hidden="true" className={fillSweepClasses} />
      <span className={contentClasses}>
        {isLoading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    </>
  );

  if (href) {
    const isExternal =
      Boolean(target === "_blank") ||
      Boolean(download) ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
          download={download}
          className={containerClasses}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {innerContent}
        </a>
      );
    }

    return (
      <LocalizedLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={containerClasses}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {innerContent}
      </LocalizedLink>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || isLoading}
      className={containerClasses}
      {...rest}
    >
      {innerContent}
    </button>
  );
});

export default GhostButton;
