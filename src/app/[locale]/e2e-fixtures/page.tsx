import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, isLocale } from "@/lib/i18n";
import { ProjectViewer } from "@/components/work/ProjectViewer";

/**
 * Test-only page (tests/e2e/viewer.spec.ts). None of the featured projects can be embedded today,
 * so this renders the same viewer with Review (embed "allowed") and the Calculator, to exercise
 * the live-embed path: click to load, fallback, device widths.
 *
 * It exists only in builds made with E2E_FIXTURES=1 (set in .env.test, which only Playwright
 * loads); every other build renders a 404 here. Never linked, not in the sitemap, noindex.
 */
export const metadata: Metadata = {
  title: "E2E fixtures",
  robots: { index: false, follow: false },
  alternates: {},
};

export default async function FixturesPage({ params }: PageProps<"/[locale]/e2e-fixtures">) {
  if (process.env.E2E_FIXTURES !== "1") notFound();
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <section id="work" aria-label="Viewer fixture" className="mx-auto max-w-[100rem] px-5 py-12 sm:px-8">
      <ProjectViewer locale={locale} projects={[getProject("review"), getProject("calculator")]} />
    </section>
  );
}
