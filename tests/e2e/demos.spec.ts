import { expect, test, type Locator, type Page } from "@playwright/test";
import { en } from "../../src/content/i18n/en";
import { dictionaries } from "../../src/content/i18n";

const demoIds = ["review", "calculator", "consultation", "crew-mg", "mg-mobile"] as const;
const d = en.demos;

const demo = (page: Page, id: (typeof demoIds)[number]) => page.locator(`[data-demo="${id}"]`);

/** Opens the test-only lab and waits until every lazy demo chunk has rendered. */
async function openLab(page: Page, locale: "en" | "ar" = "en") {
  const res = await page.goto(`/${locale}/demo-lab/`);
  expect(res?.status()).toBe(200);
  for (const id of demoIds) await expect(demo(page, id)).toBeVisible();
}

/** Sets the width of every demo's frame through the lab's own control. */
async function setFrameWidth(page: Page, width: 360 | 768 | 1200) {
  await page.getByRole("radio", { name: String(width), exact: true }).check();
  await expect(demo(page, "review")).toHaveJSProperty("clientWidth", width);
}

/** Elements inside `root` that stick out of it on the inline axis, plus its own scroll overflow. */
async function overflowOf(root: Locator) {
  return root.evaluate((el) => {
    const frame = el.getBoundingClientRect();
    const out: string[] = [];
    if (el.scrollWidth > el.clientWidth) out.push(`root scrolls: ${el.scrollWidth} > ${el.clientWidth}`);
    for (const node of el.querySelectorAll<HTMLElement>("*")) {
      const r = node.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.left < frame.left - 0.5 || r.right > frame.right + 0.5) {
        out.push(`${node.tagName.toLowerCase()}.${String(node.className).slice(0, 60)} [${r.left}, ${r.right}]`);
      }
    }
    return out;
  });
}

test("every demo shows the localized 'Illustrative demo · sample data' label", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    await openLab(page, locale);
    for (const id of demoIds) {
      await expect(demo(page, id).getByText(dictionaries[locale].demos.label, { exact: true })).toBeVisible();
    }
  }
});

test("the lab is noindex and is not linked from the navigation", async ({ page }) => {
  await openLab(page);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/en/");
  await expect(page.locator('a[href*="demo-lab"]')).toHaveCount(0);
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("demo-lab");
});

test("review: deterministic findings and AI-assisted check are in separately labelled regions", async ({ page }) => {
  await openLab(page);
  const factual = demo(page, "review").getByRole("region", { name: /factual checks/i });
  const ai = demo(page, "review").getByRole("region", { name: /AI-assisted/i });
  await expect(factual).toHaveCount(1);
  await expect(ai).toHaveCount(1);
  // Different elements, and neither sits inside the other.
  expect(await factual.evaluate((el) => el.querySelector('[role="region"], section') !== null)).toBe(false);
  expect(await ai.evaluate((el) => el.closest("[data-region='factual']") !== null)).toBe(false);
  expect(await factual.evaluate((el, other) => el === other || el.contains(other), await ai.elementHandle())).toBe(false);
  expect(await ai.evaluate((el, other) => el.contains(other), await factual.elementHandle())).toBe(false);
  // Each side says what it is; the AI side never appears among the factual findings.
  await expect(ai).toContainText(d.review.aiNote);
  await expect(factual).not.toContainText(/AI|Gemini/);
  await expect(factual.getByText(d.review.discrepancy, { exact: true }).first()).toBeVisible();
  // No accuracy or approval-prediction wording anywhere in the demo.
  await expect(demo(page, "review")).not.toContainText(/accura|guarantee|approval|% /i);
});

test("review: selecting a discrepancy reveals its source evidence (keyboard Enter works)", async ({ page }) => {
  await openLab(page);
  const factual = demo(page, "review").getByRole("region", { name: /factual checks/i });
  const closed = factual.locator('button[aria-expanded="false"]').filter({ hasText: d.review.discrepancy }).first();
  const panelId = await closed.getAttribute("aria-controls");
  expect(panelId).toBeTruthy();
  const panel = page.locator(`[id="${panelId}"]`);
  await expect(panel).toBeHidden();

  await closed.focus();
  await page.keyboard.press("Enter");

  await expect(factual.locator(`button[aria-controls="${panelId}"]`)).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(d.review.evidence);
  await expect(panel).toContainText(d.review.documentA);
  await expect(panel).toContainText(d.review.documentB);
  await expect(panel.locator("mark")).toHaveCount(2);
});

test("review: the report preview is a second view with the AI section kept apart", async ({ page }) => {
  await openLab(page);
  const review = demo(page, "review");
  await review.getByRole("tab", { name: d.review.report }).click();
  const report = review.getByRole("tabpanel", { name: d.review.report });
  await expect(report).toContainText(d.review.reportTitle);
  await expect(report.locator("[data-report-ai]")).toContainText(d.review.aiAssisted);
  await expect(report.locator("[data-report-factual]")).not.toContainText(/AI|Gemini/);
});

