"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, RotateCw } from "lucide-react";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/media";
import { useMotionOK } from "@/lib/motion";
import { DeviceControls, devices, type Device } from "./DeviceControls";
import { DeviceFrame, frameScale, type FrameSize } from "./DeviceFrame";
import { panelId, ProjectRail, tabId, type RailItem } from "./ProjectRail";
import { SitePanel, type SitePanelLabels } from "./SitePanel";
import { intendedPresentation, type Presentation, type SitePanelProject } from "./site";

export type ViewerItem = RailItem & { site: SitePanelProject; variants?: { id: string; label: string; site: SitePanelProject }[] };

export type ViewerLabels = {
  rail: string;
  devices: string;
  pathways: string;
  reload: string;
  device: Record<Device, string>;
  /** The stage's kicker for each presentation. */
  preview: Record<Presentation, string>;
  site: SitePanelLabels;
};

/** How long the outgoing panel stays while the next one fades in. Matches `viewer-out` in CSS. */
const CROSSFADE_MS = 280;

/** The default device is the largest one that fits the stage at this scale or more. */
const MIN_DEFAULT_SCALE = 0.85;

/** Screenshots exist for these two; a live site can also be shown at tablet width. */
const SCREENSHOT_DEVICES = ["desktop", "phone"] as const satisfies readonly Device[];

/** On-screen height of the frame from 768px up: follows the window, within calm bounds. */
const frameBlock = () => Math.round(Math.min(680, Math.max(500, window.innerHeight - 230)));

/**
 * The interactive part of the project viewer. State is the selected project and the device.
 * Each project's stage is a `SitePanel`: the live site, a real screenshot, or a short text
 * presentation. Switching projects crossfades (instantly under reduced motion).
 *
 * Device controls: for a live site they set the frame's (and so the iframe's) width; for a
 * screenshot they pick the desktop or the mobile capture; with no screenshot they are hidden.
 */
