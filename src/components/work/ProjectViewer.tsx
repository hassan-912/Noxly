import type { DemoId, Locale, Project } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { ProjectInfo } from "./ProjectInfo";
import { ViewerStage, type ViewerItem } from "./ViewerStage";

/**
 * The featured-work viewer: a project rail, a framed stage with device controls, and the
 * project's details. This server component prepares the content (including each project's
 * `ProjectInfo`, rendered here so the icon sets stay out of the client bundle) and hands it to
 * the interactive `ViewerStage`.
 *
 * Every project passed in must have a coded demo.
 */
export function ProjectViewer({ locale, projects }: { locale: Locale; projects: Project[] }) {
  const t = getDictionary(locale).viewer;

  const items: ViewerItem[] = projects.map((project, i) => {
    if (!project.demo) throw new Error(`ProjectViewer: ${project.slug} has no coded demo`);
    return {
      slug: project.slug,
      demo: project.demo as DemoId,
      number: String(i + 1).padStart(2, "0"),
      name: project.text[locale].name,
      status: project.status,
    };
  });

  return (
    <ViewerStage
      idBase="work"
      locale={locale}
      items={items}
      labels={{
        rail: t.railLabel,
        devices: t.devicesLabel,
        device: { desktop: t.desktop, tablet: t.tablet, phone: t.phone },
        preview: t.preview,
        loading: t.demoLoading,
      }}
      infos={projects.map((project, i) => (
        <ProjectInfo key={project.slug} locale={locale} project={project} index={i} total={projects.length} />
      ))}
    />
  );
}
