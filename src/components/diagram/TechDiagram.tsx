import { diagrams, type Diagram } from "@/content/diagrams";
import type { Locale, TechId } from "@/content/types";
import { dirOf, getDictionary, getProject } from "@/lib/i18n";
import { StatusPill } from "@/components/ui/StatusPill";
import { TechIcon, TechLabel } from "@/components/ui/TechLabel";
import { DiagramCanvas, type DiagramView } from "./DiagramCanvas";
import { gridOf, layoutDiagram } from "./layout";

/** Most glyphs a node shows; the panel lists every technology by name. */
const MAX_GLYPHS = 5;

function TechList({ ids, labelledBy }: { ids: TechId[]; labelledBy?: string }) {
  return (
    <ul aria-labelledby={labelledBy} className="mt-2.5 flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <li key={id} className="max-w-full">
          <TechLabel id={id} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The interactive technology diagram: one architecture per project (tabs), with selectable steps
 * and an explanation panel. This server component prepares each project's view — localized text,
 * each step's connections, the SVG paths for both orientations in the page's direction, and the
 * technology icons, labels and status pills already rendered — so the client part carries neither
 * the icon sets nor the other locales' copy.
 */
export function TechDiagram({ locale, initial = "review" }: { locale: Locale; initial?: Diagram["project"] }) {
  const t = getDictionary(locale).diagram;
  const dir = dirOf(locale);

  const views: DiagramView[] = diagrams.map((d) => {
    const tab = t.tabs[d.project === "mg-mobile" ? "mobile" : d.project];
    const labelOf = (id: string) => d.nodes.find((n) => n.id === id)!.label[locale];
    const stack = [...new Set(d.nodes.flatMap((n) => n.tech))];
    const horizontal = layoutDiagram(d, dir, "horizontal");
    const vertical = layoutDiagram(d, dir, "vertical");
    const at = new Map(horizontal.nodes.map((n) => [n.id, n]));
    const laneOf = (id: string) => d.nodes.find((n) => n.id === id)!.row;
    const status = getProject(d.project).status;

    return {
      project: d.project,
      tab,
      listLabel: t.stepsLabel.replace("{project}", tab),
      grid: gridOf(d),
      horizontal: { width: horizontal.width, height: horizontal.height, paths: horizontal.paths },
      vertical: { width: vertical.width, height: vertical.height, paths: vertical.paths },
      stack: stack.length > 0 ? <TechList ids={stack} labelledBy={`diagram-stack-${d.project}`} /> : null,
      status:
        status.length > 0 ? (
          <>
            {status.map((key) => (
              <StatusPill key={key} status={key} locale={locale} />
            ))}
          </>
        ) : null,
      // Labels go on the canvas only where a connection crosses lanes: there is open space at its
      // middle. Every label is also in the panel. Positions are logical (start edge), in percent.
      edgeLabels: d.edges.flatMap(([from, to, label]) => {
        if (!label || laneOf(from) === laneOf(to)) return [];
        const x = ((at.get(from)!.x + at.get(to)!.x) / 2 / horizontal.width) * 100;
        const y = ((at.get(from)!.y + at.get(to)!.y) / 2 / horizontal.height) * 100;
        return [{ from, to, text: label[locale], start: dir === "rtl" ? 100 - x : x, top: y }];
      }),
      nodes: d.nodes.map((n) => {
        const from = d.edges.filter(([, to]) => to === n.id).map(([id]) => ({ id, label: labelOf(id) }));
        const to = d.edges
          .filter(([source]) => source === n.id)
          .map(([, id, label]) => ({ id, label: labelOf(id), edge: label?.[locale] ?? null }));
        const description = [
          from.length > 0 ? `${t.comesFrom}: ${from.map((c) => c.label).join(", ")}.` : "",
          to.length > 0 ? `${t.leadsTo}: ${to.map((c) => c.label).join(", ")}.` : "",
        ]
          .filter(Boolean)
          .join(" ");
        return {
          id: n.id,
          col: n.col,
          row: n.row,
          label: n.label[locale],
          explain: n.explain[locale],
          from,
          to,
          description: description || null,
          glyphs:
            n.tech.length > 0 ? (
              <>
                {n.tech.slice(0, MAX_GLYPHS).map((id) => (
                  <TechIcon key={id} id={id} className="size-3.5 shrink-0" />
                ))}
              </>
            ) : null,
          techs: n.tech.length > 0 ? <TechList ids={n.tech} labelledBy={`diagram-techs-${d.project}-${n.id}`} /> : null,
        };
      }),
    };
  });

  return (
    <DiagramCanvas
      views={views}
      initial={initial}
      labels={{
        tablist: t.tablistLabel,
        caption: t.caption,
        hint: t.hint,
        technologies: t.technologies,
        close: t.close,
        note: t.note,
        connections: t.connections,
        comesFrom: t.comesFrom,
        leadsTo: t.leadsTo,
      }}
    />
  );
}
