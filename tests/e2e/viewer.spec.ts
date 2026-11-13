import { expect, test, type Locator, type Page } from "@playwright/test";
import { en } from "../../src/content/i18n/en";
import { getProjects, getProject } from "../../src/lib/i18n";
import { tech } from "../../src/content/tech";

const v = en.viewer;
const featured = getProjects("featured");
const [review, calculator, consultation] = featured;
const qr = getProject("qr-studio");
const QR_ORIGIN = "https://queue-r-code.vercel.app";

const work = (page: Page) => page.locator("section#work");
const rail = (page: Page) => work(page).getByRole("tablist", { name: v.railLabel });
const tabs = (page: Page) => rail(page).getByRole("tab");
/** The rail's panel (the demos inside the stage have tab panels of their own). */
const panel = (page: Page) => work(page).locator('[role="tabpanel"][aria-labelledby^="work-tab-"]');
const frame = (page: Page) => work(page).locator("[data-frame-viewport]");

/** Opens the home page and brings the viewer on screen, so its demo loads. */
async function openViewer(page: Page, locale: "en" | "ar" = "en") {
  await page.goto(`/${locale}/`);
  await rail(page).scrollIntoViewIfNeeded();
  await expect(work(page).locator("[data-demo]").first()).toBeVisible();
}

async function expectSelected(page: Page, index: number) {
  for (let i = 0; i < 3; i++) {
    await expect(tabs(page).nth(i)).toHaveAttribute("aria-selected", i === index ? "true" : "false");
  }
  await expect(tabs(page).nth(index)).toBeFocused();
}

const overflowX = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

/** Visible elements inside `root` that stick out of it on the inline axis. */
async function overflowOf(root: Locator) {
  return root.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const out: string[] = [];
    for (const node of el.querySelectorAll<HTMLElement>("*")) {
      const r = node.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.left < box.left - 0.5 || r.right > box.right + 0.5) {
        out.push(`${node.tagName.toLowerCase()}.${String(node.className).slice(0, 60)} [${r.left}, ${r.right}]`);
      }
    }
    return out;
  });
}

test("rail is a tablist; ArrowRight/ArrowLeft move selection (mirrored in ar)", async ({ page }) => {
  await openViewer(page, "en");
  await expect(tabs(page)).toHaveCount(3);
  for (const [i, project] of featured.entries()) {
    await expect(tabs(page).nth(i)).toContainText(`0${i + 1}`);
    await expect(tabs(page).nth(i)).toContainText(project.text.en.name);
  }
  // Only the selected tab is in the tab order, and it controls the panel.
  await expect(tabs(page).nth(0)).toHaveAttribute("tabindex", "0");
  await expect(tabs(page).nth(1)).toHaveAttribute("tabindex", "-1");
  await expect(panel(page)).toHaveAttribute("id", (await tabs(page).nth(0).getAttribute("aria-controls"))!);

  await tabs(page).nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expectSelected(page, 1);
  await page.keyboard.press("ArrowRight");
  await expectSelected(page, 2);
  await page.keyboard.press("ArrowLeft");
  await expectSelected(page, 1);
  await page.keyboard.press("Home");
  await expectSelected(page, 0);
  await page.keyboard.press("End");
  await expectSelected(page, 2);

  await openViewer(page, "ar");
  await tabs(page).nth(0).focus();
  await page.keyboard.press("ArrowLeft");
  await expectSelected(page, 1);
  await page.keyboard.press("ArrowLeft");
  await expectSelected(page, 2);
  await page.keyboard.press("ArrowRight");
  await expectSelected(page, 1);
});

