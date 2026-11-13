import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/i18n/en";
import { diagrams } from "../../src/content/diagrams";

const t = en.diagram;
const tabLabels = [t.tabs.review, t.tabs.consultation, t.tabs.calculator, t.tabs.mobile];
const byProject = (project: string) => diagrams.find((d) => d.project === project)!;
const projects = ["review", "consultation", "calculator", "mg-mobile"] as const;

const systems = (page: Page) => page.locator("section#systems");
const tablist = (page: Page) => systems(page).getByRole("tablist", { name: t.tablistLabel });
const tab = (page: Page, name: string) => tablist(page).getByRole("tab", { name, exact: true });
const nodes = (page: Page) => systems(page).locator("button[data-node]");
const node = (page: Page, id: string) => systems(page).locator(`button[data-node="${id}"]`);
const panel = (page: Page) => systems(page).locator("[data-node-panel]");
const live = (page: Page) => panel(page).locator('[aria-live="polite"]');
/** The dash layer of the orientation that is currently shown. */
const flows = (page: Page) => systems(page).locator("svg[data-orientation]:visible [data-flow]");

const overflowX = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function openDiagram(page: Page, locale: "en" | "ar" = "en") {
  await page.goto(`/${locale}/`);
  // The #work viewer above loads its demo when scrolled near and grows on phones: pass by it
  // and let it settle first, as a visitor scrolling down would, so positions here stay put.
  await page.locator("section#work").scrollIntoViewIfNeeded();
  const workHeight = () => page.locator("section#work").evaluate((el) => el.getBoundingClientRect().height);
  let before = -1;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(250);
    const now = await workHeight();
    if (now === before) break;
    before = now;
  }
  await tablist(page).scrollIntoViewIfNeeded();
  await expect(tablist(page)).toBeVisible();
}

/** Centre of a node's button on screen. */
async function centre(page: Page, id: string) {
  const box = (await node(page, id).boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

test("tabs switch between review, consultation, calculator, mobile with different node sets", async ({ page }) => {
  await openDiagram(page);
  await expect(tablist(page).getByRole("tab")).toHaveText(tabLabels);

  const seen = new Set<string>();
  for (const [i, project] of projects.entries()) {
    await tab(page, tabLabels[i]).click();
    await expect(tab(page, tabLabels[i])).toHaveAttribute("aria-selected", "true");
    const expected = byProject(project).nodes.map((n) => n.label.en);
    await expect(nodes(page)).toHaveText(expected.map((label) => new RegExp(label)));
    seen.add(expected.join("|"));
    // The canvas says which project it is, and the paths match its edges.
    await expect(systems(page).locator(`[data-diagram-canvas="${project}"]`)).toBeVisible();
    await expect(flows(page)).toHaveCount(byProject(project).edges.length);
  }
  expect(seen.size).toBe(4);

  // Arrow keys move between tabs (the shared tab primitive), mirrored in Arabic.
  await tab(page, t.tabs.review).click();
  await page.keyboard.press("ArrowRight");
  await expect(tab(page, t.tabs.consultation)).toBeFocused();
  await expect(tab(page, t.tabs.consultation)).toHaveAttribute("aria-selected", "true");

  await openDiagram(page, "ar");
  await tab(page, t.tabs.review).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tab(page, t.tabs.consultation)).toHaveAttribute("aria-selected", "true");
});

test("nodes are buttons; Enter selects and panel shows that node's explanation", async ({ page }) => {
  await openDiagram(page);
  const review = byProject("review");
  await expect(nodes(page)).toHaveCount(review.nodes.length);
  await expect(panel(page)).toContainText(t.hint);

  const processing = review.nodes.find((n) => n.id === "processing")!;
  const target = systems(page).getByRole("button", { name: new RegExp(processing.label.en) });
  await expect(target).toHaveAttribute("aria-pressed", "false");
  await target.focus();
  await page.keyboard.press("Enter");
  await expect(target).toHaveAttribute("aria-pressed", "true");
  await expect(live(page)).toContainText(processing.label.en);
  await expect(live(page)).toContainText(processing.explain.en);
  for (const name of ["Python", "PyMuPDF", "OCR", "Pydantic"]) await expect(live(page)).toContainText(name);

  // Its connections, both ways, with the edge's label where the data has one.
  const from = live(page).locator("[data-connections='from']");
  const to = live(page).locator("[data-connections='to']");
  await expect(from).toContainText(t.comesFrom);
  await expect(from.getByRole("listitem")).toHaveText(["Visa documents"]);
  await expect(to).toContainText(t.leadsTo);
  await expect(to.getByRole("listitem")).toHaveText([/^Factual checks/, /^AI-assisted review.*Selected narrative checks/]);
  // The button itself describes its connections to assistive tech.
  await expect(target).toHaveAccessibleDescription(/Comes from: Visa documents.*Leads to: Factual checks, AI-assisted review/);

  // Selected-node halo in indigo.
  await expect.poll(() => target.evaluate((el) => getComputedStyle(el).boxShadow)).toContain("rgba(82, 90, 255");

  // Another node replaces the explanation; pressing the selected one again clears it.
  const ai = review.nodes.find((n) => n.id === "ai-review")!;
  await node(page, "ai-review").click();
  await expect(live(page)).toContainText(ai.explain.en);
  await expect(live(page)).not.toContainText(processing.explain.en);
  await expect(target).toHaveAttribute("aria-pressed", "false");
  await node(page, "ai-review").press("Enter");
  await expect(live(page)).toContainText(t.hint);

  // Escape clears a selection too.
  await target.press("Enter");
  await expect(live(page)).toContainText(processing.explain.en);
  await page.keyboard.press("Escape");
  await expect(live(page)).toContainText(t.hint);
  await expect(target).toBeFocused();

  // Switching projects clears the selection.
  await target.press("Enter");
  await tab(page, t.tabs.calculator).click();
  await expect(live(page)).toContainText(t.hint);
});

test("each view notes it is the project's actual architecture, with its status and labelled connections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openDiagram(page);
  const note = systems(page).getByText(t.note, { exact: true });
  for (const label of tabLabels) {
    await tab(page, label).click();
    await expect(note).toBeVisible();
  }
  await tab(page, t.tabs.mobile).click();
  await expect(systems(page).locator("[data-diagram-status] [data-status]")).toHaveText(["In development", "Not released"]);
  await tab(page, t.tabs.review).click();
  await expect(systems(page).locator("[data-diagram-status] [data-status]")).toHaveText(["Internal tool"]);

  // Steps are cards with their technology icons (one per technology, up to five); a step with
  // no technology shows none. The canvas sits on a dotted grid.
  await expect(node(page, "processing").locator("svg")).toHaveCount(4);
  await expect(node(page, "documents").locator("svg")).toHaveCount(0);
  const canvasBg = await systems(page).locator(".diagram-canvas").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(canvasBg).toContain("radial-gradient");

  // Labelled connections that cross lanes carry their label on the canvas (from 640px).
  const edgeLabel = systems(page).locator("[data-edge-label]");
  await expect(edgeLabel).toHaveText(["Selected narrative checks"]);
  await expect(edgeLabel).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(edgeLabel).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 900 });
  // Every labelled connection in the data shows its label on its project's canvas.
  for (const [i, project] of projects.entries()) {
    await tab(page, tabLabels[i]).click();
    const expected = byProject(project).edges.flatMap(([, , label]) => (label ? [label.en] : []));
    await expect(edgeLabel, project).toHaveText(expected);
  }
  await tab(page, t.tabs.review).click();

  // Focusing (or hovering) a step highlights its connections without selecting it.
  await node(page, "checks").focus();
  const active = systems(page).locator("svg[data-orientation]:visible .diagram-edge[data-active] [data-flow]");
  await expect(active).toHaveCount(2);
  const ends = await active.evaluateAll((els) => els.map((el) => `${el.getAttribute("data-from")}>${el.getAttribute("data-to")}`));
  expect(ends.sort()).toEqual(["checks>report", "processing>checks"]);
  await expect(node(page, "checks")).toHaveAttribute("aria-pressed", "false");
});

