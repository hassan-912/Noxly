import { notFound } from "next/navigation";
import { notesCopy } from "@/content/notes";
import { locales } from "@/content/types";
import { site } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/metadata";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of a locale's notes, built from the post files at build time. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = notesCopy[locale];

  const items = getPosts().map((post) => {
    const text = post.text[locale];
    const url = absoluteUrl(locale, `/notes/${post.slug}/`);
    return [
      "<item>",
      `<title>${escape(text.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<description>${escape(text.summary)}</description>`,
      `<pubDate>${new Date(`${post.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>`,
      "</item>",
    ].join("");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>',
    `<title>${escape(`${copy.title} — ${site.name}`)}</title>`,
    `<link>${absoluteUrl(locale, "/notes/")}</link>`,
    `<atom:link href="${absoluteUrl(locale, "/notes/rss.xml")}" rel="self" type="application/rss+xml"/>`,
    `<description>${escape(copy.description)}</description>`,
    `<language>${locale}</language>`,
    ...items,
    "</channel></rss>",
  ].join("");

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
