import { siteConfig, getWhatsAppUrl } from "@/data/siteConfig";
import type { DevisFormValues } from "@/lib/validations/devisSchema";
import type { ContactFormValues } from "@/lib/validations/contactSchema";
import type { ProductTypeValue } from "@/data/productTypes";
import type { FinishValue } from "@/data/finishes";

type ProductEmailLabels = {
  productHeading: string;
  productType: string;
  productTypes: Record<ProductTypeValue, string>;
  productSubtype: string;
  productSubtypeLabels: string[];
  finition: string;
  finitionAutre: string;
  finishOptions: Record<FinishValue, string>;
  dimensions: string;
  quantite: string;
};

type UsineEmailLabels = ProductEmailLabels & {
  heading: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  telephoneCountry: string;
  commentaire: string;
  fileLink: string;
  noFile: string;
};

type UsineContactEmailLabels = {
  heading: string;
  name: string;
  email: string;
  message: string;
  fileLink: string;
  noFile: string;
};

type DevisConfirmationEmailCopy = {
  data: DevisFormValues;
  subject: string;
  greeting: string;
  body: string;
  fallbackLabel: string;
  whatsappLabel: string;
  fields: {
    telephoneCountry: string;
    telephone: string;
    commentaire: string;
    noComment: string;
  } & ProductEmailLabels;
};

type ConfirmationEmailCopy = {
  subject: string;
  greeting: string;
  body: string;
  fallbackLabel: string;
  whatsappLabel: string;
};

export function buildUsineDevisEmailHtml(
  data: DevisFormValues,
  labels: UsineEmailLabels,
  fileUrl: string | null,
): string {
  const productSections = renderDevisProducts(data.products, labels, 8);

  const fileSection = fileUrl
    ? `<p style="margin:8px 0 0;"><strong>${labels.fileLink}</strong> <a href="${fileUrl}" style="color:#ef5d36;">${fileUrl}</a></p>`
    : `<p style="margin:8px 0 0;color:#6b7280;">${labels.noFile}</p>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Georgia,serif;background:#f8f9fa;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 24px;font-size:22px;color:#ef5d36;">${labels.heading}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
      <tr><td style="padding:8px 0;font-weight:bold;width:140px;">${labels.nom}</td><td>${escapeHtml(data.nom)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.prenom}</td><td>${escapeHtml(data.prenom)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.email}</td><td><a href="mailto:${escapeHtml(data.email)}" style="color:#ef5d36;">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.telephoneCountry}</td><td>${escapeHtml(data.telephoneCountryName)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.telephone}</td><td>${escapeHtml(data.telephone)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.commentaire}</td><td>${escapeHtml(data.commentaire || "—").replace(/\n/g, "<br>")}</td></tr>
    </table>
    ${productSections}
    ${fileSection}
    <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(siteConfig.name)}<br>${escapeHtml(siteConfig.address)}</p>
  </div>
</body>
</html>`;
}