test("switching project updates title, counter '02 / 03', stack labels and links", async ({ page }) => {
  await openViewer(page);
  await expect(panel(page).getByRole("heading", { level: 3 })).toHaveText(review.text.en.name);
  await expect(panel(page).getByText("01 / 03", { exact: true })).toBeVisible();
  await expect(panel(page).getByText(tech.streamlit.name, { exact: true })).toBeVisible();

  await tabs(page).nth(1).click();
  await expect(panel(page).getByRole("heading", { level: 3 })).toHaveText(calculator.text.en.name);
  await expect(panel(page).getByText("02 / 03", { exact: true })).toBeVisible();
  await expect(panel(page).getByText("01 / 03", { exact: true })).toBeHidden();
  await expect(panel(page).getByText(calculator.text.en.pitch, { exact: true })).toBeVisible();

  const stack = panel(page).getByRole("list", { name: v.stack });
  await expect(stack).toHaveCount(1);
  await expect(stack.getByRole("listitem")).toHaveText(calculator.stack.map((id) => tech[id].name));
  await expect(panel(page).getByText(tech.streamlit.name, { exact: true })).toBeHidden();

  await expect(panel(page).getByRole("link", { name: v.repo })).toHaveAttribute("href", calculator.repo!);
  await expect(panel(page).getByRole("link", { name: v.caseStudy })).toHaveAttribute("href", "/en/work/calculator/");
  // The stage shows the matching demo.
  await expect(work(page).locator('[data-demo="calculator"]')).toBeVisible();
  await expect(work(page).locator('[data-demo="review"]')).toHaveCount(0);
});

test("device radio group sets frame width: desktop ≥ 960, tablet 768, phone 390 (clamped to viewport)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openViewer(page);
  const group = work(page).getByRole("radiogroup", { name: v.devicesLabel });
  const width = () => frame(page).evaluate((el) => el.clientWidth);
  const fits = async () => {
    const stage = await work(page).locator("[data-stage]").boundingBox();
    const box = await frame(page).boundingBox();
    return box!.x >= stage!.x - 0.5 && box!.x + box!.width <= stage!.x + stage!.width + 0.5;
  };

  await expect(group.getByRole("radio")).toHaveCount(3);
  await expect(group.getByRole("radio", { name: v.desktop })).toBeChecked();
  await expect.poll(width).toBeGreaterThanOrEqual(960);
  // At 960px+ the demo is in its widest layout (side panels need a 920px container).
  expect(await work(page).locator("[data-demo]").evaluate((el) => el.clientWidth)).toBeGreaterThanOrEqual(920);

  await group.getByRole("radio", { name: v.tablet }).check();
  await expect.poll(width).toBe(768);
  await group.getByRole("radio", { name: v.phone }).check();
  await expect.poll(width).toBe(390);
  expect(await work(page).locator("[data-demo]").evaluate((el) => el.clientWidth)).toBe(390);
  expect(await fits()).toBe(true);

  // Arrow keys move through the radio group.
  await page.keyboard.press("ArrowLeft");
  await expect(group.getByRole("radio", { name: v.tablet })).toBeChecked();
  await expect.poll(width).toBe(768);

  // On a narrower stage the frame keeps its device width and is scaled to stay inside the stage.
  for (const viewport of [1024, 768]) {
    await page.setViewportSize({ width: viewport, height: 900 });
    await group.getByRole("radio", { name: v.desktop }).check();
    await expect.poll(width).toBeGreaterThanOrEqual(960);
    await expect.poll(fits).toBe(true);
    await expect.poll(() => overflowX(page), { message: `@${viewport}` }).toBeLessThanOrEqual(0);
  }
});

test("the default device is the largest that stays readable: tablet at 768px, desktop at 1440px", async ({ page }) => {
  const group = work(page).getByRole("radiogroup", { name: v.devicesLabel });
  const width = () => frame(page).evaluate((el) => el.clientWidth);
  const scale = async () => (await frame(page).boundingBox())!.width / (await width());

  await page.setViewportSize({ width: 768, height: 900 });
  await openViewer(page);
  await expect(group.getByRole("radio", { name: v.tablet })).toBeChecked();
  await expect.poll(width).toBe(768);
  await expect.poll(scale).toBeGreaterThan(0.8);

  await page.setViewportSize({ width: 1440, height: 900 });
  await openViewer(page);
  await expect(group.getByRole("radio", { name: v.desktop })).toBeChecked();
  await expect.poll(width).toBeGreaterThanOrEqual(960);
  await expect.poll(scale).toBeGreaterThanOrEqual(0.85);

  // Without a choice the default follows the stage; an explicit choice survives resizes.
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(group.getByRole("radio", { name: v.tablet })).toBeChecked();
  await group.getByRole("radio", { name: v.phone }).check();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(group.getByRole("radio", { name: v.phone })).toBeChecked();
  await expect.poll(width).toBe(390);
});

