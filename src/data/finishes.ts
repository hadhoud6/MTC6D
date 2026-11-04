export const FINISH_VALUES = [
  "lustre",
  "ponceMat",
  "satine",
  "brosse",
  "sable",
  "boucharde",
  "flamme",
  "autre",
] as const;

export type FinishValue = (typeof FINISH_VALUES)[number];

export const FINISH_OPTIONS: Array<{ value: FinishValue; image: string }> = [
  { value: "lustre", image: "/finishes/lustre.webp" },
  { value: "ponceMat", image: "/finishes/ponce-mat.webp" },
  { value: "satine", image: "/finishes/satine.webp" },
  { value: "brosse", image: "/finishes/brosse.webp" },
  { value: "sable", image: "/finishes/sable.webp" },
  { value: "boucharde", image: "/finishes/boucharde.webp" },
  { value: "flamme", image: "/finishes/flamme.webp" },
  { value: "autre", image: "/finishes/autre.webp" },
];