export function buildConfirmationDevisEmailHtml(copy: DevisConfirmationEmailCopy): string {
  const whatsappUrl = getWhatsAppUrl();
  const productSections = renderDevisProducts(copy.data.products, copy.fields, 6);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Georgia,serif;background:#f8f9fa;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 16px;font-size:22px;color:#ef5d36;">${escapeHtml(copy.subject)}</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(copy.greeting)}</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${escapeHtml(copy.body)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;margin:0 0 24px;">
      <tr><td style="padding:6px 0;font-weight:bold;">${escapeHtml(copy.fields.telephoneCountry)}</td><td>${escapeHtml(copy.data.telephoneCountryName)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">${escapeHtml(copy.fields.telephone)}</td><td>${escapeHtml(copy.data.telephone)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">${escapeHtml(copy.fields.commentaire)}</td><td>${escapeHtml(copy.data.commentaire || copy.fields.noComment).replace(/\n/g, "<br>")}</td></tr>
    </table>
    ${productSections}
    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">${escapeHtml(copy.fallbackLabel)}</p>
    <p style="margin:8px 0 0;font-size:15px;">
      <strong>${escapeHtml(siteConfig.phone)}</strong><br>
      <a href="${whatsappUrl}" style="color:#ef5d36;">${escapeHtml(copy.whatsappLabel)}</a>
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(siteConfig.name)}<br>${escapeHtml(siteConfig.address)}</p>
  </div>
</body>
</html>`;
}

function renderDevisProducts(
  products: DevisFormValues["products"],
  labels: ProductEmailLabels,
  cellPadding: number,
): string {
  return products.map((product, index) => {
    const productLabel = labels.productTypes[product.type] ?? product.type;
    const finishOtherRow = product.finition === "autre" && product.otherFinitionText
      ? `<tr><td style="padding:${cellPadding}px 0;font-weight:bold;">${escapeHtml(labels.finitionAutre)}</td><td>${escapeHtml(product.otherFinitionText)}</td></tr>`
      : "";

    return `<section style="margin:16px 0 0;padding:16px;border:1px solid #e5e7eb;border-radius:8px;">
      <h2 style="margin:0 0 8px;font-size:16px;color:#1a1a1a;">${escapeHtml(labels.productHeading)} ${index + 1}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
        <tr><td style="padding:${cellPadding}px 0;font-weight:bold;width:140px;">${escapeHtml(labels.productType)}</td><td>${escapeHtml(productLabel)}</td></tr>
        <tr><td style="padding:${cellPadding}px 0;font-weight:bold;">${escapeHtml(labels.productSubtype)}</td><td>${escapeHtml(labels.productSubtypeLabels[index] || "—")}</td></tr>
        <tr><td style="padding:${cellPadding}px 0;font-weight:bold;">${escapeHtml(labels.finition)}</td><td>${escapeHtml(labels.finishOptions[product.finition])}</td></tr>
        ${finishOtherRow}
        <tr><td style="padding:${cellPadding}px 0;font-weight:bold;">${escapeHtml(labels.dimensions)}</td><td>${escapeHtml(product.dimensions)}</td></tr>
        <tr><td style="padding:${cellPadding}px 0;font-weight:bold;">${escapeHtml(labels.quantite)}</td><td>${escapeHtml(String(product.quantite))}</td></tr>
      </table>
    </section>`;
  }).join("");
}

export function buildUsineContactMessageEmailHtml(
  data: ContactFormValues,
  labels: UsineContactEmailLabels,
  fileUrl: string | null,
): string {
  const fileSection = fileUrl
    ? `<p style="margin:8px 0 0;"><strong>${labels.fileLink}</strong> <a href="${fileUrl}" style="color:#ef5d36;">${fileUrl}</a></p>`
    : `<p style="margin:8px 0 0;color:#6b7280;">${labels.noFile}</p>`;

  const formattedMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Georgia,serif;background:#f8f9fa;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 24px;font-size:22px;color:#ef5d36;">${labels.heading}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
      <tr><td style="padding:8px 0;font-weight:bold;width:120px;">${labels.name}</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">${labels.email}</td><td><a href="mailto:${escapeHtml(data.email)}" style="color:#ef5d36;">${escapeHtml(data.email)}</a></td></tr>
    </table>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-weight:bold;font-size:15px;">${labels.message} :</p>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:15px;line-height:1.6;color:#374151;">${formattedMessage}</div>
    </div>
    <div style="margin-top:16px;">
      ${fileSection}
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(siteConfig.name)}<br>${escapeHtml(siteConfig.address)}</p>
  </div>
</body>
</html>`;
}

export function buildConfirmationContactMessageEmailHtml(
  copy: ConfirmationEmailCopy,
): string {
  const whatsappUrl = getWhatsAppUrl();

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Georgia,serif;background:#f8f9fa;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 16px;font-size:22px;color:#ef5d36;">${escapeHtml(copy.subject)}</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(copy.greeting)}</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${escapeHtml(copy.body)}</p>
    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">${escapeHtml(copy.fallbackLabel)}</p>
    <p style="margin:8px 0 0;font-size:15px;">
      <strong>${escapeHtml(siteConfig.phone)}</strong><br>
      <a href="${whatsappUrl}" style="color:#ef5d36;">${escapeHtml(copy.whatsappLabel)}</a>
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(siteConfig.name)}<br>${escapeHtml(siteConfig.address)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type {
  UsineEmailLabels,
  UsineContactEmailLabels,
  ConfirmationEmailCopy,
};