test("device controls are hidden below 768px viewport and frame shows phone layout", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    for (const viewport of [320, 360, 375, 767]) {
      await page.setViewportSize({ width: viewport, height: 800 });
      await openViewer(page, locale);
      await expect(work(page).getByRole("radiogroup", { name: v.devicesLabel })).toBeHidden();
      const width = await frame(page).evaluate((el) => el.clientWidth);
      expect(width, `${locale} @${viewport}`).toBeLessThanOrEqual(Math.min(390, viewport));
      expect(width, `${locale} @${viewport}`).toBeGreaterThanOrEqual(Math.min(390, viewport) - 48);
      // Phone layout: the frame is not scaled.
      const box = await frame(page).boundingBox();
      expect(Math.round(box!.width), `${locale} @${viewport}`).toBe(width);
      expect(await overflowX(page), `${locale} @${viewport}`).toBeLessThanOrEqual(0);
    }
  }
});

test("the viewer never overflows horizontally, for every project, in en and ar", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    for (const viewport of [320, 360, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width: viewport, height: 900 });
      await openViewer(page, locale);
      for (let i = 0; i < 3; i++) {
        await tabs(page).nth(i).click();
        await expect(work(page).locator(`[data-demo="${featured[i].demo}"]`)).toBeVisible();
        const at = `${locale} @${viewport} ${featured[i].slug}`;
        // Only this project's details are showing (the previous ones have finished fading out).
        const info = (slug: string) => panel(page).locator(`[data-project-info="${slug}"]`);
        await expect(info(featured[i].slug)).toBeVisible();
        for (const other of featured) if (other !== featured[i]) await expect(info(other.slug)).toBeHidden();
        expect(await overflowX(page), at).toBeLessThanOrEqual(0);
        expect(await overflowOf(info(featured[i].slug)), at).toEqual([]);
        if (viewport < 768) expect(await overflowOf(work(page).locator(`[data-demo="${featured[i].demo}"]`)), at).toEqual([]);
      }
    }
  }
});

test("demo chunk is not requested until viewer is near viewport", async ({ page }) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/en/");
  await page.waitForLoadState("networkidle");
  // Hydrated, at the top of the page: the placeholder is there, the demo and its chunk are not.
  await expect(page.locator("h1")).toBeInViewport();
  await page.waitForTimeout(500);
  await expect(page.locator("[data-demo]")).toHaveCount(0);
  const before = new Set(scripts);
  expect(before.size).toBeGreaterThan(0);

  await rail(page).scrollIntoViewIfNeeded();
  await expect(work(page).locator('[data-demo="review"]')).toBeVisible();
  const after = scripts.filter((url) => !before.has(url));
  expect(after.length, "the demo arrives as its own chunk, requested after scrolling").toBeGreaterThan(0);

  // The other demos stay unrequested until their project is selected.
  const loaded = scripts.length;
  await tabs(page).nth(1).click();
  await expect(work(page).locator('[data-demo="calculator"]')).toBeVisible();
  expect(scripts.length).toBeGreaterThan(loaded);
});

