import type { Locale, Project } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { ProjectInfo } from "./ProjectInfo";
import { sitePanelLabels, sitePanelProject } from "./site-props";
import { ViewerStage, type ViewerItem } from "./ViewerStage";

/**
 * The featured-work viewer: a project rail, a framed stage with device controls, and the
 * project's details. This server component prepares the content (including each project's
 * `ProjectInfo`, rendered here so the icon sets stay out of the client bundle) and hands it to
 * the interactive `ViewerStage`, whose stage shows each project's real site, a real screenshot
 * of it, or a short text presentation (`SitePanel`).
 */
export function ProjectViewer({ locale, projects }: { locale: Locale; projects: Project[] }) {
  const t = getDictionary(locale).viewer;

  const items: ViewerItem[] = projects.map((project, i) => ({
    slug: project.slug,
    number: String(i + 1).padStart(2, "0"),
    name: project.text[locale].name,
    status: project.status,
    site: sitePanelProject(project, locale),
    variants: project.previews?.map((preview) => ({
      id: preview.id,
      label: preview.label[locale],
      site: sitePanelProject({ ...project, liveUrl: preview.liveUrl, screenshots: preview.screenshots }, locale),
    })),
  }));

  return (
    <ViewerStage
      idBase="work"
      locale={locale}
      items={items}
      labels={{
        rail: t.railLabel,
        devices: t.devicesLabel,
        pathways: t.pathwaysLabel,
        reload: t.reload,
        device: { desktop: t.desktop, tablet: t.tablet, phone: t.phone },
        preview: { live: t.previewLive, screenshot: t.previewScreenshot, text: t.previewOverview },
        site: sitePanelLabels(locale),
      }}
      infos={projects.map((project, i) => (
        <ProjectInfo key={project.slug} locale={locale} project={project} index={i} total={projects.length} />
      ))}
    />
  );
}