test("caption 'Illustrative animation — not live traffic' is always visible", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openDiagram(page);
    for (const label of tabLabels) {
      await tab(page, label).click();
      await expect(systems(page).getByText("Illustrative animation — not live traffic", { exact: true })).toBeVisible();
    }
    await nodes(page).first().click();
    await expect(systems(page).getByText("Illustrative animation — not live traffic", { exact: true })).toBeVisible();
  }
});

test("dashes animate only while the diagram is in view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openDiagram(page);
  await systems(page).locator("[data-diagram-canvas]").scrollIntoViewIfNeeded();
  await expect
    .poll(() => flows(page).first().evaluate((el) => el.getAnimations().map((a) => a.playState).join()))
    .toBe("running");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => flows(page).first().evaluate((el) => el.getAnimations().length)).toBe(0);
});

test("reduced motion: path dash animation is not running", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDiagram(page);
  await systems(page).locator("[data-diagram-canvas]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  for (const label of tabLabels) {
    await tab(page, label).click();
    const states = await flows(page).evaluateAll((els) =>
      els.map((el) => ({ animations: el.getAnimations().length, name: getComputedStyle(el).animationName })),
    );
    expect(states.length).toBeGreaterThan(0);
    for (const s of states) expect(s).toEqual({ animations: 0, name: "none" });
  }
});