test("calculator: completing the questionnaire shows 'Preliminary MG assessment' and the not-official disclaimer", async ({
  page,
}) => {
  await openLab(page);
  const calc = demo(page, "calculator");
  await expect(calc.getByText(d.calculator.result, { exact: true })).toHaveCount(0);

  await calc.getByRole("radio", { name: d.calculator.jobSeeker }).check();
  const next = calc.getByRole("button", { name: d.calculator.next, exact: true });
  // Keyboard only: Enter on Next, twice (focus moves to each new step's heading in between).
  for (let i = 0; i < 2; i++) {
    await next.focus();
    await page.keyboard.press("Enter");
  }
  await expect(calc.getByText(d.calculator.sampleRate).first()).toBeVisible();
  await calc.getByRole("button", { name: d.calculator.seeResult }).click();

  await expect(calc.getByText(d.calculator.result, { exact: true })).toBeVisible();
  await expect(calc.getByText(d.calculator.disclaimer)).toBeVisible();
  await expect(calc).toContainText(/not an official eligibility decision/);
  await expect(calc.getByText(d.calculator.sampleRate).first()).toBeVisible();
  // Nothing that reads like approval odds.
  await expect(calc).not.toContainText(/%|score|chance|likely|approv|eligible\b/i);

  await calc.getByRole("button", { name: d.calculator.startOver }).click();
  await expect(calc.getByText(d.calculator.result, { exact: true })).toHaveCount(0);
});

test("consultation: booking flow reaches a QR ticket; payment step says it is a mock", async ({ page }) => {
  await openLab(page);
  const c = demo(page, "consultation");
  const next = c.getByRole("button", { name: d.common.next, exact: true });

  await c.getByRole("radio", { name: new RegExp(d.people.consultantB) }).check();
  await next.click();
  await c.getByRole("radio", { name: "13:30" }).check();
  await next.click();

  await expect(c.getByText(d.consultation.paymentMock)).toBeVisible();
  await expect(c.getByText(/No real payment is made/)).toBeVisible();
  await expect(c.locator("input:not([type='radio'])")).toHaveCount(0); // no card or personal-data fields
  await c.getByRole("button", { name: d.consultation.confirm }).click();

  await expect(c.getByText(d.consultation.ticket, { exact: true })).toBeVisible();
  await expect(c.locator("[data-qr]")).toBeVisible();
  await expect(c.getByText(d.consultation.ticketNote)).toBeVisible();

  // The same booking shows up in the staff schedule.
  await c.getByRole("tab", { name: d.consultation.staffView }).click();
  const schedule = c.getByRole("tabpanel", { name: d.consultation.staffView });
  await expect(schedule.locator("[data-booking='new']")).toContainText("13:30");
});

test("crew: generated referral link shows 'used' after one simulated use", async ({ page }) => {
  await openLab(page);
  const crew = demo(page, "crew-mg");
  await expect(crew.getByText(en.building.crewStatus, { exact: true })).toBeVisible();
  await expect(crew.locator("[data-link-status='expired']")).toHaveCount(1);

  await crew.getByRole("button", { name: d.crew.generateLink }).click();
  const link = crew.locator("[data-link]").first();
  await expect(link).toHaveAttribute("data-link-status", "unused");
  await expect(link.getByText(d.crew.unused, { exact: true })).toBeVisible();

  await link.getByRole("button", { name: d.crew.simulateUse }).click();
  await expect(link).toHaveAttribute("data-link-status", "used");
  await expect(link.getByText(d.crew.used, { exact: true })).toBeVisible();
  // One use only: the link cannot be used again.
  await expect(link.getByRole("button", { name: d.crew.simulateUse })).toHaveCount(0);

  await crew.getByRole("tab", { name: d.crew.libraryView }).click();
  await expect(crew.getByRole("tabpanel", { name: d.crew.libraryView })).toContainText(d.crew.library);
  await expect(crew).not.toContainText(/secure|encrypt|certif/i);
});

test("mobile screens render in ar with dir=rtl inside the phone", async ({ page }) => {
  await openLab(page);
  const mobile = demo(page, "mg-mobile");
  const arPhone = mobile.locator("[data-phone][lang='ar']");
  const enPhone = mobile.locator("[data-phone][lang='en']");
  await expect(arPhone).toHaveAttribute("dir", "rtl");
  await expect(enPhone).toHaveAttribute("dir", "ltr");
  await expect(arPhone).toBeVisible();
  expect(await arPhone.evaluate((el) => getComputedStyle(el.querySelector("[data-screen]")!).direction)).toBe("rtl");
  await expect(arPhone).toContainText(dictionaries.ar.demos.mobile.nextConsultation);
  await expect(arPhone).not.toContainText(/[٠-٩]/);

  for (const screen of ["home", "assessment", "ticket", "staff"] as const) {
    await mobile.getByRole("tab", { name: d.mobile[screen], exact: true }).click();
    await expect(arPhone.locator(`[data-screen="${screen}"]`)).toBeVisible();
    await expect(enPhone.locator(`[data-screen="${screen}"]`)).toBeVisible();
  }
  await expect(mobile.getByText(en.building.mobileStatus, { exact: true })).toBeVisible();
  await expect(mobile).not.toContainText(/app store|google play|download|available now|released on/i);
});

