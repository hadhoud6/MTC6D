"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { defaultCountries, type CountryIso2 } from "react-international-phone";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import GhostButton from "@/components/common/GhostButton";
import InternationalPhoneField, { type PhoneCountryValue } from "@/components/devis/InternationalPhoneField";
import ProductSubtypePicker from "@/components/devis/ProductSubtypePicker";
import {
  createEmptyQuoteProduct,
  OPEN_CATALOGUE_SESSION_KEY,
  useQuoteBasket,
  type QuoteProductDraft,
} from "@/components/devis/QuoteBasketContext";
import { FINISH_OPTIONS, FINISH_VALUES, type FinishValue } from "@/data/finishes";
import { PRODUCT_TYPES, type ProductTypeValue } from "@/data/productTypes";
import { products as catalogProducts } from "@/data/products";
import { siteConfig, getWhatsAppUrl } from "@/data/siteConfig";
import { localized, type Locale } from "@/types/content";
import {
  devisFormSchema,
  validateDevisFile,
  type DevisFormValues,
  type DevisFormInput,
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/validations/devisSchema";
import { submitDevisFromClient, type SubmitDevisState } from "@/app/actions/submitDevis";

type DevisFormProps = { locale: string; initialCountry?: string };

const defaultCountry = (locale: Locale, initialCountry = "tn"): PhoneCountryValue => ({
  iso2: initialCountry as CountryIso2,
  name:
    new Intl.DisplayNames([locale], { type: "region" }).of(initialCountry.toUpperCase()) ??
    initialCountry.toUpperCase(),
});

const emptyProduct = createEmptyQuoteProduct;

export default function DevisForm({ locale, initialCountry }: DevisFormProps) {
  const t = useTranslations("devis");
  const currentLocale = useLocale() as Locale;
  const {
    ready: basketReady,
    products: savedProducts,
    contactDraft,
    updateQuoteProducts,
    updateContactDraft,
    clearQuote,
  } = useQuoteBasket();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);
  const phoneInteractionRef = useRef(false);
  const didHydrateDraftRef = useRef(false);
  const skipDraftSyncRef = useRef(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileErrorKey, setFileErrorKey] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitDevisState>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDraftReady, setFormDraftReady] = useState(false);
  const visitorCountry = initialCountry?.toLowerCase() || "tn";
  const initialPhoneCountry = defaultCountry(currentLocale, visitorCountry);
  const initialDialCode = defaultCountries.find((country) => country[1] === visitorCountry)?.[2] ?? "216";
  const initialPhone = `+${initialDialCode}`;
  const [phone, setPhone] = useState(initialPhone);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountryValue>(initialPhoneCountry);
  const [activeIndex, setActiveIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DevisFormInput, unknown, DevisFormValues>({
    resolver: zodResolver(devisFormSchema),
    shouldUnregister: false,
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: initialPhone,
      telephoneCountry: visitorCountry,
      telephoneCountryName: initialPhoneCountry.name,
      products: [emptyProduct()],
      commentaire: "",
      honeypot: "",
    },
  });

  const { fields: productFields, append, remove } = useFieldArray({ control, name: "products" });
  const products = watch("products") ?? [];
  const activeProduct = products[activeIndex] ?? emptyProduct();
  const selectedType = activeProduct.type as ProductTypeValue | undefined;
  const selectedSubtype = activeProduct.variete;
  const selectedFinishValue = activeProduct.finition as FinishValue | undefined;
  const selectedFinish = FINISH_OPTIONS.find((option) => option.value === selectedFinishValue);
  const comment = watch("commentaire") ?? "";
  const activeProductErrors = errors.products?.[activeIndex];

  useEffect(() => {
    if (!basketReady || didHydrateDraftRef.current) return;

    const savedCountryIso = contactDraft?.telephoneCountry?.toLowerCase();
    const hasSavedCountry = savedCountryIso
      ? defaultCountries.some((entry) => entry[1] === savedCountryIso)
      : false;
    const restoredPhoneCountry = hasSavedCountry
      ? defaultCountry(currentLocale, savedCountryIso)
      : initialPhoneCountry;
    const restoredPhone = contactDraft?.telephone || initialPhone;
    const restoredProducts = savedProducts.length > 0 ? savedProducts : [emptyProduct()];

    skipDraftSyncRef.current = true;
    didHydrateDraftRef.current = true;
    phoneInteractionRef.current = Boolean(contactDraft?.telephoneCountry);
    setPhone(restoredPhone);
    setPhoneCountry(restoredPhoneCountry);
    setActiveIndex(0);
    reset({
      nom: "",
      prenom: "",
      email: "",
      products: restoredProducts,
      commentaire: "",
      honeypot: "",
      ...contactDraft,
      telephone: restoredPhone,
      telephoneCountry: restoredPhoneCountry.iso2,
      telephoneCountryName: restoredPhoneCountry.name,
    });
    setFormDraftReady(true);
    queueMicrotask(() => {
      skipDraftSyncRef.current = false;
    });
  }, [basketReady, contactDraft, currentLocale, initialPhone, initialPhoneCountry, reset, savedProducts]);

  useEffect(() => {
    if (!basketReady) return;
    const subscription = watch((values) => {
      if (!didHydrateDraftRef.current || skipDraftSyncRef.current || submitState.status === "success") {
        return;
      }

      updateQuoteProducts((values.products ?? []) as QuoteProductDraft[]);
      updateContactDraft({
        nom: values.nom ?? "",
        prenom: values.prenom ?? "",
        email: values.email ?? "",
        telephone: values.telephone ?? "",
        telephoneCountry: values.telephoneCountry ?? "",
        telephoneCountryName: values.telephoneCountryName ?? "",
        commentaire: values.commentaire ?? "",
        honeypot: values.honeypot ?? "",
      });
    });
    return () => subscription.unsubscribe();
  }, [basketReady, submitState.status, updateContactDraft, updateQuoteProducts, watch]);

  useEffect(() => {
    setValue("telephone", phone, { shouldDirty: false });
    setValue("telephoneCountry", phoneCountry.iso2, { shouldDirty: false });
    setValue("telephoneCountryName", phoneCountry.name, { shouldDirty: false });
  }, [phone, phoneCountry, setValue]);

  useEffect(() => {
    if (initialCountry || contactDraft?.telephoneCountry || phoneInteractionRef.current) return;

    const controller = new AbortController();
    const detectVisitorCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok || phoneInteractionRef.current) return;

        const data = (await response.json()) as { country_code?: string };
        const countryCode = data.country_code?.toLowerCase();
        const country = defaultCountries.find((entry) => entry[1] === countryCode);
        if (!country || phoneInteractionRef.current) return;

        setPhone(`+${country[2]}`);
        setPhoneCountry(defaultCountry(currentLocale, country[1]));
      } catch {
        // Keep the safe Tunisia fallback when the IP lookup is unavailable.
      }
    };

    void detectVisitorCountry();
    return () => controller.abort();
  }, [contactDraft?.telephoneCountry, currentLocale, initialCountry]);

  const validationMessage = useCallback(
    (key: string | undefined) => (key ? t(`validation.${key}`) : undefined),
    [t],
  );

  const clearFile = () => {
    setSelectedFile(null);
    setFileErrorKey(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      clearFile();
      return;
    }
    const result = await validateDevisFile(file);
    if (!result.ok) {
      setFileErrorKey(result.message);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileErrorKey(null);
    setSelectedFile(file);
  };

  const onSubmit = async (values: DevisFormValues) => {
    if (values.honeypot?.trim()) {
      setSubmitState({ status: "success" });
      return;
    }
    const fileCheck = await validateDevisFile(selectedFile);
    if (!fileCheck.ok) {
      setFileErrorKey(fileCheck.message);
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ status: "idle" });
    const formData = new FormData();
    formData.set("locale", locale);
    formData.set("nom", values.nom);
    formData.set("prenom", values.prenom);
    formData.set("email", values.email);
    formData.set("telephone", values.telephone);
    formData.set("telephoneCountry", values.telephoneCountry);
    formData.set("telephoneCountryName", values.telephoneCountryName);
    formData.set("products", JSON.stringify(values.products));
    formData.set("commentaire", values.commentaire ?? "");
    formData.set("website", values.honeypot ?? "");
    if (selectedFile) formData.set("fichier", selectedFile);

    try {
      const result = await submitDevisFromClient(formData);
      setSubmitState(result);
      if (result.status === "success") {
        skipDraftSyncRef.current = true;
        clearQuote();
        reset();
        setActiveIndex(0);
        setConfirmDelete(false);
        setPhone(initialPhone);
        setPhoneCountry(initialPhoneCountry);
        clearFile();
      }
    } catch {
      setSubmitState({ status: "error", code: "email" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const retry = () => setSubmitState({ status: "idle" });

  if (submitState.status === "success") {
    return (
      <div className="rounded-2xl border border-brand-orange/20 bg-white p-8 text-center shadow-sm md:p-12" role="status">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/15">
          <svg className="h-8 w-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark md:text-3xl">{t("success.title")}</h2>
        <p className="mt-4 text-lg text-text-muted">{t("success.message")}</p>
        <p className="mt-2 text-base text-text-muted">{t("success.confirmationNote")}</p>
      </div>
    );
  }

  const showError = submitState.status === "error";
  const whatsappUrl = getWhatsAppUrl();
  const phoneHandler = (nextPhone: string, nextCountry: PhoneCountryValue) => {
    phoneInteractionRef.current = true;
    setPhone(nextPhone);
    setPhoneCountry(nextCountry);
  };
  const productTypePath = `products.${activeIndex}.type` as const;
  const productSubtypePath = `products.${activeIndex}.variete` as const;
  const catalogProductIdPath = `products.${activeIndex}.catalogProductId` as const;
  const productTypeRegister = register(productTypePath, {
    onChange: (event) => {
      if (event.target.value !== selectedType) {
        setValue(productSubtypePath, "", { shouldDirty: true, shouldValidate: true });
        setValue(catalogProductIdPath, "", { shouldDirty: true });
      }
    },
  });
  const cataloguePills = products.flatMap((product, index) => {
    const catalogueProduct = catalogProducts.find((item) => item.slug === product.catalogProductId);
    return catalogueProduct
      ? [{ index, name: localized(catalogueProduct.name, currentLocale) }]
      : [];
  });
  const setActiveProduct = (index: number) => {
    if (index < 0 || index >= productFields.length) return;
    setActiveIndex(index);
    setConfirmDelete(false);
  };
  const addProduct = () => {
    if (productFields.length >= 3) return;
    const newIndex = productFields.length;
    append(emptyProduct());
    setActiveIndex(newIndex);
    setConfirmDelete(false);
    requestAnimationFrame(() => {
      const section = productSectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top < 80 || bounds.bottom > window.innerHeight) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };
  const removeActiveProduct = () => {
    if (productFields.length <= 1) return;
    const nextIndex = Math.min(activeIndex, productFields.length - 2);
    remove(activeIndex);
    setActiveIndex(nextIndex);
    setConfirmDelete(false);
  };
  const onInvalid = (formErrors: typeof errors) => {
    const invalidProducts = Array.isArray(formErrors.products) ? formErrors.products : [];
    const firstInvalidProduct = invalidProducts.findIndex((productError) => Boolean(productError));
    if (firstInvalidProduct >= 0) {
      setActiveIndex(firstInvalidProduct);
      requestAnimationFrame(() => productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-10">
      {showError && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-left" role="alert">
          <p className="font-semibold text-red-800">{t("error.title")}</p>
          <p className="mt-1 text-sm text-red-700">{submitState.code === "file" && submitState.fileError ? t(`validation.${submitState.fileError}`) : t(`error.codes.${submitState.code}`)}</p>
          <div className="mt-4"><GhostButton type="button" variant="black" size="sm" onClick={retry}>{t("error.retry")}</GhostButton></div>
          <p className="mt-4 text-sm text-text-muted">{t("error.fallback")} <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="font-semibold text-brand-orange hover:underline">{siteConfig.phone}</a>{" · "}<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-orange hover:underline">WhatsApp</a></p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate aria-busy={!formDraftReady}>
        <fieldset disabled={!formDraftReady} className="m-0 min-w-0 space-y-6 border-0 p-0">
        <div className="hidden" aria-hidden="true"><label htmlFor="website">{t("honeypotLabel")}</label><input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} /></div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label={t("fields.nom")} required error={validationMessage(errors.nom?.message)}><input type="text" autoComplete="family-name" className={inputClass(!!errors.nom)} {...register("nom")} /></Field>
          <Field label={t("fields.prenom")} required error={validationMessage(errors.prenom?.message)}><input type="text" autoComplete="given-name" className={inputClass(!!errors.prenom)} {...register("prenom")} /></Field>
        </div>

        <Field label={t("fields.telephone")} required error={validationMessage(errors.telephone?.message) || validationMessage(errors.telephoneCountry?.message)}>
          <InternationalPhoneField locale={currentLocale} value={phone} country={phoneCountry} onChange={phoneHandler} error={!!errors.telephone || !!errors.telephoneCountry} placeholder={t("placeholders.telephone")} />
        </Field>

        <Field label={t("fields.email")} required error={validationMessage(errors.email?.message)}><input type="email" autoComplete="email" className={inputClass(!!errors.email)} {...register("email")} /></Field>

        {cataloguePills.length > 0 && (
          <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4" aria-label={t("productControls.catalogueProducts")}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{t("productControls.catalogueProducts")}</p>
            <div className="flex flex-wrap gap-2">
              {cataloguePills.map((pill) => (
                <button
                  key={`${pill.index}-${pill.name}`}
                  type="button"
                  onClick={() => setActiveProduct(pill.index)}
                  className="rounded-full border border-brand-orange/30 bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark transition hover:border-brand-orange hover:bg-brand-orange/10"
                >
                  {pill.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={productSectionRef} className="scroll-mt-24 rounded-xl border border-brand-orange/20 bg-brand-light/50 p-4 md:p-6" aria-label={t("fields.productType")}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-6"
          >
            <Field label={t("fields.productType")} required error={validationMessage(activeProductErrors?.type?.message)}>
              <select value={selectedType ?? ""} aria-invalid={!!activeProductErrors?.type} className={inputClass(!!activeProductErrors?.type)} {...productTypeRegister}>
                <option value="" disabled hidden>{t("placeholders.productType")}</option>
                {PRODUCT_TYPES.map(({ value, labelKey }) => <option key={value} value={value}>{t(`productTypes.${labelKey}`)}</option>)}
              </select>
            </Field>

            <input type="hidden" {...register(productSubtypePath)} />
            <input type="hidden" {...register(catalogProductIdPath)} />
            {selectedType && (
              <ProductSubtypePicker
                type={selectedType}
                locale={currentLocale}
                value={selectedSubtype}
                onChange={(value) => {
                  setValue(productSubtypePath, value ?? "", { shouldDirty: true, shouldValidate: true });
                  if (value !== selectedSubtype) setValue(catalogProductIdPath, "", { shouldDirty: true });
                }}
                label={t("fields.productSubtypePrompt", { type: t(`productTypes.${selectedType}`) })}
              />
            )}
            {activeProductErrors?.variete?.message && <p className="text-sm text-red-600" role="alert">{validationMessage(activeProductErrors.variete.message)}</p>}

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <p className="col-span-2 text-sm font-semibold text-brand-dark md:col-span-3">{t("fields.dimensions")}</p>
              <Field label={t("fields.longueur")} required error={validationMessage(activeProductErrors?.longueur?.message)}>
                <input type="number" min="0.01" step="any" value={activeProduct.longueur ?? ""} placeholder={t("placeholders.longueur")} className={inputClass(!!activeProductErrors?.longueur)} {...register(`products.${activeIndex}.longueur`)} />
              </Field>
              <Field label={t("fields.largeur")} required error={validationMessage(activeProductErrors?.largeur?.message)}>
                <input type="number" min="0.01" step="any" value={activeProduct.largeur ?? ""} placeholder={t("placeholders.largeur")} className={inputClass(!!activeProductErrors?.largeur)} {...register(`products.${activeIndex}.largeur`)} />
              </Field>
              <Field label={t("fields.epaisseur")} required error={validationMessage(activeProductErrors?.epaisseur?.message)}>
                <input type="number" min="0.01" step="any" value={activeProduct.epaisseur ?? ""} placeholder={t("placeholders.epaisseur")} className={inputClass(!!activeProductErrors?.epaisseur)} {...register(`products.${activeIndex}.epaisseur`)} />
              </Field>
              <div className="md:col-start-4 md:row-start-1 md:row-span-2 md:flex md:flex-col md:justify-end">
                <Field label={t("fields.quantite")} required error={validationMessage(activeProductErrors?.quantite?.message)}>
                  <input type="number" min="0.01" step="any" value={String(activeProduct.quantite ?? "")} placeholder={t("placeholders.quantite")} className={inputClass(!!activeProductErrors?.quantite)} {...register(`products.${activeIndex}.quantite`)} />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.85fr)]">
              <div className="space-y-4">
                <Field label={t("fields.finition")} required error={validationMessage(activeProductErrors?.finition?.message)}>
                  <select value={selectedFinishValue ?? ""} aria-invalid={!!activeProductErrors?.finition} className={inputClass(!!activeProductErrors?.finition)} {...register(`products.${activeIndex}.finition`)}>
                    <option value="" disabled hidden>{t("placeholders.finition")}</option>
                    {FINISH_VALUES.map((value) => <option key={value} value={value}>{t(`finishOptions.${value}`)}</option>)}
                  </select>
                </Field>
                {selectedFinishValue === "autre" && (
                  <Field label={t("fields.finitionAutre")} hint={t("fields.finitionAutreHint")} error={validationMessage(activeProductErrors?.otherFinitionText?.message)}>
                    <input type="text" maxLength={160} value={String(activeProduct.otherFinitionText ?? "")} placeholder={t("placeholders.finitionAutre")} className={inputClass(!!activeProductErrors?.otherFinitionText)} {...register(`products.${activeIndex}.otherFinitionText`)} />
                  </Field>
                )}
              </div>
              {selectedFinish && (
                <figure className="m-0 flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-brand-orange/20 bg-brand-light shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedFinish.image} alt={`${t("fields.finition")} — ${t(`finishOptions.${selectedFinish.value}`)}`} className="h-[210px] w-full flex-1 object-cover" />
                  <figcaption className="px-3 py-2 text-xs font-semibold text-brand-dark">{t(`finishOptions.${selectedFinish.value}`)}</figcaption>
                </figure>
              )}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label={t("fields.productType")}>
          {productFields.length === 1 ? (
              <button type="button" onClick={addProduct} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-orange/20">
                <Plus className="h-4 w-4" aria-hidden="true" />{t("productControls.add")}
              </button>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t("fields.productType")}>
                {productFields.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    onClick={() => setActiveProduct(index)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${index === activeIndex ? "border-brand-orange bg-brand-orange text-white" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-orange/60"}`}
                  >
                    {t("productControls.product", { number: index + 1 })}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button type="button" aria-label={t("productControls.previous")} title={t("productControls.previous")} disabled={activeIndex === 0} onClick={() => setActiveProduct(activeIndex - 1)} className="rounded-full p-2 text-brand-dark transition hover:bg-brand-orange/10 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
                <button type="button" aria-label={t("productControls.next")} title={t("productControls.next")} disabled={activeIndex === productFields.length - 1} onClick={() => setActiveProduct(activeIndex + 1)} className="rounded-full p-2 text-brand-dark transition hover:bg-brand-orange/10 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
              </div>
              <span className="w-full text-center text-xs text-text-muted sm:w-auto sm:text-left">{t("productControls.counter", { current: activeIndex + 1, total: productFields.length })}</span>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{t("productControls.remove")}</span>
                  <button type="button" onClick={removeActiveProduct} className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">{t("productControls.confirm")}</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full border border-brand-dark/15 px-3 py-2 text-xs font-semibold text-brand-dark">{t("productControls.cancel")}</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />{t("productControls.remove")}
                </button>
              )}
              {productFields.length < 3 ? (
                <button type="button" onClick={addProduct} className="inline-flex items-center gap-1 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-2 text-xs font-semibold text-brand-dark transition hover:bg-brand-orange/20">
                  <Plus className="h-4 w-4" aria-hidden="true" />{t("productControls.add")}
                </button>
              ) : (
                <span className="rounded-full bg-brand-dark/5 px-3 py-2 text-xs text-text-muted">{t("productControls.max")}</span>
              )}
            </>
          )}
          <Link
            href="/#produits"
            onClick={() => window.sessionStorage.setItem(OPEN_CATALOGUE_SESSION_KEY, "1")}
            className="inline-flex min-h-10 items-center rounded-full px-3 py-2 text-xs font-semibold text-brand-orange underline decoration-brand-orange/40 underline-offset-4 transition hover:text-brand-dark"
          >
            {t("productControls.browseCatalogue")}
          </Link>
          {!Array.isArray(errors.products) && errors.products?.message && <p className="w-full text-sm text-red-600" role="alert">{validationMessage(errors.products.message)}</p>}
        </div>

        <Field label={t("fields.commentaire")} error={validationMessage(errors.commentaire?.message)} hint={`${comment.length}/1000`}>
          <textarea maxLength={1000} rows={5} placeholder={t("placeholders.commentaire")} className={inputClass(!!errors.commentaire)} {...register("commentaire")} />
        </Field>

        <Field label={t("fields.file")} hint={t("fields.fileHint")} error={fileErrorKey ? t(`validation.${fileErrorKey}`) : undefined}>
          <input ref={fileInputRef} type="file" accept={ACCEPTED_FILE_EXTENSIONS.join(",")} onChange={onFileChange} className="block w-full text-sm text-brand-dark file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-dark hover:file:bg-brand-orange/25" />
          {selectedFile && <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-brand-light px-4 py-2"><span className="truncate text-sm text-brand-dark">{selectedFile.name}</span><button type="button" onClick={clearFile} className="shrink-0 text-sm font-semibold text-brand-orange hover:underline">{t("fileRemove")}</button></div>}
        </Field>

        <GhostButton type="submit" variant="black" size="md" isLoading={isSubmitting} disabled={isSubmitting} className="w-full md:w-auto md:min-w-[200px]">{isSubmitting ? t("submitting") : t("submit")}</GhostButton>
        </fieldset>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return ["w-full rounded-lg border bg-white px-4 py-3 text-brand-dark outline-none transition", "focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20", hasError ? "border-red-400" : "border-brand-dark/15"].join(" ");
}

function Field({ label, required = false, hint, error, children }: { label: string; required?: boolean; hint?: string; error?: string; children: ReactNode }) {
  return <div><label className="mb-2 block text-sm font-semibold text-brand-dark">{label}{required && <span className="ml-1 text-brand-orange" aria-hidden="true">*</span>}</label>{hint && <p className="mb-2 text-xs text-text-muted">{hint}</p>}{children}{error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}</div>;
}
