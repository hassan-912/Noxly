"use client";

import { useEffect, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useImageFailed } from "@/lib/use-image-failed";
import type { Device } from "./DeviceControls";
import { LiveEmbed, type LiveEmbedLabels } from "./LiveEmbed";
import { screenshotOf, type Presentation, type SitePanelProject } from "./site";

export type SitePanelLabels = LiveEmbedLabels & { blockedNote: string; internalNote: string };

/**
 * What the stage shows for one project, always something real and never an empty frame:
 * - `allowed`: the live site (`LiveEmbed`: click to load, poster and timeout fallback);
 * - `blocked-by-site`: a screenshot of its public page, the honest note that the site's own
 *   security settings forbid showing it here, and an "Open website" link;
 * - `no-public-url`: "Internal tool — not publicly accessible" and screenshots if there are any
 *   (no source-code link: repository URLs are never shown to visitors).
 * Without a screenshot (none captured, or it fails to load) it is a text presentation.
 *
 * `device` picks the desktop or the mobile screenshot; for a live site the surrounding device
 * frame sets the iframe's width instead. Build the props with `sitePanelProps` (server side).
 */
export function SitePanel({
  project,
  labels,
  device,
  onPresentation,
}: {
  project: SitePanelProject;
  labels: SitePanelLabels;
  device: Device;
  /** Told what is actually showing (e.g. text after a screenshot fails), for the stage's label. */
  onPresentation?: (presentation: Presentation) => void;
}) {
  const live = project.embed === "allowed" && project.liveUrl ? project.liveUrl : null;
  const shot = screenshotOf(project, device);
  const { failed, imgProps } = useImageFailed(live ? null : shot?.src);
  const presentation: Presentation = live ? "live" : shot && !failed ? "screenshot" : "text";

  useEffect(() => {
    onPresentation?.(presentation);
  }, [presentation, onPresentation]);

  const data = {
    "data-site-panel": "",
    "data-project": project.slug,
    "data-kind": project.embed,
    "data-presentation": presentation,
  };

  if (live) {
    return (
      <div {...data} className="site-panel">
        <LiveEmbed
          url={live}
          poster={shot?.src ?? null}
          title={project.name}
          pitch={project.pitch}
          labels={labels}
          className="live-embed--framed"
        />
      </div>
    );
  }

  const blocked = project.embed === "blocked-by-site";
  const note = blocked ? labels.blockedNote : labels.internalNote;
  const action =
    blocked && project.liveUrl ? (
      <ExternalLink href={project.liveUrl} newTab={labels.opensNewTab} primary>
        {labels.openWebsite}
      </ExternalLink>
    ) : null;

  if (presentation === "screenshot" && shot) {
    return (
      <figure {...data} data-shot={shot.kind} className="site-panel site-panel--shot">
        <div className="site-panel__image">
        {/* Images are served unoptimized (next.config.ts); next/image would add nothing here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          {...imgProps}
          className="site-panel__shot"
        />
        </div>
        <figcaption className="site-panel__overlay">
          <p className="site-panel__note">{note}</p>
          {action}
        </figcaption>
      </figure>
    );
  }

  return (
    <div {...data} className="site-panel site-panel--text">
      <div className="site-panel__text">
        <p className="viewer-kicker flex items-center gap-2">
          <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", blocked ? "bg-indigo" : "bg-teal")} />
          {blocked && project.liveUrl ? (
            <bdi dir="ltr" className="truncate">
              {new URL(project.liveUrl).host}
            </bdi>
          ) : (
            note
          )}
        </p>
        <p className="mt-4 text-2xl leading-tight font-semibold tracking-tight text-balance text-ink @md:text-3xl">
          {project.name}
        </p>
        <p className="mt-2 max-w-md text-base text-pretty text-ink-muted">{project.pitch}</p>
        {blocked && <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-pretty text-ink">{note}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

function ExternalLink({
  href,
  newTab,
  primary = false,
  children,
}: {
  href: string;
  newTab: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 rounded-full py-2.5 ps-5 pe-4 text-[0.9375rem] font-medium transition-colors duration-200",
        primary
          ? "hero-cta bg-indigo text-surface hover:bg-ink focus-visible:bg-ink"
          : "border border-mist bg-surface text-ink hover:border-indigo hover:text-indigo focus-visible:text-indigo",
      )}
    >
      {children}
      <span className="sr-only"> {newTab}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
      />
    </a>
  );
}
