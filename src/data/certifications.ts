import type { LocalizedText } from "@/types/content";

const lt = (fr: string, en: string): LocalizedText => ({ fr, en });

export interface Certification {
  id: string;
  code: string;
  badge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
}

// SWAP: Replace placeholder certifications with client's actual accredited certificates
export const certifications: Certification[] = [
  {
    id: "iso-9001",
    code: "ISO 9001:2015",
    badge: lt("Qualité", "Quality"),
    title: lt(
      "Système de Management de la Qualité",
      "Quality Management System"
    ),
    description: lt(
      "Exigence rigoureuse appliquée à chaque étape de la chaîne d'approvisionnement et de façonnage.",
      "Rigorous standards applied across every stage of stone supply and precision fabrication."
    ),
  },
  {
    id: "iso-14001",
    code: "ISO 14001:2015",
    badge: lt("Environnement", "Environment"),
    title: lt(
      "Management Environnemental",
      "Environmental Management"
    ),
    description: lt(
      "Pratiques durables, filtration et circuit fermé de recyclage des eaux de découpe et de polissage.",
      "Sustainable practices, water filtration, and closed-loop recycling for cutting and polishing."
    ),
  },
  {
    id: "ce-mark",
    code: "Conformité CE",
    badge: lt("Normes UE", "EU Standards"),
    title: lt(
      "Conformité aux Normes Européennes",
      "European Standards Compliance"
    ),
    description: lt(
      "Certification des caractéristiques physiques et mécaniques des revêtements et dalles de pierre naturelle.",
      "Certification of physical and mechanical characteristics of natural stone slabs and claddings."
    ),
  },
  {
    id: "artisanat-excellence",
    code: "Label Artisanal",
    badge: lt("Savoir-Faire", "Craftsmanship"),
    title: lt(
      "Maîtrise Artisanale Reconnue",
      "Recognized Artisanal Mastery"
    ),
    description: lt(
      "Transmission du savoir-faire traditionnel de taille et de façonnage de la pierre marbrière tunisienne.",
      "Inherited tradition and specialized hand craftsmanship for rare Tunisian natural stone."
    ),
  },
];
