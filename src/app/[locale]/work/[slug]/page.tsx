import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Workflow } from "lucide-react";
import { projects } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { site } from "@/content/site";
import { StatusPill } from "@/components/ui/StatusPill";
import { TechLabel } from "@/components/ui/TechLabel";
import { SitePanel } from "@/components/work/SitePanel";
import { sitePanelProps } from "@/components/work/site-props";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((project) => project.caseStudy).map(({ slug }) => ({ slug }));
}

async function resolveProject(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = projects.find((item) => item.slug === slug && item.caseStudy);
  if (!project) notFound();
  return { locale, project };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, project } = await resolveProject(params);
  const text = project.text[locale];
  return buildMetadata(locale, `/work/${project.slug}/`, text.name, text.summary);
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, project } = await resolveProject(params);
  const dict = getDictionary(locale);
  const text = project.text[locale];
  const hasArchitecture = diagrams.some((diagram) => diagram.project === project.slug);
  const narrative = [
    { id: "problem", title: dict.caseStudy.problem, body: text.problem },
    { id: "contribution", title: dict.caseStudy.contribution, body: text.contribution },
    { id: "approach", title: dict.caseStudy.approach, body: text.approach },
  ];
  const buildingIntro = {
    en: "Being built around:",
    de: "In Entwicklung mit diesen Schwerpunkten:",
    fr: "En cours de développement autour de :",
    ar: "يجري تطويره حول:",
  };

  return (
    <article className="pb-24">
      <header className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
        <a href={`/${locale}/#work`} className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-ink-muted transition-colors hover:text-indigo">
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {dict.caseStudy.back}
        </a>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <div className="min-w-0">
            <p className="text-sm font-medium text-indigo">
              {project.authorship.kind === "solo" ? dict.authorship.solo : project.authorship.note[locale]}
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{text.name}</h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink">{text.pitch}</p>
            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-ink-muted">{text.summary}</p>
          </div>
          <aside className="min-w-0 border-t border-mist pt-6 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0" aria-label={dict.caseStudy.stack}>
            {project.status.length > 0 && (
              <div>
                <p className="viewer-kicker">{dict.caseStudy.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.status.map((status) => <StatusPill key={status} status={status} locale={locale} />)}
                </div>
              </div>
            )}
            <p className="viewer-kicker mt-7">{dict.caseStudy.stack}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((id) => <li key={id}><TechLabel id={id} /></li>)}
            </ul>
            {project.previews ? project.previews.map((preview) => (
              <a key={preview.id} href={preview.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-11 items-center gap-2 text-sm font-medium text-indigo hover:text-ink">
                {preview.label[locale]} <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                <span className="sr-only">{dict.viewer.opensNewTab}</span>
              </a>
            )) : project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-ink">
                {dict.viewer.openWebsite}
                <span className="sr-only"> {dict.viewer.opensNewTab}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </a>
            )}
          </aside>
        </div>
      </header>

      {(project.screenshots || project.embed === "allowed") && (
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="aspect-[1440/900] min-h-80 overflow-hidden rounded-2xl border border-mist bg-frost">
            <SitePanel {...sitePanelProps(project, locale)} device="desktop" />
          </div>
        </div>
      )}

      <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        {narrative.filter((item) => item.body).map(({ id, title, body }, index) => (
          <section key={id} aria-labelledby={`case-${id}`} className="grid gap-5 border-t border-mist py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
            <div>
              <p className="font-mono text-xs text-indigo">{String(index + 1).padStart(2, "0")}</p>
              <h2 id={`case-${id}`} className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">{body}</p>
          </section>
        ))}

        <div className="grid gap-12 border-t border-mist py-12 md:grid-cols-2 md:gap-20">
          {text.features && text.features.length > 0 && (
            <section aria-labelledby="case-features">
              <h2 id="case-features" className="text-2xl font-semibold tracking-tight">{dict.caseStudy.features}</h2>
              {project.slug === "mg-mobile" && <p className="mt-4 text-ink-muted">{buildingIntro[locale]}</p>}
              <ul className="mt-6 space-y-4">
                {text.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-indigo" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {text.outcomes && text.outcomes.length > 0 && (
            <section aria-labelledby="case-outcomes">
              <h2 id="case-outcomes" className="text-2xl font-semibold tracking-tight">{dict.caseStudy.outcomes}</h2>
              <ul className="mt-6 space-y-4">
                {text.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {hasArchitecture && (
          <a href={`/${locale}/systems/#systems`} className="group flex min-h-20 items-center gap-4 rounded-2xl border border-mist bg-frost px-5 py-6 transition-colors hover:border-indigo sm:px-8">
            <Workflow aria-hidden="true" className="size-6 shrink-0 text-indigo" />
            <span className="min-w-0 flex-1 text-lg font-medium">{dict.caseStudy.architecture}</span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-indigo transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </a>
        )}

        <section className="mt-16 border-t border-mist pt-12" aria-labelledby="case-contact">
          <h2 id="case-contact" className="text-balance text-3xl font-semibold tracking-tight">{dict.caseStudy.cta}</h2>
          <a href={site.contacts.whatsapp.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-indigo px-6 py-3 font-medium text-surface transition-colors hover:bg-ink">
            {dict.contact.whatsappAction}
            <span className="sr-only"> {dict.viewer.opensNewTab}</span>
            <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </a>
        </section>
      </div>
    </article>
  );
}
