import { expect, test, type Page } from "@playwright/test";

const locales = ["en", "de", "fr", "ar"] as const;
const sectionIds = ["work", "systems", "services", "story", "projects", "building", "contact"];

/** Presses Tab until `target` has focus (fails after `max` presses). */
async function tabTo(page: Page, target: ReturnType<Page["locator"]>, max = 30) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error("target never received focus");
}

test("each locale sets lang and dir", async ({ page }) => {
  for (const locale of locales) {
    const res = await page.goto(`/${locale}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }
});

test("home has every section anchor with a heading", async ({ page }) => {
  await page.goto("/en/");
  for (const id of sectionIds) {
    const section = page.locator(`section#${id}`);
    await expect(section).toHaveCount(1);
    await expect(section.getByRole("heading")).toHaveCount(1);
  }
});

test("head has canonical, hreflang alternates, og:image and JSON-LD Person", async ({ page }) => {
  await page.goto("/fr/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://azab.dev/fr/");
  for (const l of [...locales, "x-default"]) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
  }
  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(og).toBeTruthy();
  const img = await page.request.get(new URL(og!).pathname);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");

  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(ld["@type"]).toBe("Person");
  expect(ld.name).toBe("Hassan Azab");
  expect(ld.jobTitle).toBe("Software Engineer at MG Visa · Problem Solver");
  expect(ld.address.addressLocality).toBe("New Cairo");
  expect(ld.sameAs).toEqual([
    "https://www.linkedin.com/in/hassan-azb-b60587246/",
    "https://github.com/hassan-912",
  ]);
});

test("language menu switches locale and keeps hash", async ({ page }) => {
  await page.goto("/en/#services");
  await page.getByRole("button", { name: /Language/ }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem")).toHaveText(["English", "Deutsch", "Français", "العربية"]);
  await page.getByRole("menuitem", { name: "Deutsch" }).click();
  await expect(page).toHaveURL(/\/de\/#services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});

test("language menu is keyboard operable", async ({ page }) => {
  await page.goto("/en/");
  const trigger = page.getByRole("button", { name: /Language/ });
  await tabTo(page, trigger);
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menuitem", { name: "English" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Deutsch" })).toBeFocused();

  // Escape closes and returns focus to the trigger.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/de\/$/);
});

test("skip link moves focus to main", async ({ page }) => {
  await page.goto("/en/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("mobile nav at 375px opens, traps focus, closes on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en/");
  await expect(page.getByRole("button", { name: /Language/ })).toBeHidden();
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Services" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Deutsch" })).toBeVisible();

  const insideDialog = () => page.evaluate(() => !!document.activeElement?.closest("dialog"));
  expect(await insideDialog()).toBe(true);
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(await insideDialog()).toBe(true);
  }
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(await insideDialog()).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test("mobile nav link closes the sheet and jumps to the section", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/en\/#contact$/);
});

test.describe("root page without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("root page links to all four locales", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    for (const [locale, name] of [
      ["en", "English"],
      ["de", "Deutsch"],
      ["fr", "Français"],
      ["ar", "العربية"],
    ]) {
      await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("href", `/${locale}/`);
    }
  });
});

test.describe("root page with a German browser", () => {
  test.use({ locale: "de-DE" });

  test("redirects to the preferred locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/de\/$/);
  });
});
