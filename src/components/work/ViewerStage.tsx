"use client";

import { Suspense, useDeferredValue, useEffect, useRef, useState, type ReactNode } from "react";
import type { DemoId, Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/media";
import { useMotionOK } from "@/lib/motion";
import { demoRegistry } from "@/components/demos/registry";
import { DeviceControls, type Device } from "./DeviceControls";
import { DeviceFrame, type FrameSize } from "./DeviceFrame";
import { panelId, ProjectRail, tabId, type RailItem } from "./ProjectRail";

export type ViewerItem = RailItem & { demo: DemoId };

export type ViewerLabels = {
  rail: string;
  devices: string;
  device: Record<Device, string>;
  preview: string;
  loading: string;
};

/** How long the outgoing demo stays while the next one fades in. Matches `viewer-out` in CSS. */
const CROSSFADE_MS = 280;

/** Start loading the demo when the viewer is within this distance of the viewport. */
const NEAR_MARGIN = "240px 0px";

/** On-screen height of the frame from 768px up: follows the window, within calm bounds. */
const frameBlock = () => Math.round(Math.min(680, Math.max(500, window.innerHeight - 230)));

/**
 * The interactive part of the project viewer. State is two things: the selected project and
 * the device. The demo of a project is a lazy chunk that is first requested when the viewer
 * nears the viewport; switching projects keeps the current demo on screen until the next one
 * is ready, then crossfades (instantly under reduced motion).
 */
export function ViewerStage({
  idBase,
  locale,
  items,
  labels,
  infos,
}: {
  idBase: string;
  locale: Locale;
  items: ViewerItem[];
  labels: ViewerLabels;
  /** Each project's rendered `ProjectInfo`, in the order of `items`. */
  infos: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const [device, setDevice] = useState<Device>("desktop");
  const wide = useMediaQuery("(min-width: 48rem)");
  const motionOK = useMotionOK();

  // Load the demo chunk only once the viewer is near the viewport.
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: NEAR_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

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

  // The demo follows the selection as a deferred value: while the next demo's chunk loads, the
  // current one stays on screen instead of a loading state.
  const shown = useDeferredValue(active);
  const [previous, setPrevious] = useState(shown);
  const [leaving, setLeaving] = useState<number | null>(null);
  if (previous !== shown) {
    setPrevious(shown);
    setLeaving(motionOK ? previous : null);
  }
  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, shown]);

  const mounted = leaving !== null && leaving !== shown ? [leaving, shown] : [shown];

  return (
    <div
      ref={root}
      data-viewer=""
      className="grid gap-x-6 gap-y-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start"
    >
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
        className="grid min-w-0 gap-x-6 gap-y-8 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start"
      >
        <div data-stage="" className="viewer-stage -mx-5 min-w-0 sm:-mx-8 md:mx-0">
          <div className="viewer-stage__bar">
            <p className="viewer-kicker flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-indigo" />
              <span className="truncate">{labels.preview}</span>
            </p>
            <DeviceControls
              name={`${idBase}-device`}
              label={labels.devices}
              labels={labels.device}
              value={device}
              onChange={setDevice}
              className="ms-auto hidden md:flex"
            />
          </div>

          <div ref={area} className="px-2 py-3 md:p-5">
            <DeviceFrame device={device} size={wide ? size : null} resetKey={shown}>
              {near ? (
                <Suspense fallback={<Placeholder>{labels.loading}</Placeholder>}>
                  {mounted.map((index) => {
                    const Demo = demoRegistry[items[index].demo];
                    const out = index !== shown;
                    return (
                      <div
                        key={items[index].slug}
                        data-leaving={out ? "" : undefined}
                        aria-hidden={out || undefined}
                        inert={out}
                        className={cn("viewer-demo", out && "viewer-demo--out")}
                      >
                        <Demo locale={locale} />
                      </div>
                    );
                  })}
                </Suspense>
              ) : (
                <Placeholder />
              )}
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

/** Holds the frame open before the demo arrives. Says "loading" only while a chunk is loading. */
function Placeholder({ children }: { children?: ReactNode }) {
  return (
    <div className="grid min-h-[26rem] place-items-center p-6">
      {children && (
        <p role="status" className="viewer-kicker">
          {children}
        </p>
      )}
    </div>
  );
}
