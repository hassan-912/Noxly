import type { EmbedStatus, ProjectSlug } from "@/content/types";
import type { Device } from "./DeviceControls";

/** What a `SitePanel` needs to know about a project, in one locale. Small enough for the client. */
export type SitePanelProject = {
  slug: ProjectSlug;
  name: string;
  pitch: string;
  embed: EmbedStatus;
  liveUrl: string | null;
  screenshots: { desktop?: string; mobile?: string; alt: string } | null;
};

/** What the stage shows: the live site, a screenshot of it, or a short text presentation. */
export type Presentation = "live" | "screenshot" | "text";

/** Pixel size of the captures made by scripts/capture-screenshots.ts (CSS px of the viewport). */
const captureSize = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

/** The screenshot for a device: the mobile one on the phone, the desktop one otherwise. */
export function screenshotOf(project: SitePanelProject, device: Device) {
  const shots = project.screenshots;
  if (!shots) return null;
  const preferred = device === "phone" ? (["mobile", "desktop"] as const) : (["desktop", "mobile"] as const);
  for (const kind of preferred) {
    const src = shots[kind];
    if (src) return { kind, src, alt: shots.alt, ...captureSize[kind] };
  }
  return null;
}

/** The presentation a project gets when everything loads. A broken screenshot falls back to text. */
export function intendedPresentation(project: SitePanelProject, device: Device): Presentation {
  if (project.embed === "allowed" && project.liveUrl) return "live";
  return screenshotOf(project, device) ? "screenshot" : "text";
}
