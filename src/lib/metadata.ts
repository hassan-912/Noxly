import type { Metadata } from "next";
import { locales, type Locale } from "@/content/types";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";

/** Open Graph locale tags (language_TERRITORY). */
const ogLocale: Record<Locale, string> = { en: "en_US", de: "de_DE", fr: "fr_FR", ar: "ar_EG" };

export const ogSize = { width: 1200, height: 630 } as const;

/** Path of a locale's share image, written by `scripts/og.tsx` before `next build`. */
export function ogImagePath(locale: Locale): string {
  return `/og/${locale}.png`;
}

/** Absolute URL for a locale-relative path such as "/" or "/work/review/". */
export function absoluteUrl(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}/${locale}${normalized}`;
}

/**
 * Per-page metadata: title, description, canonical URL, hreflang alternates for every
 * locale plus `x-default` (English), and Open Graph / Twitter fields with the locale's share
 * image (`public/og/{locale}.png`, written by `scripts/og.tsx` before `next build`).
 *
 * @param path locale-relative path with a trailing slash, e.g. "/" or "/work/review/".
 * @param title page title; the site name is appended. Defaults to the locale's site title.
 */
export function buildMetadata(locale: Locale, path: string, title?: string, description?: string): Metadata {
  const dict = getDictionary(locale);
  const fullTitle = title ? `${title} — ${site.name}` : dict.meta.title;
  const desc = description ?? dict.meta.description;
  const url = absoluteUrl(locale, path);
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)]));
  languages["x-default"] = absoluteUrl("en", path);
  const image = { url: ogImagePath(locale), ...ogSize, alt: dict.meta.ogAlt, type: "image/png" };

  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description: desc,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description: desc,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [image] },
  };
}
