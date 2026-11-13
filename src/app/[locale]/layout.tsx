import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/content/types";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import { dirOf, getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  return buildMetadata(await resolveLocale(params), "/");
}

function personJsonLd(locale: Locale): string {
  const dict = getDictionary(locale);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: dict.identity.role,
    url: `${site.url}/${locale}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Cairo",
      addressRegion: "Cairo",
      addressCountry: "EG",
    },
    sameAs: [site.contacts.linkedin, site.contacts.github],
  };
  // Escape "<" so the JSON can never close the script element.
  return JSON.stringify(person).replace(/</g, "\\u003c");
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={cn(fontVariables, "antialiased", locale === "ar" && "locale-ar")}
    >
      <body>
        <SkipLink label={dict.nav.skipToContent} />
        <Header locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd(locale) }} />
      </body>
    </html>
  );
}
