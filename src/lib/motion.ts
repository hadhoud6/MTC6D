import type { Transition, Variants } from "framer-motion";

export const CATALOGUE_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.9,
  bounce: 0,
} satisfies Transition;

export const CATALOGUE_FADE_TRANSITION = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

export const CATALOGUE_FADE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies Variants;

export const CATALOGUE_CONTENT_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies Variants;

export const CATALOGUE_CONTENT_TRANSITION = {
  visible: { ...CATALOGUE_FADE_TRANSITION, delay: 0.1 },
  exit: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
};

export const CATALOGUE_CAROUSEL_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;
