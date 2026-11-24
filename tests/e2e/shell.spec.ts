import { expect, test, type Page } from "@playwright/test";
import { dictionaries } from "../../src/content/i18n";
import { notesCopy } from "../../src/content/notes";
import { getFeaturedPost, getPosts } from "../../src/lib/posts";
import { contactFormCopy } from "../../src/content/contact-form";

const locales = ["en", "de", "fr", "ar"] as const;
const sectionIds = ["work", "services", "story", "projects", "building", "contact"];

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
    // One section heading; a section may have sub-headings of its own (e.g. the project viewer).
    await expect(section.getByRole("heading", { level: 2 })).toHaveCount(1);
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
  expect(ld.jobTitle).toBe(dictionaries.fr.identity.role);
  expect(ld.address.addressLocality).toBe("New Cairo");
  expect(ld.sameAs).toEqual(["https://www.linkedin.com/in/hassan-azb-b60587246/"]);
});

test("language menu switches locale and keeps hash", async ({ page }) => {
  await page.goto("/en/#services");
  await page.getByRole("button", { name: /Language/ }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem")).toHaveText(["English", "Deutsch", "Français", "العربية"]);
  await page.getByRole("menuitem", { name: "Deutsch" }).click();
  await expect(page).toHaveURL(/\/de\/#services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("[data-language-flag='de']").first()).toBeVisible();
  await expect(page.locator("h1")).toHaveText(dictionaries.de.hero.headline);
  await expect(page.locator("section#services h2")).toHaveText(dictionaries.de.sections.services.title);
});

test("notes index lists every post with a featured post, RSS link and contact card in every language", async ({ page }) => {
  const posts = getPosts();
  for (const locale of locales) {
    await page.goto(`/${locale}/notes/`);
    await expect(page.getByRole("heading", { level: 1, name: notesCopy[locale].title })).toBeVisible();
    await expect(page.locator("[data-featured] h2")).toHaveText(getFeaturedPost()!.text[locale].title);
    await expect(page.locator("[data-post-row]")).toHaveCount(posts.length);
    await expect(page.locator("[data-rss-link]")).toHaveAttribute("href", `/${locale}/notes/rss.xml`);
    await expect(page.locator("[data-contact-card]")).toHaveAttribute("href", `/${locale}/#contact`);
    await expect(page.getByRole("navigation").first().getByRole("link", { name: dictionaries[locale].nav.notes })).toHaveAttribute("href", `/${locale}/notes/`);
  }
  await page.locator("[data-contact-card]").click();
  await expect(page).toHaveURL(/\/ar\/#contact$/);
  await expect(page.locator("section#contact")).toBeVisible();
});

test("a note opens from the index with its sections, table of contents and a way back", async ({ page }) => {
  const post = getPosts()[0];
  await page.goto("/en/notes/");
  await page.locator("[data-post-row] a").first().click();
  await expect(page).toHaveURL(new RegExp(`/en/notes/${post.slug}/$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(post.text.en.title);
  await expect(page.locator("[data-post-body] h2")).toHaveText(post.text.en.sections.map((s) => s.title));
  const toc = page.locator("[data-toc]");
  await expect(toc.getByRole("link")).toHaveCount(post.text.en.sections.length);
  const last = post.text.en.sections.at(-1)!;
  await toc.getByRole("link", { name: last.title }).click();
  await expect(page).toHaveURL(new RegExp(`#${last.id}$`));
  await expect(toc.getByRole("link", { name: last.title })).toHaveAttribute("aria-current", "location");
  await page.getByRole("link", { name: notesCopy.en.backToNotes }).click();
  await expect(page).toHaveURL(/\/en\/notes\/$/);
});

test("notes RSS feed lists the posts", async ({ request }) => {
  const response = await request.get("/en/notes/rss.xml");
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const body = await response.text();
  for (const post of getPosts()) expect(body).toContain(`/en/notes/${post.slug}/`);
});

test("old blog URL redirects to notes", async ({ page }) => {
  await page.goto("/en/blog/");
  await expect(page).toHaveURL(/\/en\/notes\/$/);
});

test("contact form opens a filled WhatsApp draft", async ({ page }) => {
  await page.goto("/en/#contact");
  await page.evaluate(() => {
    (window as Window & { contactDraft?: string }).contactDraft = "";
    window.open = ((url?: string | URL) => {
      (window as Window & { contactDraft?: string }).contactDraft = String(url);
      return null;
    }) as typeof window.open;
  });
  const contact = page.locator("section#contact");
  await expect(contact.getByRole("heading", { level: 2 })).toContainText(contactFormCopy.en.headlineAccent);
  await contact.getByLabel("Name", { exact: true }).fill("A Visitor");
  await contact.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await contact.getByLabel("What are you building?").fill("I need an appointment system.");
  await contact.getByText("Web app", { exact: true }).click();
  await expect(contact.getByRole("checkbox", { name: "Web app" })).toBeChecked();
  await contact.getByRole("button", { name: /Continue on WhatsApp/ }).click();
  const url = await page.evaluate(() => (window as Window & { contactDraft?: string }).contactDraft);
  expect(url).toMatch(/^https:\/\/wa\.me\/201023174210\?text=/);
  const draft = new URL(url!).searchParams.get("text")!;
  expect(draft).toContain("A Visitor");
  expect(draft).toContain("I need an appointment system.");
  expect(draft).toContain("Web app");
});

test("each language shows translated page content and keeps project names", async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`/${locale}/`);
    await expect(page.locator("h1")).toHaveText(dictionaries[locale].hero.headline);
    await expect(page.locator("section#work h2")).toHaveText(dictionaries[locale].sections.work.title);
    await expect(page.locator("section#services h2")).toHaveText(dictionaries[locale].sections.services.title);
    await expect(page.locator("section#work").getByRole("tab", { name: /MG Visa Calculator/ })).toBeVisible();
  }
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
