import { expect, test } from "@playwright/test";
import { en } from "../../src/content/i18n/en";

const headline = en.hero.headline;

test.describe.configure({ mode: "serial" });

type Probe = { __h1Texts: Set<string>; __h1At?: number };

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("h1 text and both CTAs are present with JS disabled", async ({ page }) => {
    await page.goto("/en/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(headline);
    await expect(h1).toBeVisible();
    await expect(page.getByText(en.hero.intro)).toBeVisible();
    await expect(page.getByRole("link", { name: en.hero.ctaPrimary })).toBeVisible();
    await expect(page.getByRole("link", { name: en.hero.ctaSecondary })).toBeVisible();
  });
});

test("primary CTA → https://wa.me/201023174210, secondary → #work", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("link", { name: en.hero.ctaPrimary })).toHaveAttribute(
    "href",
    "https://wa.me/201023174210",
  );
  const secondary = page.getByRole("link", { name: en.hero.ctaSecondary });
  await expect(secondary).toHaveAttribute("href", "#work");
  await secondary.click();
  await expect(page).toHaveURL(/\/en\/#work$/);
  await expect(page.locator("section#work")).toBeInViewport();
});

test.describe("hero with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reduced motion: no element has a running animation on the aurora and h1 text equals final text immediately", async ({
    page,
  }) => {
    // Sample the h1 on every frame from the first paint: it must never show a scrambled frame.
    await page.addInitScript(() => {
      const seen = new Set<string>();
      (window as unknown as Probe).__h1Texts = seen;
      const tick = () => {
        const h1 = document.querySelector("h1");
        if (h1) seen.add(h1.textContent ?? "");
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto("/en/");
    await expect(page.locator("h1")).toHaveText(headline, { timeout: 250 });
    await expect(page.locator("[data-aurora]")).toHaveAttribute("data-paused", "false");
    await page.waitForTimeout(1200);

    const texts = await page.evaluate(() => [...(window as unknown as Probe).__h1Texts]);
    expect(texts).toEqual([headline]);

    const state = await page.evaluate(() => {
      const running = (el: Element) =>
        el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length;
      return {
        aurora: running(document.querySelector("[data-aurora]")!),
        hero: running(document.querySelector("h1")!.closest("section")!),
        words: [...document.querySelectorAll("h1 [data-word]")].map((el) => getComputedStyle(el).opacity),
      };
    });
    expect(state.aurora).toBe(0);
    expect(state.hero).toBe(0);
    expect(state.words.length).toBeGreaterThan(0);
    expect(state.words.every((opacity) => opacity === "1")).toBe(true);
  });
});

test("hero text is visible immediately: first word has opacity > 0 within 500ms of document start", async ({ page }) => {
  // First frame in which the first [data-word] is laid out with computed opacity > 0
  // (proves no hidden-until-animated content), timed from navigation start.
  await page.addInitScript(() => {
    const w = window as unknown as Probe;
    // Measured from document creation, so server/network latency under suite load doesn't count.
    const t0 = performance.now();
    const tick = () => {
      const word = document.querySelector("h1 [data-word]");
      if (word && word.getBoundingClientRect().height > 0 && Number(getComputedStyle(word).opacity) > 0) {
        w.__h1At = performance.now() - t0;
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto("/en/");
  await expect(page.locator("h1")).toHaveText(headline);
  await expect.poll(() => page.evaluate(() => (window as unknown as Probe).__h1At)).toBeDefined();
  const at = await page.evaluate(() => (window as unknown as Probe).__h1At);
  expect(at!, `first word visible at ${at}ms`).toBeLessThan(500);
  // No loader, and the stagger finishes: every word ends fully opaque in about a second.
  await expect(page.locator("[data-loader], [aria-busy='true']")).toHaveCount(0);
  await expect
    .poll(
      () =>
        page
          .locator("h1 [data-word]")
          .evaluateAll((els) => els.length > 0 && els.every((el) => getComputedStyle(el).opacity === "1")),
      { timeout: 2000 },
    )
    .toBe(true);
  await expect(page.locator("h1")).toHaveText(headline);
});

test("aurora pauses when hero is off-screen", async ({ page }) => {
  await page.goto("/en/");
  const aurora = page.locator("[data-aurora]");
  await expect(aurora).toHaveAttribute("data-paused", "false");
  const running = () =>
    aurora.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length);
  expect(await running()).toBeGreaterThan(0);

  await page.locator("section#contact").scrollIntoViewIfNeeded();
  await expect(aurora).toHaveAttribute("data-paused", "true");
  expect(await running()).toBe(0);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(aurora).toHaveAttribute("data-paused", "false");
});

test("home has exactly one h1 and the hero never overflows horizontally", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    for (const width of [360, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${locale} @${width}`).toBeLessThanOrEqual(0);
    }
  }
});
