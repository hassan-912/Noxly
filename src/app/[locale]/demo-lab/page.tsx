import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, isLocale } from "@/lib/i18n";
import { posterFor } from "@/lib/posters";
import { DemoLab } from "./DemoLab";

/**
 * Test-only route for the coded demos (`tests/e2e/demos.spec.ts`). It is not linked from the
 * navigation, not listed in the sitemap, and tells crawlers to stay away.
 */
export const metadata: Metadata = {
  title: "Demo lab",
  robots: { index: false, follow: false },
  alternates: {},
};

export default async function DemoLabPage({ params }: PageProps<"/[locale]/demo-lab">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const qr = getProject("qr-studio");
  const text = qr.text[locale];
  return (
    <DemoLab
      locale={locale}
      live={{ url: qr.liveUrl!, poster: posterFor(qr.slug), title: text.name, pitch: text.pitch }}
    />
  );
}