export function ViewerStage({
  idBase,
  items,
  labels,
  infos,
  locale,
}: {
  idBase: string;
  items: ViewerItem[];
  labels: ViewerLabels;
  /** Each project's rendered `ProjectInfo`, in the order of `items`. */
  infos: ReactNode[];
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const [variantChoices, setVariantChoices] = useState<Record<string, number>>({});
  const [reload, setReload] = useState(0);
  // The visitor's explicit choice, if any; it persists across resizes and projects. Until then
  // the device follows the stage (resolved after mount, so the static HTML is always "desktop").
  const [choice, setChoice] = useState<Device | null>(null);
  const wide = useMediaQuery("(min-width: 48rem)");
  const motionOK = useMotionOK();

  // The space the frame may use: the width of the stage, and a height that follows the window.
  const area = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<FrameSize | null>(null);
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      const inline = el.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd);
      const block = frameBlock();
      setSize((prev) => (prev && prev.inline === inline && prev.block === block ? prev : { inline, block }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const activeItem = items[active];
  const variantIndex = variantChoices[activeItem.slug] ?? 0;
  const siteFor = (index: number) => items[index].variants?.[variantChoices[items[index].slug] ?? 0]?.site ?? items[index].site;
  const site = siteFor(active);
  const siteKey = `${site.slug}:${variantIndex}:${reload}`;
  const live = intendedPresentation(site, "desktop") === "live";
  const options: readonly Device[] = live ? devices : SCREENSHOT_DEVICES;

  // Default: desktop where it stays readable (scale of 0.85 or more, in practice from about
  // 1400px); otherwise tablet, which a 768px+ viewport shows at close to full size. Screenshots
  // exist only for desktop and phone, so for them tablet means the desktop capture.
  const fitting: Device =
    !size || frameScale("desktop", size.inline) >= MIN_DEFAULT_SCALE ? "desktop" : "tablet";
  const wanted = choice ?? fitting;
  const device: Device = options.includes(wanted) ? wanted : "desktop";
  // Below 768px the frame is always the phone layout.
  const shown: Device = wide ? device : "phone";

  // What the current panel actually shows (a screenshot can fail and become text).
  const [reported, setReported] = useState<{ slug: string; presentation: Presentation } | null>(null);
  const report = useCallback((slug: string, presentation: Presentation) => {
    setReported((prev) => (prev?.slug === slug && prev.presentation === presentation ? prev : { slug, presentation }));
  }, []);
  const presentation =
    reported?.slug === siteKey ? reported.presentation : intendedPresentation(site, shown);
  const controls = presentation !== "text" || intendedPresentation(site, shown) !== "text";

  // Crossfade: the outgoing panel stays on top while it fades out.
  const [previous, setPrevious] = useState(active);
  const [leaving, setLeaving] = useState<number | null>(null);
  if (previous !== active) {
    setPrevious(active);
    setLeaving(motionOK ? previous : null);
  }
  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, active]);

  const mounted = leaving !== null && leaving !== active ? [leaving, active] : [active];

  return (
    <div data-viewer="" className="min-w-0">
      <ProjectRail
        idBase={idBase}
        label={labels.rail}
        locale={locale}
        items={items}
        active={active}
        onSelect={setActive}
      />

      <div
        role="tabpanel"
        id={panelId(idBase)}
        aria-labelledby={tabId(idBase, items[active].slug)}
        className="grid min-w-0 gap-y-8"
      >
        <div data-stage="" className="viewer-stage min-w-0">
          {activeItem.variants && (
            <fieldset className="flex min-w-0 flex-wrap items-center gap-2 border-b border-mist bg-surface px-4 py-3">
              <legend className="sr-only">{labels.pathways}</legend>
              {activeItem.variants.map((variant, index) => (
                <label key={variant.id} className={cn("inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors focus-within:outline-2 focus-within:outline-indigo", index === variantIndex ? "border-indigo bg-indigo text-surface" : "border-mist bg-surface text-ink hover:border-indigo")}>
                  <input type="radio" name={`${idBase}-pathway`} value={variant.id} checked={index === variantIndex} onChange={() => setVariantChoices((previous) => ({ ...previous, [activeItem.slug]: index }))} className="sr-only" />
                  {variant.label}
                </label>
              ))}
            </fieldset>
          )}
          <div className="viewer-stage__bar">
            <p className="min-w-0 flex-1 truncate rounded-md border border-mist bg-surface px-3 py-2 text-xs text-ink-muted" dir="ltr">
              {site.liveUrl ? new URL(site.liveUrl).host + new URL(site.liveUrl).pathname : site.name}
            </p>
            {controls && (
              <DeviceControls
                name={`${idBase}-device`}
                label={labels.devices}
                labels={labels.device}
                options={options}
                value={device}
                onChange={setChoice}
                className="ms-auto hidden md:flex"
              />
            )}
            {live && <button type="button" aria-label={labels.reload} onClick={() => setReload((n) => n + 1)} className="flex size-10 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface hover:text-indigo"><RotateCw className="size-4" /></button>}
            {site.liveUrl && <a href={site.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${labels.site.openWebsite} ${labels.site.opensNewTab}`} className="flex size-10 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface hover:text-indigo"><ArrowUpRight className="size-4" /></a>}
          </div>
          <p className="px-4 pt-3 text-xs text-ink-muted" aria-live="polite">{labels.preview[presentation]}</p>

          <div ref={area} className="px-2 py-3 md:p-5">
            <DeviceFrame device={device} size={wide ? size : null} resetKey={siteKey}>
              {mounted.map((index) => {
                const out = index !== active;
                return (
                  <div
                    key={`${items[index].slug}:${variantChoices[items[index].slug] ?? 0}:${reload}`}
                    data-leaving={out ? "" : undefined}
                    data-current={out ? undefined : ""}
                    aria-hidden={out || undefined}
                    inert={out}
                    className={cn("viewer-panel", out && "viewer-panel--out")}
                  >
                    <SitePanel
                      project={siteFor(index)}
                      labels={labels.site}
                      device={shown}
                      onPresentation={out ? undefined : (p) => report(siteKey, p)}
                    />
                  </div>
                );
              })}
            </DeviceFrame>
          </div>
        </div>

        {/* All three are in the HTML; the others are laid over the current one, out of flow, so
            the height is always the current project's and the swap is a crossfade. */}
        <div className="relative min-w-0">
          {infos.map((info, i) => {
            const current = i === active;
            return (
              <div
                key={items[i].slug}
                aria-hidden={!current || undefined}
                inert={!current}
                className={cn(
                  "min-w-0 transition-[opacity,visibility] duration-300",
                  current ? "visible opacity-100" : "invisible absolute inset-x-0 top-0 opacity-0",
                )}
              >
                {info}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
