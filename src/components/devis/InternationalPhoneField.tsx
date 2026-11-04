"use client";

import { useMemo, useState } from "react";
import {
  defaultCountries,
  FlagImage,
  PhoneInput,
  type CountryIso2,
} from "react-international-phone";
import type { Locale } from "@/types/content";

export type PhoneCountryValue = {
  iso2: CountryIso2;
  name: string;
};

type InternationalPhoneFieldProps = {
  locale: Locale;
  value: string;
  country: PhoneCountryValue;
  onChange: (phone: string, country: PhoneCountryValue) => void;
  error?: boolean;
  placeholder?: string;
};

function countryName(iso2: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(iso2.toUpperCase()) ?? iso2;
  } catch {
    return iso2;
  }
}

export default function InternationalPhoneField({
  locale,
  value,
  country,
  onChange,
  error = false,
  placeholder,
}: InternationalPhoneFieldProps) {
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const countries = useMemo(
    () =>
      defaultCountries.map((entry) => ({
        iso2: entry[1] as CountryIso2,
        nameEn: entry[0],
        nameLocal: countryName(entry[1], locale),
        dialCode: entry[2],
      })),
    [locale],
  );
  const filteredCountries = countries.filter((item) =>
    `${item.nameEn} ${item.nameLocal} ${item.iso2}`.toLowerCase().includes(query.toLowerCase()),
  );

  const selectCountry = (iso2: CountryIso2) => {
    const item = countries.find((candidate) => candidate.iso2 === iso2);
    if (!item) return;
    onChange(`+${item.dialCode}`, { iso2, name: item.nameLocal });
    setQuery("");
    setCountryMenuOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`flex overflow-visible rounded-lg border bg-white transition focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20 ${
          error ? "border-red-400" : "border-brand-dark/15"
        }`}
      >
        <button
          type="button"
          className="flex min-w-[76px] items-center justify-center gap-1 border-r border-brand-dark/10 px-2 text-brand-dark hover:bg-brand-orange/5"
          aria-label={locale === "fr" ? "Choisir le pays" : "Choose country"}
          aria-expanded={countryMenuOpen}
          aria-haspopup="listbox"
          onClick={() => setCountryMenuOpen((open) => !open)}
        >
          <FlagImage iso2={country.iso2} style={{ width: 22, height: 16 }} />
          <span className="text-xs font-semibold">{country.iso2.toUpperCase()}</span>
          <span aria-hidden className="text-xs text-text-muted">⌄</span>
        </button>
        <PhoneInput
          // PhoneInput treats defaultCountry as an initialization value. Remount
          // on country changes so its internal country/dial-code state follows
          // the controlled country and number supplied by the parent.
          key={country.iso2}
          value={value}
          defaultCountry={country.iso2}
          hideDropdown
          disableCountryGuess
          forceDialCode
          onChange={(phone, meta) => {
            onChange(phone, {
              iso2: meta.country.iso2,
              name: countryName(meta.country.iso2, locale),
            });
          }}
          placeholder={placeholder}
          inputProps={{
            name: "telephone",
            autoComplete: "tel",
            "aria-label": locale === "fr" ? "Numéro de téléphone" : "Phone number",
          }}
          inputClassName="!h-[50px] !w-full !border-0 !bg-transparent !px-3 !text-brand-dark !shadow-none focus:!outline-none"
          countrySelectorStyleProps={{ buttonClassName: "!hidden" }}
          className="!w-full !border-0 !shadow-none"
        />
      </div>

      {countryMenuOpen && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-[280px] overflow-hidden rounded-xl border border-brand-dark/10 bg-white shadow-xl">
          <div className="border-b border-brand-dark/10 p-2">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === "fr" ? "Rechercher un pays…" : "Search country…"}
              className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              aria-label={locale === "fr" ? "Rechercher un pays" : "Search country"}
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
            {filteredCountries.map((item) => (
              <li key={item.iso2}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.iso2 === country.iso2}
                  onClick={() => selectCountry(item.iso2)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-brand-dark hover:bg-brand-orange/10 focus:bg-brand-orange/10 focus:outline-none"
                >
                  <FlagImage iso2={item.iso2} style={{ width: 24, height: 17 }} />
                  <span className="flex-1">{item.nameLocal}</span>
                  <span className="text-xs text-text-muted">{item.nameEn}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
