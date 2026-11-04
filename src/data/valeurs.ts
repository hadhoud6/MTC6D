import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export interface Valeur {
  id: string;
  number: string;
  iconName: "gem" | "compass" | "layers" | "shield-check";
  title: LocalizedText;
  description: LocalizedText;
}

// SWAP: Replace placeholder values with client's confirmed corporate values
export const valeurs: Valeur[] = [
  {
    id: "excellence",
    number: "01",
    iconName: "gem",
    title: lt("Excellence Artisanale", "Artisanal Excellence"),
    description: lt(
      "La recherche constante de la perfection dans la taille, le polissage et l'assemblage de chaque pièce unique.",
      "The relentless pursuit of perfection in the cutting, polishing, and assembly of every unique stone piece."
    ),
  },
  {
    id: "selection",
    number: "02",
    iconName: "compass",
    title: lt("Sélection Rigoureuse", "Rigorous Selection"),
    description: lt(
      "Une sélection méticuleuse des carrières les plus réputées pour garantir des blocs de marbre et granit d'une pureté rare.",
      "A meticulous selection from the most renowned quarries to ensure marble and granite blocks of exceptional purity."
    ),
  },
  {
    id: "innovation",
    number: "03",
    iconName: "layers",
    title: lt("Innovation & Précision", "Innovation & Precision"),
    description: lt(
      "L'union harmonieuse du savoir-faire traditionnel et des technologies numériques 5 axes les plus avancées.",
      "The harmonious union of traditional craftsmanship and the most advanced 5-axis digital technologies."
    ),
  },
  {
    id: "durabilite",
    number: "04",
    iconName: "shield-check",
    title: lt("Engagement Durable", "Sustainable Commitment"),
    description: lt(
      "Une valorisation éco-responsable des ressources naturelles, le recyclage de l'eau d'usinage et la durabilité intemporelle de la pierre.",
      "Eco-conscious stewardship of natural resources, closed-loop water recycling, and the timeless durability of natural stone."
    ),
  },
];
