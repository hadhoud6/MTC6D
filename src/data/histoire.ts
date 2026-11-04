import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export interface Milestone {
  year: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  tag?: LocalizedText;
  image?: string;
}

// SWAP: Replace placeholder timeline data with client's confirmed historical milestones
export const histoireMilestones: Milestone[] = [
  {
    year: "1989",
    title: lt(
      "Fondation de MARBRERIE TUNIS CARTHAGE",
      "Founding of MARBRERIE TUNIS CARTHAGE"
    ),
    subtitle: lt("L'Origine d'une Passion", "The Origin of a Passion"),
    description: lt(
      "Création du premier atelier artisanal à Carthage. Dès ses débuts, l'entreprise s'est consacrée à la valorisation et à la transformation des pierres marbrières tunisiennes les plus nobles avec une exigence de finition sans compromis. — Texte indicatif à remplacer par le client.",
      "Creation of the first artisanal workshop in Carthage. From its inception, the company dedicated itself to enhancing and crafting the finest Tunisian marbles with an uncompromising standard of finishing. — Placeholder text to be replaced by the client."
    ),
    tag: lt("Genèse", "Genesis"),
    // SWAP: temporary stock photo, replace with real client photo
    image:
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "1998",
    title: lt(
      "Extension de l'atelier de production",
      "Expansion of the Production Workshop"
    ),
    subtitle: lt("Croissance & Nouvelles Capacités", "Growth & Enhanced Capacities"),
    description: lt(
      "Acquisition de nouveaux espaces d'usinage et investissement dans des équipements de coupe de grande envergure pour répondre à la demande croissante de projets architecturaux d'envergure. — Texte indicatif à remplacer par le client.",
      "Acquisition of new machining areas and investment in large-scale cutting equipment to meet the growing demand for major architectural projects. — Placeholder text to be replaced by the client."
    ),
    tag: lt("Expansion", "Expansion"),
    // SWAP: temporary stock photo, replace with real client photo
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2008",
    title: lt(
      "Introduction de nouvelles techniques de polissage",
      "Introduction of Advanced Polishing Techniques"
    ),
    subtitle: lt("Maîtrise des Finitions", "Finishing Mastery"),
    description: lt(
      "Mise en place de lignes de traitement de surface de haute précision permettant d'obtenir des finitions polies miroir, adoucies, brossées et sablées d'une finesse incomparable. — Texte indicatif à remplacer par le client.",
      "Implementation of high-precision surface treatment lines enabling mirror-polished, honed, brushed, and sandblasted finishes of unmatched refinement. — Placeholder text to be replaced by the client."
    ),
    tag: lt("Innovation", "Innovation"),
    // SWAP: temporary stock photo, replace with real client photo
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2017",
    title: lt(
      "Modernisation du parc de machines numériques",
      "Modernization with CNC Machinery"
    ),
    subtitle: lt("Précision Haute Technologie", "High-Tech Precision"),
    description: lt(
      "Intégration de centres d'usinage 5 axes à commande numérique et de scies à fil diamanté, conjuguant le geste traditionnel du tailleur de pierre à la rigueur de l'ingénierie moderne. — Texte indicatif à remplacer par le client.",
      "Integration of 5-axis CNC machining centers and diamond wire saws, blending the stonecutter's traditional craft with modern engineering rigor. — Placeholder text to be replaced by the client."
    ),
    tag: lt("Technologie", "Technology"),
    // SWAP: temporary stock photo, replace with real client photo
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2024",
    title: lt(
      "Rayonnement international & projets d'exception",
      "International Reach & Exceptional Projects"
    ),
    subtitle: lt("L'Excellence Contemporaine", "Contemporary Excellence"),
    description: lt(
      "Réalisation de résidences de prestige, d'hôtels et de projets institutionnels à l'international, complétée par des outils numériques innovants comme notre configurateur 3D sur mesure. — Texte indicatif à remplacer par le client.",
      "Execution of prestigious residences, luxury hotels, and institutional projects internationally, complemented by innovative digital tools like our custom 3D configurator. — Placeholder text to be replaced by the client."
    ),
    tag: lt("Aujourd'hui", "Today"),
    // SWAP: temporary stock photo, replace with real client photo
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
  },
];
