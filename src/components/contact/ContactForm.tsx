"use client";

import { useCallback, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import GhostButton from "@/components/common/GhostButton";
import { siteConfig, getWhatsAppUrl } from "@/data/siteConfig";
import {
  contactFormSchema,
  validateContactFile,
  type ContactFormValues,
  type ContactFormInput,
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/validations/contactSchema";
import {
  submitContactMessageFromClient,
  type SubmitContactState,
} from "@/app/actions/submitContactMessage";

type ContactFormProps = {
  locale: string;
};

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileErrorKey, setFileErrorKey] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitContactState>({
    status: "idle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });

  const validationMessage = useCallback(
    (key: string | undefined) => (key ? t(`validation.${key}`) : undefined),
    [t],
  );

  const clearFile = () => {
    setSelectedFile(null);
    setFileErrorKey(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      clearFile();
      return;
    }
    const result = validateContactFile(file);
    if (!result.ok) {
      setFileErrorKey(result.message);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    setFileErrorKey(null);
    setSelectedFile(file);
  };

  const onSubmit = async (values: ContactFormValues) => {
    if (values.honeypot?.trim()) {
      setSubmitState({ status: "success" });
      return;
    }

    const fileCheck = validateContactFile(selectedFile);
    if (!fileCheck.ok) {
      setFileErrorKey(fileCheck.message);
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ status: "idle" });

    const formData = new FormData();
    formData.set("locale", locale);
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("message", values.message);
    formData.set("website", values.honeypot ?? "");
    if (selectedFile) {
      formData.set("fichier", selectedFile);
    }

    try {
      const result = await submitContactMessageFromClient(formData);
      setSubmitState(result);
      if (result.status === "success") {
        reset();
        clearFile();
      }
    } catch {
      setSubmitState({ status: "error", code: "email" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const retry = () => {
    setSubmitState({ status: "idle" });
  };

  if (submitState.status === "success") {
    return (
      <div
        className="rounded-2xl border border-brand-orange/20 bg-white p-8 text-center shadow-sm md:p-12"
        role="status"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/15">
          <svg
            className="h-8 w-8 text-brand-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark md:text-3xl">
          {t("success.title")}
        </h2>
        <p className="mt-4 text-lg text-text-muted">{t("success.message")}</p>
        <p className="mt-2 text-base text-text-muted">{t("success.confirmationNote")}</p>
      </div>
    );
  }

  const showError = submitState.status === "error";
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-10">
      <header className="mb-8">
        <h2 className="font-display text-2xl font-bold text-brand-dark md:text-3xl">
          {t("formTitle")}
        </h2>
        <p className="mt-2 text-sm text-text-muted md:text-base">
          {t("formSubtitle")}
        </p>
      </header>

      {showError && (
        <div
          className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-left"
          role="alert"
        >
          <p className="font-semibold text-red-800">{t("error.title")}</p>
          <p className="mt-1 text-sm text-red-700">
            {submitState.code === "file" && submitState.fileError
              ? t(`validation.${submitState.fileError}`)
              : t(`error.codes.${submitState.code}`)}
          </p>
          <div className="mt-4">
            <GhostButton
              type="button"
              variant="black"
              size="sm"
              onClick={retry}
            >
              {t("error.retry")}
            </GhostButton>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            {t("error.fallback")}{" "}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="font-semibold text-brand-orange hover:underline"
            >
              {siteConfig.phone}
            </a>
            {" · "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-orange hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Anti-spam honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("honeypotLabel")}</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </div>

        {/* Name */}
        <Field
          label={t("fields.name")}
          required
          error={validationMessage(errors.name?.message)}
        >
          <input
            type="text"
            autoComplete="name"
            placeholder={t("placeholders.name")}
            className={inputClass(!!errors.name)}
            {...register("name")}
          />
        </Field>

        {/* Email */}
        <Field
          label={t("fields.email")}
          required
          error={validationMessage(errors.email?.message)}
        >
          <input
            type="email"
            autoComplete="email"
            placeholder={t("placeholders.email")}
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </Field>

        {/* Message */}
        <Field
          label={t("fields.message")}
          required
          error={validationMessage(errors.message?.message)}
        >
          <textarea
            rows={5}
            placeholder={t("placeholders.message")}
            className={inputClass(!!errors.message)}
            {...register("message")}
          />
        </Field>

        {/* File Attachment */}
        <Field
          label={t("fields.file")}
          hint={t("fields.fileHint")}
          error={fileErrorKey ? t(`validation.${fileErrorKey}`) : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
            onChange={onFileChange}
            className="block w-full text-sm text-brand-dark file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-dark hover:file:bg-brand-orange/25"
          />
          {selectedFile && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-brand-light px-4 py-2">
              <span className="truncate text-sm text-brand-dark">{selectedFile.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 text-sm font-semibold text-brand-orange hover:underline"
              >
                {t("fileRemove")}
              </button>
            </div>
          )}
        </Field>

        <GhostButton
          type="submit"
          variant="black"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full md:w-auto md:min-w-[200px]"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </GhostButton>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full rounded-lg border bg-white px-4 py-3 text-brand-dark outline-none transition",
    "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20",
    hasError ? "border-red-400" : "border-brand-dark/15",
  ].join(" ");
}

function Field({
  label,
  required = false,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-brand-dark">
        {label}
        {required && (
          <span className="ml-1 text-brand-orange" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && <p className="mb-2 text-xs text-text-muted">{hint}</p>}
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