test("375px: vertical layout and panel as bottom sheet, no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const locale of ["en", "ar"] as const) {
    await openDiagram(page, locale);
    await expect(systems(page).locator('svg[data-orientation="vertical"]')).toBeVisible();
    await expect(systems(page).locator('svg[data-orientation="horizontal"]')).toBeHidden();

    // Flow runs down the page: each step sits below the previous one.
    const docs = await centre(page, "documents");
    const proc = await centre(page, "processing");
    const checks = await centre(page, "checks");
    const report = await centre(page, "report");
    expect(proc.y).toBeGreaterThan(docs.y + 20);
    expect(checks.y).toBeGreaterThan(proc.y + 20);
    expect(report.y).toBeGreaterThan(checks.y + 20);
    expect(Math.abs(docs.x - proc.x)).toBeLessThan(2);

    // Selecting a node opens the panel as a sheet attached to the bottom of the diagram.
    await expect(panel(page)).not.toHaveAttribute("data-open", "");
    await node(page, "processing").click();
    await expect(panel(page)).toHaveAttribute("data-open", "");
    // Once any scroll settles, the whole sheet is on screen, pinned to the bottom edge, and the
    // step it explains is visible above it (the sheet never hides it).
    const settled = () =>
      page.evaluate(() => {
        const sheet = document.querySelector("section#systems [data-node-panel]")!.getBoundingClientRect();
        const step = document.querySelector('section#systems button[data-node="processing"]')!.getBoundingClientRect();
        return { onScreen: sheet.top > 0 && sheet.bottom <= innerHeight + 1, stepAbove: step.top > 0 && step.bottom <= sheet.top + 1 };
      });
    await expect.poll(settled, { timeout: 8000 }).toEqual({ onScreen: true, stepAbove: true });
    await page.waitForTimeout(600);
    expect(await settled()).toEqual({ onScreen: true, stepAbove: true });
    const sheet = await panel(page).evaluate((el) => {
      const style = getComputedStyle(el);
      return { position: style.position, bottom: style.insetBlockEnd, width: el.getBoundingClientRect().width };
    });
    expect(sheet.position).toBe("sticky");
    expect(sheet.bottom).toBe("0px");
    expect(sheet.width).toBeGreaterThan(340);
    // Non-modal: the page still scrolls and nothing else is made inert.
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
    await expect(systems(page).locator("[inert]")).toHaveCount(0);

    await panel(page).getByRole("button", { name: t.close }).click();
    await expect(panel(page)).not.toHaveAttribute("data-open", "");
    await expect(node(page, "processing")).toBeFocused();

    for (const label of tabLabels) {
      await tab(page, label).click();
      expect(await overflowX(page), `${locale} ${label}`).toBeLessThanOrEqual(0);
    }
  }
});

test("horizontal from 640px: flow runs left to right in en and right to left in ar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openDiagram(page, "en");
  await expect(systems(page).locator('svg[data-orientation="horizontal"]')).toBeVisible();
  let a = await centre(page, "documents");
  let b = await centre(page, "processing");
  expect(b.x).toBeGreaterThan(a.x + 40);
  expect(Math.abs(a.y - b.y)).toBeLessThan(2);

  await openDiagram(page, "ar");
  a = await centre(page, "documents");
  b = await centre(page, "processing");
  expect(b.x).toBeLessThan(a.x - 40);
});

test("paths start and end inside their nodes at every width (en and ar)", async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "ar"] as const) {
      await openDiagram(page, locale);
      for (const label of tabLabels) {
        await tab(page, label).click();
        const misses = await systems(page).evaluate((section) => {
          const out: string[] = [];
          const svg = [...section.querySelectorAll<SVGSVGElement>("svg[data-orientation]")].find(
            (s) => s.getBoundingClientRect().width > 0,
          )!;
          const ctm = svg.getScreenCTM()!;
          for (const path of svg.querySelectorAll<SVGPathElement>("[data-flow]")) {
            const ends = [
              [path.dataset.from!, path.getPointAtLength(0)],
              [path.dataset.to!, path.getPointAtLength(path.getTotalLength())],
            ] as const;
            for (const [id, point] of ends) {
              const p = new DOMPoint(point.x, point.y).matrixTransform(ctm);
              const box = section.querySelector(`button[data-node="${id}"]`)!.getBoundingClientRect();
              if (p.x < box.left || p.x > box.right || p.y < box.top || p.y > box.bottom) {
                out.push(`${id} (${Math.round(p.x)}, ${Math.round(p.y)})`);
              }
            }
          }
          return out;
        });
        expect(misses, `${width} ${locale} ${label}`).toEqual([]);
      }
    }
  }
});

test("no horizontal overflow at 320–1440 in en and ar, on every tab", async ({ page }) => {
  test.setTimeout(180_000);
  for (const width of [320, 360, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "ar"] as const) {
      await openDiagram(page, locale);
      for (const label of tabLabels) {
        await tab(page, label).click();
        await nodes(page).first().click();
        expect(await overflowX(page), `${width} ${locale} ${label}`).toBeLessThanOrEqual(0);
        // Nodes stay inside the section.
        const outside = await systems(page).evaluate((section) => {
          const box = section.getBoundingClientRect();
          return [...section.querySelectorAll("button[data-node]")]
            .map((el) => el.getBoundingClientRect())
            .filter((r) => r.left < box.left - 0.5 || r.right > box.right + 0.5).length;
        });
        expect(outside, `${width} ${locale} ${label}`).toBe(0);
      }
    }
  }
});
