export const PRODUCT_TYPE_VALUES = [
  "marbre",
  "granit",
  "travertin",
  "patagonia",
  "onyx",
  "autre",
] as const;

export type ProductTypeValue = (typeof PRODUCT_TYPE_VALUES)[number];

export const PRODUCT_TYPES: { value: ProductTypeValue; labelKey: ProductTypeValue }[] =
  PRODUCT_TYPE_VALUES.map((value) => ({ value, labelKey: value }));
