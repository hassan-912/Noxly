import { describe, expect, test } from "vitest";
import { locales } from "@/content/types";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { localizePath } from "@/lib/i18n";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("metadata", () => {
  test("buildMetadata gives hreflang for en, de, fr, ar and x-default", () => {
    const meta = buildMetadata("de", "/");
    expect(meta.alternates?.canonical).toBe(`${site.url}/de/`);
    expect(meta.alternates?.languages).toEqual({
      en: `${site.url}/en/`,
      de: `${site.url}/de/`,
      fr: `${site.url}/fr/`,
      ar: `${site.url}/ar/`,
      "x-default": `${site.url}/en/`,
    });
    expect(meta.title).toBe("Hassan Azab — Software Engineer");
    expect(meta.description).toMatch(/software engineer at MG Visa/);
    expect(meta.metadataBase?.toString()).toBe(`${site.url}/`);
  });

  test("buildMetadata points Open Graph and Twitter at the locale's share image", () => {
    const meta = buildMetadata("fr", "/");
    const image = { url: "/og/fr.png", width: 1200, height: 630, type: "image/png" };
    expect(meta.openGraph?.images).toEqual([expect.objectContaining(image)]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: [expect.objectContaining(image)] });
  });

  test("buildMetadata keeps the path across locales and uses the given title and description", () => {
    const meta = buildMetadata("ar", "/work/review/", "Document review", "A review tool.");
    expect(meta.alternates?.canonical).toBe(`${site.url}/ar/work/review/`);
    expect((meta.alternates?.languages as Record<string, string>).fr).toBe(`${site.url}/fr/work/review/`);
    expect(meta.title).toBe("Document review — Hassan Azab");
    expect(meta.description).toBe("A review tool.");
    expect(meta.openGraph).toMatchObject({ url: `${site.url}/ar/work/review/`, locale: "ar_EG" });
  });

  test("sitemap lists 4 home URLs and 16 case-study URLs", () => {
    const urls = sitemap().map((e) => e.url).sort();
    const caseStudies = ["review", "calculator", "consultation", "mg-mobile"];
    const expected = locales
      .flatMap((l) => [`${site.url}/${l}/`, ...caseStudies.map((s) => `${site.url}/${l}/work/${s}/`)])
      .sort();
    expect(urls).toHaveLength(20);
    expect(urls).toEqual(expected);
    expect(urls.some((u) => u.includes("demo-lab"))).toBe(false);
  });

  test("robots allows crawling and points to the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe(`${site.url}/sitemap.xml`);
    expect(r.rules).toMatchObject({ userAgent: "*", allow: "/" });
  });
});

describe("localizePath", () => {
  test("swaps the locale segment and keeps the rest of the path and the hash", () => {
    expect(localizePath("/en/", "de", "#services")).toBe("/de/#services");
    expect(localizePath("/en/work/review/", "ar", "")).toBe("/ar/work/review/");
    expect(localizePath("/fr", "en")).toBe("/en/");
    expect(localizePath("/", "fr")).toBe("/fr/");
  });
});