test("consultation shows 'Visit site' external link with rel=noopener and no iframe", async ({ page }) => {
  await openViewer(page);
  await expect(panel(page).getByRole("link", { name: v.visitSite })).toHaveCount(0);
  await tabs(page).nth(2).click();
  await expect(work(page).locator('[data-demo="consultation"]')).toBeVisible();
  const visit = panel(page).getByRole("link", { name: v.visitSite });
  await expect(visit).toBeVisible();
  await expect(visit).toHaveAttribute("href", "https://consultatioin.vercel.app");
  await expect(visit).toHaveAttribute("target", "_blank");
  await expect(visit).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(visit).toContainText(v.opensNewTab);
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("each project links repo and case study; links open correct URLs", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    await openViewer(page, locale);
    for (const [i, project] of featured.entries()) {
      await tabs(page).nth(i).click();
      const repo = panel(page).getByRole("link", { name: v.repo });
      await expect(repo).toHaveCount(1);
      await expect(repo).toHaveAttribute("href", project.repo!);
      await expect(repo).toHaveAttribute("target", "_blank");
      await expect(repo).toHaveAttribute("rel", /\bnoopener\b/);
      const caseStudy = panel(page).getByRole("link", { name: v.caseStudy });
      await expect(caseStudy).toHaveCount(1);
      await expect(caseStudy).toHaveAttribute("href", `/${locale}/work/${project.slug}/`);
      await expect(caseStudy).not.toHaveAttribute("target", "_blank");
      // Featured projects are solo work: no authorship badge (ruling R7).
      await expect(panel(page).getByText(en.authorship.solo)).toHaveCount(0);
      await expect(panel(page).getByText(en.authorship.shared)).toHaveCount(0);
    }
  }
  expect(review.repo).toBe("https://github.com/hassan-912/Review-Project");
  expect(calculator.repo).toBe("https://github.com/hassan-912/Visa-File-Strength-Calculator");
  expect(consultation.repo).toBe("https://github.com/hassan-912/consultatioin");
});

