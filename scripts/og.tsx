/**
 * Writes English, German and French Open Graph / Twitter share images to public/og/.
 *
 * `buildMetadata` points og:image at these fixed paths, so each locale's share image is a plain
 * PNG file served with an image Content-Type. Arabic uses a checked-in browser capture.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { locales } from "../src/content/types";
import { OgCard } from "../src/lib/og-card";
import { ogImagePath, ogSize } from "../src/lib/metadata";

async function main() {
  const publicDir = path.resolve(__dirname, "../public");
  for (const locale of locales) {
    // Satori cannot shape this font's Arabic GSUB lookup; the checked-in Arabic PNG is
    // captured with a browser by scripts/capture-ar-og.ts instead.
    if (locale === "ar") continue;
    const file = path.join(publicDir, ogImagePath(locale));
    await mkdir(path.dirname(file), { recursive: true });
    const image = new ImageResponse(<OgCard locale={locale} />, ogSize);
    await writeFile(file, Buffer.from(await image.arrayBuffer()));
    console.log(`og: wrote ${path.relative(process.cwd(), file)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
