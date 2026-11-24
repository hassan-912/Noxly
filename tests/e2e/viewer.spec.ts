import { expect, test } from "@playwright/test";
import { dictionaries } from "../../src/content/i18n";

test("work shows the real sites as horizontal project tabs", async ({ page }) => {
  await page.goto("/en/");
  const work = page.locator("section#work");
  const tabs = work.getByRole("tablist", { name: "Featured projects" }).getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(tabs).toContainText(["MG Visa Document Review", "MG Visa Calculator", "MG Consultation", "Femine-EG"]);
  await expect(work.getByRole("link", { name: /Open website/ }).first()).toHaveAttribute("href", "https://mg-visa-review.streamlit.app/");
  await expect(work.getByText(/QR Studio/)).toHaveCount(0);
});

test("Femine-EG has a real preview and a link to its public website", async ({ page }) => {
  await page.goto("/en/#work");
  const work = page.locator("section#work");
  await work.getByRole("tab", { name: /Femine-EG/ }).click();
  const panel = work.locator("[data-current] [data-site-panel]");
  await expect(panel).toHaveAttribute("data-presentation", "screenshot");
  await expect(panel.locator("img.site-panel__shot")).toHaveAttribute("src", "/screens/femine-eg-desktop.webp");
  await expect(work.getByRole("link", { name: /Open website/ }).first()).toHaveAttribute("href", "https://femine-eg.com/");
  await work.getByRole("radio", { name: "Phone" }).click();
  await expect(panel.locator("img.site-panel__shot")).toHaveAttribute("src", "/screens/femine-eg-mobile.webp");
});

test("calculator exposes tourism, immigration and jobseeker with exact live links", async ({ page }) => {
  await page.goto("/en/");
  const work = page.locator("section#work");
  await work.getByRole("tab", { name: /MG Visa Calculator/ }).click();
  const expected = [
    ["Tourism", "https://visa-file-strength-calculator.vercel.app/", "calculator-desktop.webp"],
    ["Immigration", "https://visa-file-strength-calculator.vercel.app/immigration/", "calculator-immigration-desktop.webp"],
    ["Jobseeker", "https://visa-file-strength-calculator.vercel.app/job-seeker/", "calculator-jobseeker-desktop.webp"],
  ] as const;
  for (const [name, url, image] of expected) {
    await work.getByText(name, { exact: true }).click();
    await expect(work.getByRole("radio", { name })).toBeChecked();
    await expect(work.locator("[data-current] img.site-panel__shot")).toHaveAttribute("src", `/screens/${image}`);
    await expect(work.getByRole("link", { name: /Open website/ }).first()).toHaveAttribute("href", url);
  }
});

test("source-code links are absent and unfinished sections contain content", async ({ page }) => {
  await page.goto("/en/");
  for (const id of ["services", "story", "projects", "building", "contact"]) {
    await expect(page.locator(`section#${id} [data-section-body="${id}"]`)).toBeVisible();
  }
  await expect(page.getByRole("link", { name: /view the code|repository/i })).toHaveCount(0);
  expect(await page.locator("a[href*='github.com']").count()).toBe(0);
});

test("system architecture is its own page in each locale", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/`);
    await page.getByRole("navigation", { name: dictionaries[locale as "en" | "ar"].nav.label }).getByRole("link", { name: dictionaries[locale as "en" | "ar"].nav.systems }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/systems/$`));
    await expect(page.locator("section#systems")).toBeVisible();
  }
});

test("work and completed sections fit a phone in English and Arabic", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/#work`);
    const work = page.locator("section#work");
    await work.getByRole("tab", { name: /MG Visa Calculator/ }).click();
    await work.getByRole("radio", { name: locale === "ar" ? "الهجرة" : "Immigration" }).focus();
    await page.keyboard.press("Space");
    await expect(work.getByRole("radio", { name: locale === "ar" ? "الهجرة" : "Immigration" })).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  }
});
