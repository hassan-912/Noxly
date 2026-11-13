import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";
import { locales } from "@/content/types";
import "../globals.css";

const en = getDictionary("en");

/** The language picker at "/". It is not indexed; search engines get the locale URLs via hreflang. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: en.meta.title,
  description: en.meta.description,
  robots: { index: false, follow: true },
  alternates: {
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}/`])),
      "x-default": `${site.url}/en/`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fontVariables} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
