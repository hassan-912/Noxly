/** One-time authoring command for the static Arabic share card. Requires local Chrome. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { ar } from "../src/content/i18n/ar";
import { site } from "../src/content/site";

async function main() {
  const font = await readFile(path.resolve(__dirname, "../assets/fonts/NotoKufiArabic-Regular.ttf"));
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html lang="ar" dir="rtl"><head><style>
      @font-face { font-family: NotoKufi; src: url(data:font/ttf;base64,${font.toString("base64")}); }
      * { box-sizing: border-box; }
      body { margin: 0; width: 1200px; height: 630px; padding: 80px; display: flex;
        flex-direction: column; justify-content: space-between; background: #F4F7F9;
        color: #0E1A24; font-family: NotoKufi, sans-serif; }
      .accent { width: 96px; height: 8px; border-radius: 4px; background: #525AFF; }
      .body { display: flex; flex-direction: column; gap: 24px; }
      .name { font-size: 88px; font-weight: 600; letter-spacing: -3px; direction: ltr; text-align: right; }
      .role { font-size: 36px; color: #525AFF; }
      .value { font-size: 34px; color: #4A6878; max-width: 960px; line-height: 1.35; }
      .url { font-size: 24px; color: #4A6878; direction: ltr; text-align: right; }
    </style></head><body><div class="accent"></div><div class="body"><div class="name"></div>
    <div class="role"></div><div class="value"></div></div><div class="url"></div></body></html>`);
    await page.evaluate(({ name, role, value, url }) => {
      document.querySelector(".name")!.textContent = name;
      document.querySelector(".role")!.textContent = role;
      document.querySelector(".value")!.textContent = value;
      document.querySelector(".url")!.textContent = url;
    }, { name: site.name, role: ar.identity.role, value: ar.identity.valueProp, url: site.url.replace(/^https?:\/\//, "") });
    await page.evaluate(() => document.fonts.ready);
    await writeFile(path.resolve(__dirname, "../public/og/ar.png"), await page.screenshot());
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
