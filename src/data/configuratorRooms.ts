import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export type ConfiguratorRoomId =
  | "kitchen"
  | "bathroom"
  | "livingRoom"
  | "furniture";

export interface ConfiguratorRoom {
  id: ConfiguratorRoomId;
  image: string;
  name: LocalizedText;
  description: LocalizedText;
  bullets: LocalizedText[];
}

export const configuratorPopupCopy = {
  title: lt("Configurateur 3D", "3D Configurator"),
  subtitle: lt(
    "Choisissez votre espace à visualiser",
    "Choose your space to visualize",
  ),
  visualizeCta: lt("Visualiser en 3D", "View in 3D"),
};

// SWAP: Replace placeholder images with final room visuals
export const configuratorRooms: ConfiguratorRoom[] = [
  {
    id: "livingRoom",
    image: "/2.jpg",
    name: lt("Salon", "Living Room"),
    description: lt(
      "Créez un espace de vie élégant et raffiné",
      "Create an elegant, refined living space",
    ),
    bullets: [
      lt("Revêtements muraux", "Wall cladding"),
      lt("Cheminées", "Fireplaces"),
      lt("Sols en marbre", "Marble flooring"),
    ],
  },
  {
    id: "kitchen",
    image: "/configurateur/kitchen-reference.webp",
    name: lt("Cuisine", "Kitchen"),
    description: lt(
      "Visualisez votre cuisine de rêve avec nos marbres premium",
      "Visualize your dream kitchen with our premium marbles",
    ),
    bullets: [
      lt("Plans de travail", "Countertops"),
      lt("Crédences", "Backsplashes"),
      lt("Îlots centraux", "Central islands"),
    ],
  },
  {
    id: "bathroom",
    image: "/4.jpg",
    name: lt("Salle de Bain", "Bathroom"),
    description: lt(
      "Transformez votre salle de bain en espace de bien-être",
      "Transform your bathroom into a wellness space",
    ),
    bullets: [
      lt("Vasques", "Vanities"),
      lt("Douches", "Showers"),
      lt("Revêtements muraux", "Wall cladding"),
    ],
  },
  {
    id: "furniture",
    image: "/3.jpg",
    name: lt("Tables & Mobilier", "Tables & Furniture"),
    description: lt(
      "Concevez des pièces uniques pour votre intérieur",
      "Design unique pieces for your interior",
    ),
    bullets: [
      lt("Tables à manger", "Dining tables"),
      lt("Tables basses", "Coffee tables"),
      lt("Consoles", "Console tables"),
    ],
  },
];