test.describe("LiveEmbed", () => {
  const embed = (page: Page) => page.locator("[data-live-embed]");
  const external = (page: Page) => embed(page).getByRole("link", { name: v.visitSite });

  test("LiveEmbed: no iframe before click; after click iframe src is queue-r-code.vercel.app", async ({ page }) => {
    const hits: string[] = [];
    await page.route(`${QR_ORIGIN}/**`, (route) => {
      hits.push(route.request().url());
      return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>stub</title><h1>QR stub</h1>" });
    });
    await page.goto("/en/demo-lab/");
    await embed(page).scrollIntoViewIfNeeded();
    await expect(embed(page).locator("[data-live-poster]")).toBeVisible();
    await expect(external(page)).toHaveAttribute("href", QR_ORIGIN);
    await expect(external(page)).toHaveAttribute("rel", /\bnoopener\b/);
    await page.waitForTimeout(300);
    await expect(page.locator("iframe")).toHaveCount(0);
    expect(hits, "nothing is requested from the live site before the click").toEqual([]);

    await embed(page).getByRole("button", { name: v.loadLive }).click();
    const iframe = embed(page).locator("iframe");
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute("src", /^https:\/\/queue-r-code\.vercel\.app\/?$/);
    await expect(iframe).toHaveAttribute("title", v.liveTitle.replace("{name}", qr.text.en.name));
    // Sandboxed, but the site's own features work: downloads, new-tab links, clipboard.
    const sandbox = ((await iframe.getAttribute("sandbox")) ?? "").split(/\s+/).sort();
    expect(sandbox).toEqual([
      "allow-downloads",
      "allow-forms",
      "allow-popups",
      "allow-popups-to-escape-sandbox",
      "allow-same-origin",
      "allow-scripts",
    ]);
    await expect(iframe).toHaveAttribute("allow", "clipboard-write");
    await expect(embed(page)).toHaveAttribute("data-state", "live");
    await expect(iframe).toBeVisible();
    await expect(page.frameLocator("[data-live-embed] iframe").getByRole("heading", { name: "QR stub" })).toBeVisible();
    await expect(embed(page).getByRole("button", { name: v.loadLive })).toHaveCount(0);
  });

  test("LiveEmbed: when the frame request is aborted, poster and external link remain visible", async ({ page }) => {
    await page.route(`${QR_ORIGIN}/**`, (route) => route.abort());
    await page.goto("/en/demo-lab/");
    await embed(page).scrollIntoViewIfNeeded();
    await embed(page).getByRole("button", { name: v.loadLive }).click();

    // Within the ~8s budget the embed gives up and falls back.
    await expect(embed(page)).toHaveAttribute("data-state", "failed", { timeout: 10_000 });
    await expect(embed(page).getByText(v.liveFallback)).toBeVisible();
    await expect(embed(page).locator("[data-live-poster]")).toBeVisible();
    await expect(external(page)).toBeVisible();
    await expect(external(page)).toHaveAttribute("href", QR_ORIGIN);
    await expect(embed(page).locator("iframe")).toHaveCount(0);
  });

  test("LiveEmbed: keyboard: Enter loads the site and focus stays inside the embed", async ({ page }) => {
    const focus = () =>
      page.evaluate(() => {
        const active = document.activeElement;
        const root = document.querySelector("[data-live-embed]");
        return { inside: !!active && !!root && root.contains(active), tag: active?.tagName ?? null };
      });
    // The site responds only when released, so the loading state can be inspected.
    let release = () => {};
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route(`${QR_ORIGIN}/**`, async (route) => {
      await gate;
      await route.fulfill({ contentType: "text/html", body: "<!doctype html><title>stub</title><h1>QR stub</h1>" });
    });
    await page.goto("/en/demo-lab/");
    await embed(page).getByRole("button", { name: v.loadLive }).focus();
    await page.keyboard.press("Enter");

    await expect(embed(page)).toHaveAttribute("data-state", "loading");
    await expect(embed(page).getByRole("button", { name: v.loadLive })).toHaveCount(0);
    expect(await focus()).toEqual({ inside: true, tag: "FIGURE" });
    await expect(embed(page).getByRole("status")).toHaveText(v.liveLoading);
    // The hidden, still-loading iframe is not a tab stop.
    await expect(embed(page).locator("iframe")).toHaveAttribute("tabindex", "-1");

    release();
    await expect(embed(page)).toHaveAttribute("data-state", "live");
    await expect(embed(page).locator("iframe")).toHaveAttribute("tabindex", "0");
    await expect.poll(focus).toEqual({ inside: true, tag: "IFRAME" });
  });

  test("LiveEmbed: keyboard: when loading fails, focus is still inside the embed", async ({ page }) => {
    await page.route(`${QR_ORIGIN}/**`, (route) => route.abort());
    await page.goto("/en/demo-lab/");
    await embed(page).getByRole("button", { name: v.loadLive }).focus();
    await page.keyboard.press("Enter");
    await expect(embed(page)).toHaveAttribute("data-state", "failed", { timeout: 10_000 });
    const active = await page.evaluate(() => ({
      inside: document.querySelector("[data-live-embed]")!.contains(document.activeElement),
      body: document.activeElement === document.body,
    }));
    expect(active).toEqual({ inside: true, body: false });
    // The external link is the next tab stop.
    await page.keyboard.press("Tab");
    await expect(external(page)).toBeFocused();
  });

  test("LiveEmbed: a frame that never finishes loading falls back after about 8s", async ({ page }) => {
    // The request hangs: no response, no error.
    await page.route(`${QR_ORIGIN}/**`, () => {});
    await page.goto("/en/demo-lab/");
    await embed(page).scrollIntoViewIfNeeded();
    await embed(page).getByRole("button", { name: v.loadLive }).click();
    await expect(embed(page)).toHaveAttribute("data-state", "loading");
    await page.waitForTimeout(5000);
    await expect(embed(page)).toHaveAttribute("data-state", "loading");
    await expect(embed(page)).toHaveAttribute("data-state", "failed", { timeout: 6000 });
    await expect(embed(page).locator("[data-live-poster]")).toBeVisible();
    await expect(external(page)).toBeVisible();
    await expect(embed(page).locator("iframe")).toHaveCount(0);
  });
});
