import { ArrowRight } from "lucide-react";
import type { Locale } from "@/content/types";
import { getDictionary, getProjects } from "@/lib/i18n";
import { StatusPill } from "@/components/ui/StatusPill";
import { TechLabel } from "@/components/ui/TechLabel";

export function BuildingSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="mt-6" data-section-body="building">
      <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{dict.sections.building.intro}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        {getProjects("in-development").map((project) => {
          const text = project.text[locale];
          const shot = project.screenshots?.mobile ?? project.screenshots?.desktop;
          return (
            <article key={project.slug} data-project={project.slug} className="min-w-0 border-t border-mist pt-6">
              <div className="flex flex-wrap gap-2">{project.status.map((status) => <StatusPill key={status} status={status} locale={locale} />)}</div>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight">{text.name}</h3>
              <p className="mt-3 max-w-lg text-xl leading-snug text-balance">{text.pitch}</p>
              <p className="mt-5 max-w-lg leading-relaxed text-ink-muted">{text.summary}</p>
              {shot && (
                <figure className="mt-7 overflow-hidden rounded-2xl border border-mist bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot} alt={project.screenshots!.alt[locale]} loading="lazy" className="mx-auto max-h-[32rem] w-auto max-w-full object-contain" />
                </figure>
              )}
              <ul aria-label={dict.viewer.stack} className="mt-7 flex flex-wrap gap-2">{project.stack.map((id) => <li key={id}><TechLabel id={id} /></li>)}</ul>
              {project.caseStudy && <a href={`/${locale}/work/${project.slug}/`} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-indigo hover:text-ink">{dict.viewer.caseStudy}<ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" /></a>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
