"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import type { Diagram } from "@/content/diagrams";
import { useMotionOK } from "@/lib/motion";
import { TabPanel, Tabs } from "@/components/ui/Tabs";
import { NodePanel, type PanelLabels } from "./NodePanel";
import type { DiagramLayout } from "./layout";

type Project = Diagram["project"];
type Shape = Pick<DiagramLayout, "width" | "height" | "paths">;

export interface ViewNode {
  id: string;
  col: number;
  row: number;
  label: string;
  explain: string;
  /** Steps that feed this one. */
  from: { id: string; label: string }[];
  /** Steps this one feeds, with the connection's label where the data has one. */
  to: { id: string; label: string; edge: string | null }[];
  /** Accessible description: its connections, both ways. */
  description: string | null;
  /** Rendered technology icons (decorative). */
  glyphs: ReactNode;
  /** Rendered technology labels for the panel. */
  techs: ReactNode;
}

/** One project's diagram, prepared by the server component `TechDiagram`. */
export interface DiagramView {
  project: Project;
  tab: string;
  listLabel: string;
  grid: { steps: number; lanes: number };
  horizontal: Shape;
  vertical: Shape;
  /** Rendered labels of every technology in the project, shown before a step is selected. */
  stack: ReactNode;
  /** Rendered status pills of the project. */
  status: ReactNode;
  /** Connection labels drawn on the horizontal canvas; `start`/`top` in percent (logical). */
  edgeLabels: { from: string; to: string; text: string; start: number; top: number }[];
  nodes: ViewNode[];
}

export type CanvasLabels = PanelLabels & { tablist: string; caption: string; note: string };

/**
 * The interactive diagram. Layout is CSS only: a grid of equal cells (flow across from 640px,
 * down the page on phones, mirrored by the grid itself in RTL) with the SVG paths of the matching
 * orientation laid over it. State is the project and the selected step. The dashes run only
 * while the diagram is on screen and motion is welcome; they are decoration, as the caption says.
 */