test("each demo reflows: at container 360px no element overflows the frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const locale of ["en", "ar"] as const) {
    await openLab(page, locale);
    for (const width of [360, 768, 1200] as const) {
      await setFrameWidth(page, width);
      for (const id of demoIds) {
        expect(await overflowOf(demo(page, id)), `${locale} ${id} @${width}`).toEqual([]);
      }
    }
  }
  // The container width really changes the layout: the review comparison stacks on a phone.
  const columns = () =>
    demo(page, "review")
      .locator("[data-review-layout]")
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  await setFrameWidth(page, 1200);
  expect(await columns()).toBe(2);
  await setFrameWidth(page, 360);
  expect(await columns()).toBe(1);
});

test("demos stay inside a 360px frame in their later states too", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openLab(page);
  await setFrameWidth(page, 360);

  const calc = demo(page, "calculator");
  for (let i = 0; i < 2; i++) {
    await calc.getByRole("button", { name: d.calculator.next, exact: true }).click();
    expect(await overflowOf(calc), `calculator step ${i + 1}`).toEqual([]);
  }
  await calc.getByRole("button", { name: d.calculator.seeResult }).click();
  expect(await overflowOf(calc), "calculator result").toEqual([]);

  const c = demo(page, "consultation");
  for (let i = 0; i < 2; i++) {
    await c.getByRole("button", { name: d.common.next, exact: true }).click();
    expect(await overflowOf(c), `consultation step ${i + 1}`).toEqual([]);
  }
  await c.getByRole("button", { name: d.consultation.confirm }).click();
  expect(await overflowOf(c), "consultation ticket").toEqual([]);
  await c.getByRole("tab", { name: d.consultation.staffView }).click();
  expect(await overflowOf(c), "consultation staff").toEqual([]);

  const crew = demo(page, "crew-mg");
  await crew.getByRole("button", { name: d.crew.generateLink }).click();
  expect(await overflowOf(crew), "crew link").toEqual([]);
  await crew.getByRole("tab", { name: d.crew.libraryView }).click();
  expect(await overflowOf(crew), "crew library").toEqual([]);

  const review = demo(page, "review");
  await review.getByRole("tab", { name: d.review.report }).click();
  expect(await overflowOf(review), "review report").toEqual([]);
});

test("demo views are keyboard operable: arrow keys move between tabs", async ({ page }) => {
  await openLab(page);
  const c = demo(page, "consultation");
  const customer = c.getByRole("tab", { name: d.consultation.customerView });
  const staff = c.getByRole("tab", { name: d.consultation.staffView });
  await customer.focus();
  await page.keyboard.press("ArrowRight");
  await expect(staff).toBeFocused();
  await expect(staff).toHaveAttribute("aria-selected", "true");
  await expect(c.getByRole("tabpanel", { name: d.consultation.staffView })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(customer).toBeFocused();
});

test("no demo makes a network request", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const requests: { url: string; type: string }[] = [];
  page.on("request", (r) => requests.push({ url: r.url(), type: r.resourceType() }));

  await openLab(page);
  await page.waitForLoadState("networkidle");
  const loaded = requests.length;

  // Use every demo; none of it may reach the network.
  const calc = demo(page, "calculator");
  await calc.getByRole("button", { name: d.calculator.next, exact: true }).click();
  await calc.getByRole("button", { name: d.calculator.next, exact: true }).click();
  await calc.getByRole("button", { name: d.calculator.seeResult }).click();
  const c = demo(page, "consultation");
  await c.getByRole("button", { name: d.common.next, exact: true }).click();
  await c.getByRole("button", { name: d.common.next, exact: true }).click();
  await c.getByRole("button", { name: d.consultation.confirm }).click();
  const crew = demo(page, "crew-mg");
  await crew.getByRole("button", { name: d.crew.generateLink }).click();
  await crew.locator("[data-link]").first().getByRole("button", { name: d.crew.simulateUse }).click();
  await demo(page, "review").getByRole("tab", { name: d.review.report }).click();
  await demo(page, "mg-mobile").getByRole("tab", { name: d.mobile.ticket, exact: true }).click();
  await page.waitForTimeout(500);

  expect(requests.slice(loaded), "requests caused by using the demos").toEqual([]);
  // Everything the page loaded is a same-origin static asset: no API calls, no third parties.
  for (const r of requests) {
    expect(new URL(r.url).origin, r.url).toBe(origin);
    expect(["document", "script", "stylesheet", "font", "image", "fetch"], r.url).toContain(r.type);
    if (r.type === "fetch") expect(r.url, "only Next's own static route payloads").toMatch(/\.txt(\?|$)/);
  }
  // And the demos embed no external media.
  expect(await page.locator("[data-demo] :is(img, iframe, video, link)").count()).toBe(0);
});
