import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export interface UsineMachine {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  images: string[];
  description: LocalizedText;
}

// Factory areas, photographed in the client's workshop (November 2026).
export const usineMachines: UsineMachine[] = [
  {
    id: "decoupe",
    title: lt("Débiteuse à pont", "Bridge Saw"),
    category: lt("Découpe", "Cutting"),
    images: ["/usine/decoupe/debiteuse-a-pont-1.webp", "/usine/decoupe/disque.webp"],
    description: lt("Découpe des dalles et des plans de travail à la débiteuse à pont, avec précision et régularité.", "Cutting slabs and countertops with the bridge saw, precisely and consistently."),
  },
  {
    id: "polissage",
    title: lt("Ligne de polissage", "Polishing Line"),
    category: lt("Polissage", "Polishing"),
    images: ["/usine/polissage/lineaire-1.webp", "/usine/polissage/lineaire-2.webp"],
    description: lt("Ligne de polissage des surfaces : les dalles y reçoivent leur finition, du poli brillant à l'adouci.", "Surface polishing line, where slabs receive their finish, from high gloss to honed."),
  },
  {
    id: "machine-3-axes",
    title: lt("Machine 3 axes OMAG", "OMAG 3-Axis Machine"),
    category: lt("Usinage CNC", "CNC Machining"),
    images: ["/usine/machine-3-axes/omag-3-axes-1.webp", "/usine/machine-3-axes/omag-3-axes-2.webp"],
    description: lt("Usinage 3 axes OMAG pour les découpes complexes, les formes sur mesure et les finitions de précision.", "OMAG 3-axis machining for complex cuts, custom shapes and precision finishing."),
  },
  {
    id: "waterjet",
    title: lt("Découpe jet d'eau", "Waterjet Cutting"),
    category: lt("Découpe", "Cutting"),
    images: ["/usine/waterjet/waterjet-1.webp", "/usine/waterjet/waterjet-2.webp", "/usine/waterjet/waterjet.webp"],
    description: lt("Découpe au jet d'eau pour les formes complexes et les motifs précis, sans échauffement de la pierre.", "Waterjet cutting for complex shapes and precise patterns, without heating the stone."),
  },
  {
    id: "conditionnement",
    title: lt("Conditionnement et entrepôt", "Packaging and Warehouse"),
    category: lt("Conditionnement", "Packaging"),
    images: ["/usine/conditionnement/entrepot.webp", "/usine/conditionnement/mode-demballage.webp", "/usine/conditionnement/vue-densemble.webp"],
    description: lt("Préparation des commandes, emballage protecteur et stockage des dalles et des ouvrages finis avant leur expédition.", "Order preparation, protective packaging and storage of finished slabs and pieces before dispatch."),
  },
];
