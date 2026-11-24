/**
 * Captures the public entry page of every project with a live URL, at desktop (1440×900) and
 * mobile (390×844) size, and saves them as WebP in `public/screens/<slug>-<desktop|mobile>.webp`.
 * Run it by hand (`npm run screens`, or `npm run screens -- femine-eg` for one project),
 * look at every image, and commit them; it is not part of
 * the build.
 *
 * Only the entry page is opened: no clicks, no typing, no login. A cookie or consent banner is
 * captured as it is. Inspect each image before committing it: it must show no personal data.
 *
 * If a page can't be captured, nothing is written for it and an error is printed. The viewer
 * then shows its text presentation instead of a screenshot.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type BrowserContextOptions } from "@playwright/test";
import { projects } from "../src/content/projects";

/** WebP quality, 0..1. Must stay at or below 0.8. */
const QUALITY = 0.78;
const OUT_DIR = path.join(process.cwd(), "public", "screens");

const sizes: Record<"desktop" | "mobile", BrowserContextOptions> = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  // Twice the pixels, so the phone screenshot stays sharp at its CSS size on high-density screens.
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const selected = new Set(process.argv.slice(2));
const targets = projects.flatMap((p) => [
  ...(p.liveUrl && p.screenshots ? [{ slug: p.slug, url: p.liveUrl }] : []),
  ...(p.previews?.slice(1).map((preview) => ({ slug: `${p.slug}-${preview.id}`, url: preview.liveUrl })) ?? []),
]).filter((target) => selected.size === 0 || selected.has(target.slug));

async function main(): Promise<number> {
  const browser = await chromium.launch({ channel: "chrome" });
  let failures = 0;
  try {
    // A blank page whose canvas re-encodes the PNG screenshot as WebP (no image library needed).
    const encoderContext = await browser.newContext();
    const encoder = await encoderContext.newPage();

    for (const [size, options] of Object.entries(sizes)) {
      // A fresh context per size: no cookies or storage carried between captures.
      const context = await browser.newContext({ ...options, reducedMotion: "reduce", colorScheme: "light" });
      for (const { slug, url } of targets) {
        const page = await context.newPage();
        const name = `${slug}-${size}`;
        try {
          // This Shopify storefront keeps background requests open, especially on phones.
          const response = await page.goto(url, { waitUntil: slug === "femine-eg" ? "domcontentloaded" : "networkidle", timeout: 45_000 });
          if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
          await page.waitForTimeout(1500); // let fonts and entrance animations settle
          const png = await page.screenshot({ type: "png" });

          const dataUrl = await encoder.evaluate(
            async ({ base64, quality }) => {
              const image = new Image();
              image.src = `data:image/png;base64,${base64}`;
              await image.decode();
              const canvas = document.createElement("canvas");
              canvas.width = image.naturalWidth;
              canvas.height = image.naturalHeight;
              canvas.getContext("2d")!.drawImage(image, 0, 0);
              return canvas.toDataURL("image/webp", quality);
            },
            { base64: png.toString("base64"), quality: QUALITY },
          );
          if (!dataUrl.startsWith("data:image/webp;base64,")) throw new Error("WebP encoding is not available");

          const webp = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
          await mkdir(OUT_DIR, { recursive: true });
          const file = path.join(OUT_DIR, `${name}.webp`);
          await writeFile(file, webp);
          console.log(`✓ ${name}: ${path.relative(process.cwd(), file)} (${Math.round(webp.length / 1024)} kB)`);
        } catch (error) {
          failures += 1;
          console.error(`✗ ${name}: could not capture ${url}. No file written.`);
          console.error(`  ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
        } finally {
          await page.close();
        }
      }
      await context.close();
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
