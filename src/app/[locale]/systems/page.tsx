import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TechDiagram } from "@/components/diagram/TechDiagram";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return buildMetadata(locale, "/systems/", dict.nav.systems, dict.sections.systems.intro);
}

export default async function SystemsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <section id="systems" aria-labelledby="systems-title" className="pb-24">
      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
        <a href={`/${locale}/#work`} className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-ink-muted transition-colors hover:text-indigo">
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {dict.caseStudy.back}
        </a>
        <p className="mt-12 font-mono text-sm text-indigo">{dict.nav.systems}</p>
        <h1 id="systems-title" className="mt-3 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {dict.sections.systems.title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
          {dict.sections.systems.intro}
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-[100rem] px-5 sm:px-8">
        <TechDiagram locale={locale} />
      </div>
    </section>
  );
}
