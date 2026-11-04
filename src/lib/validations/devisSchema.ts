import { isValidNumber, parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import { PRODUCT_TYPE_VALUES } from "@/data/productTypes";
import { productSubtypes } from "@/data/productSubtypes";
import { FINISH_VALUES } from "@/data/finishes";

export const productTypeSchema = z.enum(PRODUCT_TYPE_VALUES, {
  message: "productTypeRequired",
});
export const finishSchema = z.enum(FINISH_VALUES, {
  message: "finishRequired",
});

function toE164(value: string): string {
  return parsePhoneNumberFromString(value)?.number ?? value.replace(/\s/g, "");
}

const centimeterMeasurement = z
  .string()
  .trim()
  .min(1, { message: "dimensionsRequired" })
  .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
    message: "dimensionInvalid",
  });

export const devisProductSchema = z
  .object({
    type: z.string().optional().pipe(productTypeSchema),
    catalogProductId: z.string().max(120).optional(),
    variete: z.string().trim().max(120).optional(),
    finition: z.string().optional().pipe(finishSchema),
    otherFinitionText: z.string().trim().max(160, { message: "finishOtherTooLong" }).optional(),
    longueur: centimeterMeasurement,
    largeur: centimeterMeasurement,
    epaisseur: centimeterMeasurement,
    quantite: z.coerce.number().positive({ message: "quantityInvalid" }),
  })
  .superRefine((product, ctx) => {
    if (!product.variete) return;
    const valid = productSubtypes.some(
      (subtype) => subtype.type === product.type && subtype.id === product.variete,
    );
    if (!valid) {
      ctx.addIssue({
        code: "custom",
        path: ["variete"],
        message: "productSubtypeInvalid",
      });
    }
  })
  .transform((product) => ({
    type: product.type,
    variete: product.variete,
    finition: product.finition,
    otherFinitionText: product.otherFinitionText,
    longueur: product.longueur,
    largeur: product.largeur,
    epaisseur: product.epaisseur,
    quantite: product.quantite,
    dimensions: `${product.longueur} × ${product.largeur} × ${product.epaisseur} cm`,
  }));

export const devisFormSchema = z
  .object({
    nom: z.string().trim().min(1, { message: "nomRequired" }),
    prenom: z.string().trim().min(1, { message: "prenomRequired" }),
    email: z.string().trim().email({ message: "emailInvalid" }),
    telephone: z
      .string()
      .trim()
      .min(1, { message: "telephoneRequired" })
      .refine((val) => isValidNumber(toE164(val)), {
        message: "telephoneInvalid",
      })
      .transform(toE164),
    telephoneCountry: z.string().trim().min(2, { message: "telephoneCountryRequired" }),
    telephoneCountryName: z.string().trim().min(1, { message: "telephoneCountryRequired" }),
    products: z.array(devisProductSchema).min(1, { message: "productsRequired" }).max(3, { message: "productsLimit" }),
    commentaire: z.string().trim().max(1000, { message: "commentTooLong" }).optional(),
    honeypot: z.string().optional(),
  });

export type DevisFormValues = z.infer<typeof devisFormSchema>;
export type DevisFormInput = z.input<typeof devisFormSchema>;

export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;
export const ACCEPTED_FILE_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
export const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".dxf"];

export type DevisFileValidationError = "fileTooLarge" | "fileTypeInvalid";

export async function validateDevisFile(
  file: File | null | undefined,
): Promise<{ ok: true } | { ok: false; message: DevisFileValidationError }> {
  if (!file || file.size === 0) return { ok: true };
  if (file.size > MAX_FILE_SIZE_BYTES) return { ok: false, message: "fileTooLarge" };

  const isDxf = file.name.toLowerCase().endsWith(".dxf");
  if (isDxf) {
    try {
      const sample = (await file.slice(0, 8192).text()).trimStart();
      const hasDxfHeader = /^(0|section|999)\b/i.test(sample);
      const hasDxfSection = /\b(section|header|entities|eof)\b/i.test(sample);
      return hasDxfHeader && hasDxfSection
        ? { ok: true }
        : { ok: false, message: "fileTypeInvalid" };
    } catch {
      return { ok: false, message: "fileTypeInvalid" };
    }
  }

  if (!ACCEPTED_FILE_MIME_TYPES.includes(file.type as (typeof ACCEPTED_FILE_MIME_TYPES)[number])) {
    return { ok: false, message: "fileTypeInvalid" };
  }
  return { ok: true };
}

export function parseDevisFormData(formData: FormData): DevisFormInput {
  const honeypot = formData.get("website");
  let submittedProducts: unknown = [];
  try {
    submittedProducts = JSON.parse(String(formData.get("products") ?? "[]"));
  } catch {
    submittedProducts = [];
  }

  return {
    nom: String(formData.get("nom") ?? ""),
    prenom: String(formData.get("prenom") ?? ""),
    email: String(formData.get("email") ?? ""),
    telephone: String(formData.get("telephone") ?? ""),
    telephoneCountry: String(formData.get("telephoneCountry") ?? ""),
    telephoneCountryName: String(formData.get("telephoneCountryName") ?? ""),
    products: submittedProducts as DevisFormInput["products"],
    commentaire: String(formData.get("commentaire") ?? "") || undefined,
    honeypot: honeypot != null ? String(honeypot) : undefined,
  };
}
