import type { ProductTypeValue } from "@/data/productTypes";
import type { LocalizedText } from "@/types/content";

export type ProductSubtype = {
  type: ProductTypeValue;
  id: string;
  name: LocalizedText;
  image: string;
};

// Varieties offered in the quote (devis) form, from the client's real photos.
export const productSubtypes: ProductSubtype[] = [
  { type: "marbre", id: "marbre-azul-macaubas", name: { fr: "Azul Macaubas", en: "Azul Macaubas" }, image: "/materiaux/marbre/marbre-azul-macaubas.webp" },
  { type: "marbre", id: "marbre-black-marquina", name: { fr: "Black Marquina", en: "Black Marquina" }, image: "/materiaux/marbre/marbre-black-marquina.webp" },
  { type: "marbre", id: "marbre-blanc-de-blanc", name: { fr: "Blanc de Blanc", en: "Blanc de Blanc" }, image: "/materiaux/marbre/marbre-blanc-de-blanc.webp" },
  { type: "marbre", id: "marbre-blanc-veine", name: { fr: "Blanc Veiné", en: "Veined White" }, image: "/materiaux/marbre/marbre-blanc-veine.webp" },
  { type: "marbre", id: "marbre-botticino", name: { fr: "Botticino", en: "Botticino" }, image: "/materiaux/marbre/marbre-botticino.webp" },
  { type: "marbre", id: "marbre-bronze-armani", name: { fr: "Bronze Armani", en: "Bronze Armani" }, image: "/materiaux/marbre/marbre-bronze-armani.webp" },
  { type: "marbre", id: "marbre-calacatta", name: { fr: "Calacatta", en: "Calacatta" }, image: "/materiaux/marbre/marbre-calacatta.webp" },
  { type: "marbre", id: "marbre-crema-marfil", name: { fr: "Crema Marfil", en: "Crema Marfil" }, image: "/materiaux/marbre/marbre-crema-marfil.webp" },
  { type: "marbre", id: "marbre-dark-emperador", name: { fr: "Dark Emperador", en: "Dark Emperador" }, image: "/materiaux/marbre/marbre-dark-emperador.webp" },
  { type: "marbre", id: "marbre-galaxy", name: { fr: "Galaxy", en: "Galaxy" }, image: "/materiaux/marbre/marbre-galaxy.webp" },
  { type: "marbre", id: "marbre-gioa-blanc", name: { fr: "Gioa Blanc", en: "White Gioa" }, image: "/materiaux/marbre/marbre-gioa-blanc.webp" },
  { type: "marbre", id: "marbre-gioa-classique", name: { fr: "Gioa Classique", en: "Classic Gioa" }, image: "/materiaux/marbre/marbre-gioa-classique.webp" },
  { type: "marbre", id: "marbre-green-guatemala", name: { fr: "Green Guatemala", en: "Green Guatemala" }, image: "/materiaux/marbre/marbre-green-guatemala.webp" },
  { type: "marbre", id: "marbre-grey-foussana", name: { fr: "Grey Foussana", en: "Grey Foussana" }, image: "/materiaux/marbre/marbre-grey-foussana.webp" },
  { type: "marbre", id: "marbre-gris-bardiglio", name: { fr: "Gris Bardiglio", en: "Bardiglio Grey" }, image: "/materiaux/marbre/marbre-gris-bardiglio.webp" },
  { type: "marbre", id: "marbre-jaune-imperador", name: { fr: "Jaune Imperador", en: "Imperador Yellow" }, image: "/materiaux/marbre/marbre-jaune-imperador.webp" },
  { type: "marbre", id: "marbre-jaune-sienna", name: { fr: "Jaune Sienna", en: "Sienna Yellow" }, image: "/materiaux/marbre/marbre-jaune-sienna.webp" },
  { type: "marbre", id: "marbre-khadel-clair", name: { fr: "Khadel Clair", en: "Light Khadel" }, image: "/materiaux/marbre/marbre-khadel-clair.webp" },
  { type: "marbre", id: "marbre-khadel-gris", name: { fr: "Khadel Gris", en: "Grey Khadel" }, image: "/materiaux/marbre/marbre-khadel-gris.webp" },
  { type: "marbre", id: "marbre-khadel-gris-clair", name: { fr: "Khadel Gris Clair", en: "Light Grey Khadel" }, image: "/materiaux/marbre/marbre-khadel-gris-clair.webp" },
  { type: "marbre", id: "marbre-kyknos", name: { fr: "Kyknos", en: "Kyknos" }, image: "/materiaux/marbre/marbre-kyknos.webp" },
  { type: "marbre", id: "marbre-marron-emperador", name: { fr: "Marron Emperador", en: "Emperador Brown" }, image: "/materiaux/marbre/marbre-marron-emperador.webp" },
  { type: "marbre", id: "marbre-marron-imperador-light", name: { fr: "Marron Imperador Light", en: "Light Imperador Brown" }, image: "/materiaux/marbre/marbre-marron-imperador-light.webp" },
  { type: "marbre", id: "marbre-noce", name: { fr: "Noce", en: "Noce" }, image: "/materiaux/marbre/marbre-noce.webp" },
  { type: "marbre", id: "marbre-noir-aziza", name: { fr: "Noir Aziza", en: "Aziza Black" }, image: "/materiaux/marbre/marbre-noir-aziza.webp" },
  { type: "marbre", id: "marbre-noir-portoro", name: { fr: "Noir Portoro", en: "Portoro Black" }, image: "/materiaux/marbre/marbre-noir-portoro.webp" },
  { type: "marbre", id: "marbre-noir-portoro-2", name: { fr: "Noir Portoro 2", en: "Portoro Black 2" }, image: "/materiaux/marbre/marbre-noir-portoro-2.webp" },
  { type: "marbre", id: "marbre-rose-portugal", name: { fr: "Rose Portugal", en: "Rosa Portugal" }, image: "/materiaux/marbre/marbre-rose-portugal.webp" },
  { type: "marbre", id: "marbre-rouge-alicante", name: { fr: "Rouge Alicante", en: "Alicante Red" }, image: "/materiaux/marbre/marbre-rouge-alicante.webp" },
  { type: "marbre", id: "marbre-serpagenti", name: { fr: "Serpagenti", en: "Serpagenti" }, image: "/materiaux/marbre/marbre-serpagenti.webp" },
  { type: "marbre", id: "marbre-statuaire", name: { fr: "Statuaire", en: "Statuario" }, image: "/materiaux/marbre/marbre-statuaire.webp" },
  { type: "marbre", id: "marbre-thasos", name: { fr: "Thasos", en: "Thasos" }, image: "/materiaux/marbre/marbre-thasos.webp" },
  { type: "marbre", id: "marbre-thela-beige", name: { fr: "Thela Beige", en: "Beige Thela" }, image: "/materiaux/marbre/marbre-thela-beige.webp" },
  { type: "marbre", id: "marbre-thela-gris", name: { fr: "Thela Gris", en: "Grey Thela" }, image: "/materiaux/marbre/marbre-thela-gris.webp" },
  { type: "marbre", id: "marbre-vert-guatemala", name: { fr: "Vert Guatemala", en: "Guatemala Green" }, image: "/materiaux/marbre/marbre-vert-guatemala.webp" },
  { type: "marbre", id: "marbre-zebrino", name: { fr: "Zebrino", en: "Zebrino" }, image: "/materiaux/marbre/marbre-zebrino.webp" },
  { type: "granit", id: "granit-baltic-brown", name: { fr: "Baltic Brown", en: "Baltic Brown" }, image: "/materiaux/granit/granit-baltic-brown.webp" },
  { type: "granit", id: "granit-black-cosmic", name: { fr: "Black Cosmic", en: "Black Cosmic" }, image: "/materiaux/granit/granit-black-cosmic.webp" },
  { type: "granit", id: "granit-black-galaxy", name: { fr: "Black Galaxy", en: "Black Galaxy" }, image: "/materiaux/granit/granit-black-galaxy.webp" },
  { type: "granit", id: "granit-gris-perla", name: { fr: "Gris Perla", en: "Perla Grey" }, image: "/materiaux/granit/granit-gris-perla.webp" },
  { type: "granit", id: "granit-jaune-topaze", name: { fr: "Jaune Topaze", en: "Topaz Yellow" }, image: "/materiaux/granit/granit-jaune-topaze.webp" },
  { type: "granit", id: "granit-labrador-bleu", name: { fr: "Labrador Bleu", en: "Blue Labrador" }, image: "/materiaux/granit/granit-labrador-bleu.webp" },
  { type: "granit", id: "granit-labrador-bleu-1", name: { fr: "Labrador Bleu 1", en: "Blue Labrador 1" }, image: "/materiaux/granit/granit-labrador-bleu-1.webp" },
  { type: "granit", id: "granit-labrador-noir", name: { fr: "Labrador Noir", en: "Black Labrador" }, image: "/materiaux/granit/granit-labrador-noir.webp" },
  { type: "granit", id: "granit-labrador-noir-2", name: { fr: "Labrador Noir 2", en: "Black Labrador 2" }, image: "/materiaux/granit/granit-labrador-noir-2.webp" },
  { type: "granit", id: "granit-noir-absolu", name: { fr: "Noir Absolu", en: "Absolute Black" }, image: "/materiaux/granit/granit-noir-absolu.webp" },
  { type: "granit", id: "granit-orissa-bleu", name: { fr: "Orissa Bleu", en: "Blue Orissa" }, image: "/materiaux/granit/granit-orissa-bleu.webp" },
  { type: "granit", id: "granit-rosa-porrino", name: { fr: "Rosa Porrino", en: "Rosa Porrino" }, image: "/materiaux/granit/granit-rosa-porrino.webp" },
  { type: "travertin", id: "travertin-navona", name: { fr: "Travertin Navona", en: "Navona Travertine" }, image: "/materiaux/travertin/travertin-navona.webp" },
  { type: "travertin", id: "travertin-navona-2", name: { fr: "Travertin Navona 2", en: "Navona Travertine 2" }, image: "/materiaux/travertin/travertin-navona-2.webp" },
  { type: "travertin", id: "travertin-navona-resine-transparente", name: { fr: "Travertin Navona Résine Transparente", en: "Navona Travertine Transparent Resin" }, image: "/materiaux/travertin/travertin-navona-resine-transparente.webp" },
  { type: "travertin", id: "travertin-noce", name: { fr: "Travertin Noce", en: "Walnut Travertine" }, image: "/materiaux/travertin/travertin-noce.webp" },
  { type: "travertin", id: "travertin-romain-classique-ciment", name: { fr: "Travertin Romain Classique Ciment", en: "Classic Roman Travertine Cement" }, image: "/materiaux/travertin/travertin-romain-classique-ciment.webp" },
  { type: "travertin", id: "travertin-romain-classique-resine-transparente", name: { fr: "Travertin Romain Classique Résine Transparente", en: "Classic Roman Travertine Transparent Resin" }, image: "/materiaux/travertin/travertin-romain-classique-resine-transparente.webp" },
  { type: "patagonia", id: "patagonia", name: { fr: "Patagonia", en: "Patagonia" }, image: "/materiaux/patagonia/patagonia.webp" },
  { type: "onyx", id: "onyx-blanc", name: { fr: "Onyx Blanc", en: "White Onyx" }, image: "/materiaux/onyx/onyx-blanc.webp" },
  { type: "onyx", id: "onyx-bleu", name: { fr: "Onyx Bleu", en: "Blue Onyx" }, image: "/materiaux/onyx/onyx-bleu.webp" },
  { type: "onyx", id: "onyx-fantastique", name: { fr: "Onyx Fantastique", en: "Fantastic Onyx" }, image: "/materiaux/onyx/onyx-fantastique.webp" },
  { type: "onyx", id: "onyx-miel", name: { fr: "Onyx Miel", en: "Honey Onyx" }, image: "/materiaux/onyx/onyx-miel.webp" },
  { type: "onyx", id: "onyx-rose", name: { fr: "Onyx Rose", en: "Pink Onyx" }, image: "/materiaux/onyx/onyx-rose.webp" },
  { type: "onyx", id: "onyx-vert-pakistan", name: { fr: "Onyx Vert Pakistan", en: "Pakistani Green Onyx" }, image: "/materiaux/onyx/onyx-vert-pakistan.webp" },
  { type: "onyx", id: "onyx-vert-perse", name: { fr: "Onyx Vert Perse", en: "Persian Green Onyx" }, image: "/materiaux/onyx/onyx-vert-perse.webp" },
];

export function getProductSubtypes(type: ProductTypeValue): ProductSubtype[] {
  return productSubtypes.filter((subtype) => subtype.type === type);
}
