import type { Locale, Localized } from "./types";
import deTranslations from "./translations/de.json";
import frTranslations from "./translations/fr.json";
import arTranslations from "./translations/ar.json";

const translations: Record<Exclude<Locale, "en">, Record<string, string>> = {
  de: deTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

/** Translate content from the checked-in locale maps, including nested arrays and objects. */
export function translateValue<T>(value: T, locale: Exclude<Locale, "en">): T {
  if (typeof value === "string") return (translations[locale][value] ?? value) as T;
  if (Array.isArray(value)) return value.map((item) => translateValue(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, translateValue(item, locale)]),
    ) as T;
  }
  return value;
}

export function localized<T>(en: T): Localized<T> {
  return { en, de: translateValue(en, "de"), fr: translateValue(en, "fr"), ar: translateValue(en, "ar") };
}
