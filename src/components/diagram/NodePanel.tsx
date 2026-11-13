import { ArrowLeft, ArrowRight, MousePointerClick, X } from "lucide-react";
import type { DiagramView, ViewNode } from "./DiagramCanvas";

export type PanelLabels = {
  hint: string;
  technologies: string;
  close: string;
  connections: string;
  comesFrom: string;
  leadsTo: string;
};

/**
 * What the selected step does, with which technologies, and what it connects to and from. A
 * side panel from 1024px, a block under the canvas on tablets, and on phones a bottom sheet:
 * sticky to the bottom of the screen while the diagram is in view, attached to the diagram (not
 * a modal: nothing is locked or made inert). Before a step is selected it shows a hint and, from
 * 640px, the project's technologies.
 *
 * The content is a polite live region, so a new selection is read out without moving focus.
 */
export function NodePanel({
  id,
  view,
  node,
  labels,
  onClose,
}: {
  id: string;
  view: DiagramView;
  node: ViewNode | null;
  labels: PanelLabels;
  onClose: () => void;
}) {
  return (
    <div id={id} data-node-panel="" data-open={node ? "" : undefined} className="diagram-panel">
      {node && <span aria-hidden="true" className="diagram-panel__grabber" />}
      <div aria-live="polite" className="min-w-0">
        {node ? (
          <>
            <p className="diagram-kicker">{view.tab}</p>
            <h3 className="diagram-panel__title mt-1.5 text-lg leading-snug font-semibold tracking-tight text-ink">
              {node.label}
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-ink-muted">{node.explain}</p>
            {node.techs && (
              <div className="mt-5">
                <p id={`diagram-techs-${view.project}-${node.id}`} className="diagram-kicker">
                  {labels.technologies}
                </p>
                {node.techs}
              </div>
            )}
            {(node.from.length > 0 || node.to.length > 0) && (
              <div className="mt-5">
                <p className="diagram-kicker">{labels.connections}</p>
                <div className="mt-2.5 grid gap-3">
                  {node.from.length > 0 && <Connections kind="from" title={labels.comesFrom} items={node.from} />}
                  {node.to.length > 0 && <Connections kind="to" title={labels.leadsTo} items={node.to} />}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-ink">
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-lg bg-indigo/10 text-indigo"
              >
                <MousePointerClick className="size-4" strokeWidth={1.75} />
              </span>
              <span className="pt-1">{labels.hint}</span>
            </p>
            {view.stack && (
              <div className="mt-6 hidden sm:block">
                <p id={`diagram-stack-${view.project}`} className="diagram-kicker">
                  {labels.technologies}
                </p>
                {view.stack}
              </div>
            )}
          </>
        )}
      </div>
      {node && (
        <button type="button" onClick={onClose} className="diagram-panel__close sm:hidden">
          <X aria-hidden="true" className="size-4" strokeWidth={2} />
          <span className="sr-only">{labels.close}</span>
        </button>
      )}
    </div>
  );
}

/** One direction of a step's connections: a short heading and the steps, as a list. */
function Connections({
  kind,
  title,
  items,
}: {
  kind: "from" | "to";
  title: string;
  items: { id: string; label: string; edge?: string | null }[];
}) {
  const Arrow = kind === "from" ? ArrowLeft : ArrowRight;
  return (
    <div data-connections={kind} className="diagram-connections">
      <p className="text-xs font-medium text-ink-muted">{title}</p>
      <ul className="mt-1.5 grid gap-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex min-w-0 items-start gap-2 text-sm leading-snug text-ink">
            <Arrow aria-hidden="true" className="diagram-connections__arrow mt-0.5 size-3.5 shrink-0 text-periwinkle" />
            <span className="min-w-0">
              {item.label}
              {item.edge && <span className="block text-xs text-ink-muted">{item.edge}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
