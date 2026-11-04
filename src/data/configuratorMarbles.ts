import { products } from "@/data/products";
import type { Product } from "@/types/content";

// Test selection for the 3D kitchen: 4 contrasting stones, so the switching
// can be tried first with a short list. To offer the whole catalogue in the
// switcher, replace this list with `products`.
export const CONFIGURATOR_MARBLE_SLUGS = [
  // White with gold-grey veining, closest to the reference kitchen photo.
  "marbre-calacatta",
  // Black, grey and warm honey onyx for contrast.
  "marbre-noir-aziza",
  "marbre-gris-bardiglio",
  "onyx-miel",
] as const;

export const configuratorMarbles: Product[] = CONFIGURATOR_MARBLE_SLUGS.map(
  (slug) => products.find((product) => product.slug === slug),
).filter((product): product is Product => Boolean(product));
