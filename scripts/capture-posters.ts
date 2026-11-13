/**
 * Captures the poster of every embeddable live site: a 1440×900 screenshot saved as WebP in
 * `public/posters/<slug>.webp`. Run it once (`npm run posters`) and commit the images; it is
 * not part of the build.
 *
 * If a site can't be captured, nothing is written for it and an error is printed. `LiveEmbed`
 * then shows its designed fallback card instead of a poster.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { projects } from "../src/content/projects";

const VIEWPORT = { width: 1440, height: 900 };
/** WebP quality, 0..1. Must stay at or below 0.8. */
const QUALITY = 0.78;
const OUT_DIR = path.join(process.cwd(), "public", "posters");

const targets = projects.filter((p) => p.embeddable && p.liveUrl).map((p) => ({ slug: p.slug, url: p.liveUrl! }));

async function main(): Promise<number> {
  const browser = await chromium.launch();
  let failures = 0;
  try {
    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "reduce" });
    // A blank page whose canvas re-encodes the PNG screenshot as WebP (no image library needed).
    const encoder = await context.newPage();

    for (const { slug, url } of targets) {
      const page = await context.newPage();
      try {
        const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
        await page.waitForTimeout(1500); // let fonts and entrance animations settle
        const png = await page.screenshot({ type: "png" });

        const dataUrl = await encoder.evaluate(
          async ({ base64, width, height, quality }) => {
            const image = new Image();
            image.src = `data:image/png;base64,${base64}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")!.drawImage(image, 0, 0, width, height);
            return canvas.toDataURL("image/webp", quality);
          },
          { base64: png.toString("base64"), ...VIEWPORT, quality: QUALITY },
        );
        if (!dataUrl.startsWith("data:image/webp;base64,")) throw new Error("WebP encoding is not available");

        const webp = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
        await mkdir(OUT_DIR, { recursive: true });
        const file = path.join(OUT_DIR, `${slug}.webp`);
        await writeFile(file, webp);
        console.log(`✓ ${slug}: ${path.relative(process.cwd(), file)} (${Math.round(webp.length / 1024)} kB)`);
      } catch (error) {
        failures += 1;
        console.error(`✗ ${slug}: could not capture ${url}. No file written; LiveEmbed will show its fallback card.`);
        console.error(`  ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  return failures;
}

main().then(
  (failures) => process.exit(failures > 0 ? 1 : 0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
