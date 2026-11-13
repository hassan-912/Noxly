import type { Diagram } from "@/content/diagrams";

/** Size of one grid cell in layout units. The canvas is a grid of equal cells, one node per cell. */
export const CELL = 100;

export interface DiagramLayout {
  /** Node centres, in layout units (physical: x grows to the right in both directions). */
  nodes: { id: string; x: number; y: number }[];
  /** One cubic path per edge, from the centre of `from` to the centre of `to`. */
  paths: { from: string; to: string; d: string }[];
  /** Canvas size in layout units: columns × CELL by rows × CELL. */
  width: number;
  height: number;
}

/** Grid size of a diagram: steps along the flow (`col`) and lanes across it (`row`). */
export function gridOf(d: Diagram): { steps: number; lanes: number } {
  return {
    steps: Math.max(...d.nodes.map((n) => n.col)) + 1,
    lanes: Math.max(...d.nodes.map((n) => n.row)) + 1,
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Where each node and path of a diagram goes. Pure.
 *
 * - horizontal: the flow (`col`) runs along x, lanes (`row`) down the page.
 * - vertical (phones): the flow runs down the page, lanes along x.
 * - rtl mirrors x, so the flow reads right to left.
 *
 * Node centres sit in the middle of grid cells, so the canvas can render the nodes with a CSS
 * grid of the same shape (which mirrors itself in RTL) and lay this SVG over it.
 */
export function layoutDiagram(
  d: Diagram,
  dir: "ltr" | "rtl",
  orientation: "horizontal" | "vertical",
): DiagramLayout {
  const { steps, lanes } = gridOf(d);
  const horizontal = orientation === "horizontal";
  const width = (horizontal ? steps : lanes) * CELL;
  const height = (horizontal ? lanes : steps) * CELL;

  const nodes = d.nodes.map((n) => {
    const across = (horizontal ? n.col : n.row) * CELL + CELL / 2;
    const down = (horizontal ? n.row : n.col) * CELL + CELL / 2;
    return { id: n.id, x: dir === "rtl" ? width - across : across, y: down };
  });

  const at = new Map(nodes.map((n) => [n.id, n]));
  const paths = d.edges.map(([from, to]) => {
    const a = at.get(from);
    const b = at.get(to);
    if (!a || !b) throw new Error(`${d.project}: edge ${from} → ${to} has no node`);
    // A smooth S-curve along the flow axis; a straight line when both nodes share a lane.
    const path = horizontal
      ? `M ${a.x} ${a.y} C ${round((a.x + b.x) / 2)} ${a.y} ${round((a.x + b.x) / 2)} ${b.y} ${b.x} ${b.y}`
      : `M ${a.x} ${a.y} C ${a.x} ${round((a.y + b.y) / 2)} ${b.x} ${round((a.y + b.y) / 2)} ${b.x} ${b.y}`;
    return { from, to, d: path };
  });

  return { nodes, paths, width, height };
}
