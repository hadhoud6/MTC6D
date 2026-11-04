import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export interface Project {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  location?: LocalizedText;
  images: string[];
  description: LocalizedText;
}

// Realisation portfolio from the client's project photos (November 2026).
// Titles come from the photo folder names. Descriptions describe the
// place itself; no source confirms the scope of work, stone or dates,
// so none is claimed here. Unconfirmed details are flagged to the user.
export const projects: Project[] = [
  {
    id: "four-seasons",
    title: lt("Four Seasons Hotel Tunis", "Four Seasons Hotel Tunis"),
    category: lt("Hôtellerie", "Hospitality"),
    location: lt("Gammarth, La Marsa, Tunisie", "Gammarth, La Marsa, Tunisia"),
    images: ["/projets/four-seasons/7m2a-7381.webp", "/projets/four-seasons/7m2a-7384.webp", "/projets/four-seasons/7m2a-7414.webp", "/projets/four-seasons/7m2a-7486.webp", "/projets/four-seasons/7m2a-7625.webp", "/projets/four-seasons/four-seasons-hotel-gammarth.webp", "/projets/four-seasons/four-seasons-hotel-tunis-1.webp", "/projets/four-seasons/four-seasons-hotel-tunis-10.webp", "/projets/four-seasons/four-seasons-hotel-tunis-12.webp", "/projets/four-seasons/four-seasons-hotel-tunis-13.webp", "/projets/four-seasons/four-seasons-hotel-tunis-16.webp", "/projets/four-seasons/four-seasons-hotel-tunis-2.webp", "/projets/four-seasons/four-seasons-hotel-tunis-21.webp", "/projets/four-seasons/four-seasons-hotel-tunis-22.webp", "/projets/four-seasons/four-seasons-hotel-tunis-23.webp", "/projets/four-seasons/four-seasons-hotel-tunis-3.webp", "/projets/four-seasons/four-seasons-hotel-tunis-4.webp", "/projets/four-seasons/four-seasons-hotel-tunis-5.webp", "/projets/four-seasons/four-seasons-hotel-tunis-6.webp", "/projets/four-seasons/four-seasons-hotel-tunis-7.webp", "/projets/four-seasons/four-seasons-hotel-tunis-9.webp"],
    description: lt("Hôtel de luxe en bord de mer dans la zone touristique du Cap Gammarth, à Gammarth, avec plage privée.", "Beachfront luxury hotel in the Cap Gammarth tourist zone, with a private beach."),
  },
  {
    id: "sheraton",
    title: lt("Sheraton Tunis Hotel", "Sheraton Tunis Hotel"),
    category: lt("Hôtellerie", "Hospitality"),
    location: lt("Tunis, Tunisie", "Tunis, Tunisia"),
    images: ["/projets/sheraton/hotel-sheraton-1.webp", "/projets/sheraton/hotel-sheraton.webp"],
    description: lt("Hôtel de 285 chambres avenue de la Ligue Arabe à Tunis, près du lac de Tunis.", "A 285-room hotel on Avenue de la Ligue Arabe in Tunis, near the Lake of Tunis."),
  },
  {
    id: "oceana",
    title: lt("Oceana Hotel & Spa", "Oceana Hotel & Spa"),
    category: lt("Hôtellerie", "Hospitality"),
    location: lt("Yasmine Hammamet, Hammamet, Tunisie", "Yasmine Hammamet, Hammamet, Tunisia"),
    images: ["/projets/oceana/hotel-oceana-1.webp", "/projets/oceana/hotel-oceana-2.webp", "/projets/oceana/hotel-oceana.webp"],
    description: lt("Hôtel et spa en bord de mer à Yasmine Hammamet, avec accès direct à la plage.", "Beachfront hotel and spa in Yasmine Hammamet, with direct beach access."),
  },
  {
    id: "attijari-bank",
    title: lt("Attijari Bank", "Attijari Bank"),
    category: lt("Commercial", "Commercial"),
    location: lt("Tunis, Tunisie", "Tunis, Tunisia"),
    images: ["/projets/attijeri-bank/attijeri-bank.webp"],
    description: lt("Attijari Bank, banque tunisienne dont le siège est à Tunis.", "Attijari Bank, a Tunisian bank headquartered in Tunis."),
  },
  {
    id: "biat",
    title: lt("BIAT", "BIAT"),
    category: lt("Commercial", "Commercial"),
    location: lt("Tunis, Tunisie", "Tunis, Tunisia"),
    images: ["/projets/biat/biat-2.webp", "/projets/biat/biat-3.webp", "/projets/biat/biat-4.webp", "/projets/biat/biat-5.webp", "/projets/biat/biat.webp"],
    description: lt("La Banque Internationale Arabe de Tunisie (BIAT), plus grande banque privée de Tunisie, dont le siège est à Tunis.", "Banque Internationale Arabe de Tunisie (BIAT), Tunisia's largest private-sector bank, headquartered in Tunis."),
  },
  {
    id: "lac",
    title: lt("Les Berges du Lac", "Les Berges du Lac"),
    category: lt("Commercial", "Commercial"),
    location: lt("Tunis, Tunisie", "Tunis, Tunisia"),
    images: ["/projets/lac/lac-details-2.webp", "/projets/lac/lac-details.webp", "/projets/lac/lac.webp"],
    description: lt("Les Berges du Lac, quartier d'affaires et résidentiel de Tunis aménagé au bord du lac de Tunis.", "Les Berges du Lac, a business and residential district of Tunis built along the Lake of Tunis."),
  },
  {
    id: "mendes-france",
    title: lt("Mendès France", "Mendès France"),
    category: lt("Commercial", "Commercial"),
    location: lt("Tunis, Tunisie", "Tunis, Tunisia"),
    images: ["/projets/mandes-france/mandes-france-detail.webp", "/projets/mandes-france/mandes-france.webp"],
    description: lt("Réalisation à Tunis, rue Pierre Mendès France.", "A project in Tunis, on Rue Pierre Mendès France."),
  },
  {
    id: "mosquee",
    title: lt("Mosquée", "Mosque"),
    category: lt("Lieu de culte", "Place of Worship"),
    images: ["/projets/mosque/mosque-1.webp", "/projets/mosque/mosque-2.webp", "/projets/mosque/mosque-3.webp", "/projets/mosque/mosque-4.webp", "/projets/mosque/mosque-5.webp", "/projets/mosque/mosque-6.webp", "/projets/mosque/mosque-7.webp", "/projets/mosque/mosque.webp"],
    description: lt("Intérieurs de mosquée en marbre et pierre naturelle.", "Mosque interiors in marble and natural stone."),
  },
  {
    id: "rosaces",
    title: lt("Rosaces", "Rosettes"),
    category: lt("Décoration", "Decoration"),
    images: ["/projets/rosaces/rosace-2.webp", "/projets/rosaces/rosace-3.webp", "/projets/rosaces/rosace-4.webp", "/projets/rosaces/roscace-hotel-ksar.webp"],
    description: lt("Rosaces en marbre, médaillons décoratifs au sol réalisés en atelier.", "Marble rosettes, decorative floor medallions crafted in the workshop."),
  },
  {
    id: "tables",
    title: lt("Tables de réunion", "Meeting Tables"),
    category: lt("Mobilier", "Furniture"),
    images: ["/projets/tables/table-de-reunion-1.webp", "/projets/tables/table-de-reunion-3.webp", "/projets/tables/table-de-reunion.webp"],
    description: lt("Tables de réunion en marbre, fabriquées sur mesure.", "Made-to-measure marble meeting tables."),
  },
  {
    id: "zemni",
    title: lt("Zemni", "Zemni"),
    category: lt("Projet", "Project"),
    images: ["/projets/zemni/zemni.webp"],
    description: lt("Réalisation présentée sous le nom « Zemni ».", "A project presented under the name “Zemni”."),
  },
];
