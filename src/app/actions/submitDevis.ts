"use server";

import { put } from "@vercel/blob";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/siteConfig";
import { FINISH_VALUES, type FinishValue } from "@/data/finishes";
import { PRODUCT_TYPE_VALUES } from "@/data/productTypes";
import type { ProductTypeValue } from "@/data/productTypes";
import { productSubtypes } from "@/data/productSubtypes";
import {
  buildConfirmationDevisEmailHtml,
  buildUsineDevisEmailHtml,
} from "@/lib/email/templates";
import {
  devisFormSchema,
  parseDevisFormData,
  validateDevisFile,
} from "@/lib/validations/devisSchema";
import {
  appendSheetRow,
  isSheetsConfigured,
} from "@/lib/sheets/appendSubmission";
import {
  getFromAddress,
  getOwnerEmail,
  isTestSender,
} from "@/lib/email/config";

export type SubmitDevisState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "file" | "upload" | "email" | "config";
      fileError?: "fileTooLarge" | "fileTypeInvalid";
    };

export async function submitDevis(
  _prevState: SubmitDevisState,
  formData: FormData,
): Promise<SubmitDevisState> {
  const localeRaw = formData.get("locale");
  const locale = localeRaw === "en" ? "en" : "fr";

  const raw = parseDevisFormData(formData);

  if (raw.honeypot && raw.honeypot.trim().length > 0) {
    return { status: "success" };
  }

  const parsed = devisFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", code: "validation" };
  }

  const data = parsed.data;

  const fileEntry = formData.get("fichier");
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  const fileValidation = await validateDevisFile(file);
  if (!fileValidation.ok) {
    return { status: "error", code: "file", fileError: fileValidation.message };
  }

  // Delivery needs at least one working channel: Resend email, or the
  // Google Sheet saved copy. Without either, the lead would be lost.
  const hasEmail = Boolean(process.env.RESEND_API_KEY);
  const hasSheet = isSheetsConfigured();
  if (!hasEmail && !hasSheet) {
    return { status: "error", code: "config" };
  }

  let fileUrl: string | null = null;

  if (file) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { status: "error", code: "config" };
    }

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`devis/${Date.now()}-${safeName}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      fileUrl = blob.url;
    } catch {
      return { status: "error", code: "upload" };
    }
  }

  const tUsine = await getTranslations({ locale: "fr", namespace: "devis.emailUsine" });
  const tConfirm = await getTranslations({ locale, namespace: "devis.emailConfirm" });

  const productTypes = Object.fromEntries(
    PRODUCT_TYPE_VALUES.map((key) => [key, tUsine(`productTypes.${key}`)]),
  ) as Record<ProductTypeValue, string>;
  const finishLabels = Object.fromEntries(
    FINISH_VALUES.map((value) => [value, tUsine(`finishOptions.${value}`)]),
  ) as Record<FinishValue, string>;
  const confirmFinishLabels = Object.fromEntries(
    FINISH_VALUES.map((value) => [value, tConfirm(`finishOptions.${value}`)]),
  ) as Record<FinishValue, string>;
  const productSubtypeLabels = data.products.map((product) => {
    if (!product.variete) return "";
    const subtype = productSubtypes.find(
      (item) => item.type === product.type && item.id === product.variete,
    );
    return subtype?.name[locale] ?? product.variete;
  });

  const usineHtml = buildUsineDevisEmailHtml(
    data,
    {
      heading: tUsine("heading"),
      productHeading: tUsine("productHeading"),
      nom: tUsine("nom"),
      prenom: tUsine("prenom"),
      email: tUsine("email"),
      telephone: tUsine("telephone"),
      telephoneCountry: tUsine("telephoneCountry"),
      productType: tUsine("productType"),
      productSubtype: tUsine("productSubtype"),
      finition: tUsine("finition"),
      finitionAutre: tUsine("finitionAutre"),
      finishOptions: finishLabels,
      dimensions: tUsine("dimensions"),
      quantite: tUsine("quantite"),
      commentaire: tUsine("commentaire"),
      fileLink: tUsine("fileLink"),
      noFile: tUsine("noFile"),
      productTypes,
      productSubtypeLabels,
    },
    fileUrl,
  );

  const confirmHtml = buildConfirmationDevisEmailHtml({
    data,
    subject: tConfirm("subject"),
    greeting: tConfirm("greeting", { name: data.prenom }),
    body: tConfirm("body"),
    fallbackLabel: tConfirm("fallback"),
    whatsappLabel: tConfirm("whatsapp"),
    fields: {
      telephoneCountry: tConfirm("telephoneCountry"),
      telephone: tConfirm("telephone"),
      productType: tConfirm("productType"),
      productSubtype: tConfirm("productSubtype"),
      finition: tConfirm("finition"),
      finitionAutre: tConfirm("finitionAutre"),
      dimensions: tConfirm("dimensions"),
      quantite: tConfirm("quantite"),
      commentaire: tConfirm("commentaire"),
      noComment: tConfirm("noComment"),
      productHeading: tConfirm("productHeading"),
      productTypes: Object.fromEntries(
        PRODUCT_TYPE_VALUES.map((key) => [key, tConfirm(`productTypes.${key}`)]),
      ) as Record<ProductTypeValue, string>,
      productSubtypeLabels,
      finishOptions: confirmFinishLabels,
    },
  });

  const ownerEmail = getOwnerEmail();
  const fromAddress = getFromAddress();
  let ownerEmailOk = false;
  let emailStatus = hasEmail ? "email_failed" : "email_not_configured";

  if (hasEmail) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      // In test mode (onboarding@resend.dev) Resend only delivers to
      // the account owner's address, so the customer confirmation is
      // skipped instead of failing the whole submission.
      const sends: Promise<unknown>[] = [
        resend.emails.send({
          from: fromAddress,
          to: ownerEmail,
          replyTo: data.email,
          subject: tUsine("subject", {
            name: `${data.prenom} ${data.nom}`,
          }),
          html: usineHtml,
        }),
      ];
      if (!isTestSender()) {
        sends.push(
          resend.emails.send({
            from: fromAddress,
            to: data.email,
            subject: tConfirm("subject"),
            html: confirmHtml,
          }),
        );
      }
      const results = await Promise.allSettled(sends);
      const ownerResult = results[0];
      ownerEmailOk =
        ownerResult.status === "fulfilled" &&
        !(ownerResult.value as { error?: unknown }).error;
      const confirmOk =
        isTestSender() ||
        (results[1]?.status === "fulfilled" &&
          !(results[1].value as { error?: unknown }).error);
      emailStatus = ownerEmailOk
        ? confirmOk
          ? "email_sent"
          : "email_sent_owner_only"
        : "email_failed";
      if (!ownerEmailOk) {
        console.error("[email] devis owner email failed");
      }
    } catch (error) {
      console.error(
        "[email] devis send failed:",
        error instanceof Error ? error.message : "unknown error",
      );
    }
  }

  // Saved copy: one JSON object per product, with every field the
  // visitor entered together in the Produits column, without
  // duplicated label fields: type, variety, dimensions in cm,
  // quantity in m², and finish.
  const sheetProducts = data.products.map((product) => ({
    type: product.type,
    variete: product.variete ?? "",
    longueur_cm: product.longueur,
    largeur_cm: product.largeur,
    epaisseur_cm: product.epaisseur,
    dimensions: product.dimensions,
    quantite_m2: product.quantite,
    finition: product.finition,
    ...(product.otherFinitionText
      ? { finition_autre: product.otherFinitionText }
      : {}),
  }));

  // Saved copy: appended after sending so the row records the real
  // email outcome. A submission counts as received if the sheet saved
  // OR the owner email was delivered; it only errors if both failed.
  const sheetSaved = await appendSheetRow("devis", [
    new Date().toISOString(),
    "devis",
    data.prenom,
    data.nom,
    data.email,
    data.telephone,
    data.telephoneCountryName,
    JSON.stringify(sheetProducts),
    data.commentaire ?? "",
    fileUrl ?? "",
    emailStatus,
  ]);

  if (!sheetSaved && !ownerEmailOk) {
    return { status: "error", code: hasEmail ? "email" : "config" };
  }

  return { status: "success" };
}

export async function submitDevisFromClient(formData: FormData): Promise<SubmitDevisState> {
  return submitDevis({ status: "idle" }, formData);
}