export function DiagramCanvas({
  views,
  initial,
  labels,
}: {
  views: DiagramView[];
  initial: Project;
  labels: CanvasLabels;
}) {
  const idBase = `diagram${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [project, setProject] = useState<Project>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  // The step under the pointer or keyboard focus: its connections light up without selecting it.
  const [hot, setHot] = useState<string | null>(null);
  const lit = selected ?? hot;
  const view = views.find((v) => v.project === project) ?? views[0];
  const node = view.nodes.find((n) => n.id === selected) ?? null;
  const nodeId = (id: string) => `${idBase}-node-${id}`;
  const panelId = `${idBase}-explain`;

  const motionOK = useMotionOK();
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Phones: the sheet is sticky inside the diagram, so it can only pin to the bottom of the
  // screen while the diagram reaches that far, and it covers whatever is under it. When it is
  // not fully on screen, or would hide the selected step, scroll that step to the top (under the
  // header): the sheet then pins below it.
  useEffect(() => {
    if (!selected || !window.matchMedia("(width < 40rem)").matches) return;
    const frame = requestAnimationFrame(() => {
      const sheet = document.getElementById(panelId)?.getBoundingClientRect();
      const step = document.getElementById(`${idBase}-node-${selected}`)?.getBoundingClientRect();
      if (!sheet || !step) return;
      const header = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const fine = sheet.bottom <= innerHeight + 1 && sheet.top >= step.bottom && step.top >= header;
      if (!fine) window.scrollBy({ top: step.top - header - 12, behavior: motionOK ? "smooth" : "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected, panelId, idBase, motionOK]);

  /** Clears the selection and returns focus to the step that was selected. */
  const close = () => {
    const id = selected;
    setSelected(null);
    if (id) document.getElementById(nodeId(id))?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && selected) {
      event.preventDefault();
      close();
    }
  };

  const shapes = [
    ["horizontal", view.horizontal],
    ["vertical", view.vertical],
  ] as const;

  return (
    <div
      ref={root}
      data-diagram=""
      data-flow={motionOK && inView ? "on" : undefined}
      onKeyDown={onKeyDown}
      className="diagram-stage -mx-5 sm:-mx-8 md:mx-0"
    >
      <div className="diagram-stage__bar">
        <Tabs
          idBase={idBase}
          label={labels.tablist}
          items={views.map((v) => ({ id: v.project, label: v.tab }))}
          value={project}
          onChange={(id) => {
            setProject(id);
            setSelected(null);
            setHot(null);
          }}
          className="grid! w-full grid-cols-2 sm:flex! sm:w-auto"
        />
        <p className="diagram-kicker diagram-caption">
          <svg aria-hidden="true" viewBox="0 0 24 8" className="h-2 w-6 shrink-0 text-periwinkle">
            <path d="M2 4h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 5" />
          </svg>
          {labels.caption}
        </p>
      </div>

      <div className="diagram-body">
        <TabPanel idBase={idBase} id={view.project} className="diagram-canvas">
          <div
            data-diagram-canvas={view.project}
            data-lanes={view.grid.lanes}
            data-selection={lit ? "" : undefined}
            className="diagram-graph"
            style={{ "--steps": view.grid.steps, "--lanes": view.grid.lanes } as CSSProperties}
          >
            {shapes.map(([orientation, shape]) => (
              <svg
                key={orientation}
                data-orientation={orientation}
                aria-hidden="true"
                viewBox={`0 0 ${shape.width} ${shape.height}`}
                preserveAspectRatio="none"
                className={`diagram-svg diagram-svg--${orientation}`}
              >
                {shape.paths.map((path) => {
                  const active = lit !== null && (path.from === lit || path.to === lit);
                  return (
                    <g key={`${path.from}-${path.to}`} className="diagram-edge" data-active={active ? "" : undefined}>
                      <path d={path.d} className="diagram-track" />
                      <path d={path.d} className="diagram-flow" data-flow="" data-from={path.from} data-to={path.to} />
                    </g>
                  );
                })}
              </svg>
            ))}

            {view.edgeLabels.map((edge) => (
              <span
                key={`${edge.from}-${edge.to}`}
                aria-hidden="true"
                className="diagram-edge-label"
                data-active={lit === edge.from || lit === edge.to ? "" : undefined}
                style={{ insetInlineStart: `${edge.start}%`, insetBlockStart: `${edge.top}%` }}
              >
                <span data-edge-label="">{edge.text}</span>
              </span>
            ))}

            <ol aria-label={view.listLabel} className="diagram-grid">
              {view.nodes.map((n) => {
                const pressed = n.id === selected;
                const describedBy = n.description ? `${nodeId(n.id)}-links` : undefined;
                return (
                  <li
                    key={n.id}
                    className="diagram-cell"
                    style={{ "--col": n.col + 1, "--row": n.row + 1 } as CSSProperties}
                  >
                    <button
                      type="button"
                      id={nodeId(n.id)}
                      data-node={n.id}
                      aria-pressed={pressed}
                      aria-controls={panelId}
                      aria-describedby={describedBy}
                      onClick={() => setSelected(pressed ? null : n.id)}
                      onFocus={() => setHot(n.id)}
                      onBlur={() => setHot((h) => (h === n.id ? null : h))}
                      onPointerEnter={() => setHot(n.id)}
                      onPointerLeave={() => setHot((h) => (h === n.id ? null : h))}
                      className="diagram-node"
                    >
                      <span className="diagram-node__label">
                        <span aria-hidden="true" className="diagram-node__dot" />
                        {n.label}
                      </span>
                      {n.glyphs && (
                        <span aria-hidden="true" className="diagram-node__glyphs">
                          {n.glyphs}
                        </span>
                      )}
                    </button>
                    {describedBy && (
                      <span id={describedBy} hidden>
                        {n.description}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="diagram-note">
            <p className="diagram-kicker flex items-start gap-2">
              <span aria-hidden="true" className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-periwinkle" />
              {labels.note}
            </p>
            {view.status && (
              <div data-diagram-status="" className="flex flex-wrap gap-1.5">
                {view.status}
              </div>
            )}
          </div>
        </TabPanel>

        <NodePanel id={panelId} view={view} node={node} labels={labels} onClose={close} />
      </div>
    </div>
  );
}
