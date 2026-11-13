import { describe, expect, test } from "vitest";
import { diagrams } from "@/content/diagrams";
import { layoutDiagram } from "@/components/diagram/layout";

const dirs = ["ltr", "rtl"] as const;
const orientations = ["horizontal", "vertical"] as const;

/** Every number in an SVG path, in order. */
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

const positions = (d: (typeof diagrams)[number], dir: "ltr" | "rtl", orientation: "horizontal" | "vertical") => {
  const layout = layoutDiagram(d, dir, orientation);
  return { layout, at: new Map(layout.nodes.map((n) => [n.id, n])) };
};

describe("layoutDiagram", () => {
  test("ltr: x increases with col; rtl: x decreases with col", () => {
    for (const d of diagrams) {
      const ltr = positions(d, "ltr", "horizontal").at;
      const rtl = positions(d, "rtl", "horizontal").at;
      for (const a of d.nodes) {
        for (const b of d.nodes) {
          if (a.col < b.col) {
            expect(ltr.get(a.id)!.x, `${d.project} ltr ${a.id} < ${b.id}`).toBeLessThan(ltr.get(b.id)!.x);
            expect(rtl.get(a.id)!.x, `${d.project} rtl ${a.id} > ${b.id}`).toBeGreaterThan(rtl.get(b.id)!.x);
          }
          if (a.col === b.col) expect(ltr.get(a.id)!.x).toBe(ltr.get(b.id)!.x);
          // Lanes run down the page in both directions.
          if (a.row < b.row) {
            expect(ltr.get(a.id)!.y).toBeLessThan(ltr.get(b.id)!.y);
            expect(rtl.get(a.id)!.y).toBeLessThan(rtl.get(b.id)!.y);
          }
        }
      }
    }
  });

  test("vertical: y increases with col, x by row", () => {
    for (const d of diagrams) {
      const ltr = positions(d, "ltr", "vertical").at;
      const rtl = positions(d, "rtl", "vertical").at;
      for (const a of d.nodes) {
        for (const b of d.nodes) {
          if (a.col < b.col) {
            expect(ltr.get(a.id)!.y, `${d.project} ${a.id} above ${b.id}`).toBeLessThan(ltr.get(b.id)!.y);
            expect(rtl.get(a.id)!.y).toBeLessThan(rtl.get(b.id)!.y);
          }
          if (a.row < b.row) {
            expect(ltr.get(a.id)!.x, `${d.project} ltr lane ${a.id} before ${b.id}`).toBeLessThan(ltr.get(b.id)!.x);
            expect(rtl.get(a.id)!.x, `${d.project} rtl lane ${a.id} before ${b.id}`).toBeGreaterThan(rtl.get(b.id)!.x);
          }
          if (a.row === b.row) expect(ltr.get(a.id)!.x).toBe(ltr.get(b.id)!.x);
        }
      }
    }
  });

  test("every edge has a path whose endpoints sit on its nodes", () => {
    for (const d of diagrams) {
      for (const dir of dirs) {
        for (const orientation of orientations) {
          const { layout, at } = positions(d, dir, orientation);
          const label = `${d.project} ${dir} ${orientation}`;
          expect(layout.nodes.map((n) => n.id).sort(), label).toEqual(d.nodes.map((n) => n.id).sort());
          expect(layout.paths, label).toHaveLength(d.edges.length);
          for (const [from, to] of d.edges) {
            const path = layout.paths.find((p) => p.from === from && p.to === to);
            expect(path, `${label}: ${from} → ${to}`).toBeDefined();
            const n = numbers(path!.d);
            expect(path!.d.trim().startsWith("M"), label).toBe(true);
            expect([n[0], n[1]], `${label}: start of ${from} → ${to}`).toEqual([at.get(from)!.x, at.get(from)!.y]);
            expect(n.slice(-2), `${label}: end of ${from} → ${to}`).toEqual([at.get(to)!.x, at.get(to)!.y]);
          }
        }
      }
    }
  });

  test("nodes stay inside the canvas; rtl mirrors ltr", () => {
    for (const d of diagrams) {
      for (const orientation of orientations) {
        const ltr = positions(d, "ltr", orientation);
        const rtl = positions(d, "rtl", orientation);
        expect(rtl.layout.width).toBe(ltr.layout.width);
        expect(rtl.layout.height).toBe(ltr.layout.height);
        for (const n of ltr.layout.nodes) {
          expect(n.x).toBeGreaterThan(0);
          expect(n.x).toBeLessThan(ltr.layout.width);
          expect(n.y).toBeGreaterThan(0);
          expect(n.y).toBeLessThan(ltr.layout.height);
          expect(rtl.at.get(n.id)!.x).toBe(ltr.layout.width - n.x);
          expect(rtl.at.get(n.id)!.y).toBe(n.y);
        }
      }
    }
  });
});

describe("diagram data", () => {
  // The canvas draws a connection's label in the open space where it changes lanes; between two
  // steps on one lane there is no room, so a labelled connection must cross lanes.
  test("every labelled connection crosses lanes", () => {
    for (const d of diagrams) {
      const row = new Map(d.nodes.map((n) => [n.id, n.row]));
      for (const [from, to, label] of d.edges) {
        if (label) expect(row.get(from), `${d.project}: ${from} → ${to}`).not.toBe(row.get(to));
      }
    }
  });
});
