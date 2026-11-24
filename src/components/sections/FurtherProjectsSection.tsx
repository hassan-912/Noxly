import { ArrowUpRight } from "lucide-react";
import type { Locale, Project } from "@/content/types";
import { getDictionary, getProjects } from "@/lib/i18n";
import { StatusPill } from "@/components/ui/StatusPill";
import { TechLabel } from "@/components/ui/TechLabel";
import { ProjectDisclosure } from "./ProjectDisclosure";

function ProjectDetails({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale);
  const text = project.text[locale];
  return (
    <div>
      <p className="max-w-2xl leading-relaxed text-ink-muted">{text.summary}</p>
      {project.authorship.kind === "shared" && <p className="mt-4 text-sm text-ink-muted">{project.authorship.note[locale]}</p>}
      {text.features && <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">{text.features.map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true" className="text-indigo">—</span><span>{feature}</span></li>)}</ul>}
      {project.status.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{project.status.map((status) => <StatusPill key={status} status={status} locale={locale} />)}</div>}
      <ul aria-label={dict.viewer.stack} className="mt-5 flex flex-wrap gap-2">{project.stack.map((id) => <li key={id}><TechLabel id={id} /></li>)}</ul>
      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-indigo hover:text-ink">{dict.viewer.openWebsite}<ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" /><span className="sr-only">{dict.viewer.opensNewTab}</span></a>}
    </div>
  );
}

export function FurtherProjectsSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const projects = getProjects("further");
  const medium = projects.filter((p) => p.slug === "mawid");
  const index = projects.filter((p) => p.slug !== "mawid");
  return (
    <div className="mt-6" data-section-body="projects">
      <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{dict.sections.projects.intro}</p>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        {medium.map((project) => (
          <article key={project.slug} data-project={project.slug} className="min-w-0 border-t border-mist pt-6">
            <h3 className="text-2xl font-semibold tracking-tight">{project.text[locale].name}</h3>
            <p className="mt-2 mb-5 text-lg leading-snug">{project.text[locale].pitch}</p>
            <ProjectDetails project={project} locale={locale} />
          </article>
        ))}
      </div>
      <div className="mt-14 border-t border-mist">
        {index.map((project, i) => <ProjectDisclosure key={project.slug} name={project.text[locale].name} pitch={project.text[locale].pitch} number={String(i + medium.length + 1).padStart(2, "0")} showLabel={dict.projects.showDetails} hideLabel={dict.projects.hideDetails}><ProjectDetails project={project} locale={locale} /></ProjectDisclosure>)}
      </div>
    </div>
  );
}
