import type { Locale, Project } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import type { SitePanelLabels } from "./SitePanel";
import type { SitePanelProject } from "./site";

/*
 * Server side: what `<SitePanel>` needs for a project in one locale, so only these strings (not
 * every locale's dictionary or project text) reach the client bundle.
 */

export function sitePanelProject(project: Project, locale: Locale): SitePanelProject {
  const text = project.text[locale];
  return {
    slug: project.slug,
    name: text.name,
    pitch: text.pitch,
    embed: project.embed,
    liveUrl: project.liveUrl,
    screenshots: project.screenshots && {
      desktop: project.screenshots.desktop,
      mobile: project.screenshots.mobile,
      alt: project.screenshots.alt[locale],
    },
  };
}

export function sitePanelLabels(locale: Locale): SitePanelLabels {
  const t = getDictionary(locale).viewer;
  return {
    loadLive: t.loadLive,
    liveTitle: t.liveTitle,
    liveLoading: t.liveLoading,
    livePoster: t.livePoster,
    liveFallback: t.liveFallback,
    openWebsite: t.openWebsite,
    opensNewTab: t.opensNewTab,
    blockedNote: t.blockedNote,
    internalNote: t.internalNote,
  };
}

/** Use as `<SitePanel {...sitePanelProps(project, locale)} device={device} />`. */
export function sitePanelProps(project: Project, locale: Locale) {
  return { project: sitePanelProject(project, locale), labels: sitePanelLabels(locale) };
}
