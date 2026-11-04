import type { SiteConfig } from "@/types/content";

// SWAP: Update all placeholder asset paths when real client media is delivered
export const siteConfig: SiteConfig = {
  name: "MARBRERIE TUNIS CARTHAGE",
  nameArabic: "معمل الرخام تونس قرطاج",
  founded: 1989,
  phone: "+216 70 836 518",
  email: "contact@marbrerietuniscarthage.com",
  address: "32 rue de l’Artisanat, zone industrielle Charguia 2, Ariana la Soukra, Tunis, Tunisie",
  location: {
    latitude: 36.85539,
    longitude: 10.2055,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=36.85539,10.2055",
  },
  whatsapp: {
    number: "21670836518",
    prefilledMessage:
      "Bonjour, je souhaite obtenir des informations sur vos produits en marbre.",
  },
  social: {
    facebook: "https://www.facebook.com/people/Marbrerie-Tunis-Carthage/100064855083718/",
    instagram: "https://www.instagram.com/marbrerie_tunis_carthage/",
    youtube: "https://www.youtube.com/user/MTCarthage",
    linkedin: "https://www.linkedin.com/company/marbrerie-tunis-carthage",
  },
  // SWAP: Replace placeholder hours with client's confirmed opening hours
  hours: [
    {
      day: { fr: "Lundi – Vendredi", en: "Monday – Friday" },
      hours: { fr: "08h00 – 17h00", en: "8:00 AM – 5:00 PM" },
    },
    {
      day: { fr: "Samedi", en: "Saturday" },
      hours: { fr: "08h00 – 13h00", en: "8:00 AM – 1:00 PM" },
    },
    {
      day: { fr: "Dimanche", en: "Sunday" },
      hours: { fr: "Fermé", en: "Closed" },
    },
  ],
  hoursNote: {
    fr: "Lundi – Vendredi : 08h00 – 17h00 — Samedi : 08h00 – 13h00 — Dimanche : Fermé",
    en: "Monday – Friday: 8:00 AM – 5:00 PM — Saturday: 8:00 AM – 1:00 PM — Sunday: Closed",
  },
  assets: {
    logo: "/logo.png",
    productsSectionBackground: "/0.jpg",
    configuratorBackground: "/00.jpg",
    // SWAP: Replace with final client YouTube video ID
    youtubeVideoId: "r5NAR0xMqTc",
  },
};

export function getWhatsAppUrl(): string {
  const { number, prefilledMessage } = siteConfig.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(prefilledMessage)}`;
}
