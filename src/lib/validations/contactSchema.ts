import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }),
  email: z.string().trim().email({ message: "emailInvalid" }),
  message: z.string().trim().min(1, { message: "messageRequired" }),
  honeypot: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFormInput = z.input<typeof contactFormSchema>;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_FILE_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export type ContactFileValidationError = "fileTooLarge" | "fileTypeInvalid";

export function validateContactFile(
  file: File | null | undefined,
): { ok: true } | { ok: false; message: ContactFileValidationError } {
  if (!file || file.size === 0) {
    return { ok: true };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, message: "fileTooLarge" };
  }
  if (
    !ACCEPTED_FILE_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_FILE_MIME_TYPES)[number],
    )
  ) {
    return { ok: false, message: "fileTypeInvalid" };
  }
  return { ok: true };
}

export function parseContactFormData(formData: FormData): ContactFormInput {
  const honeypot = formData.get("website");

  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    honeypot: honeypot != null ? String(honeypot) : undefined,
  };
}
