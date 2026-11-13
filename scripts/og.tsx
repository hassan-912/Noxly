/**
 * Writes one Open Graph / Twitter share image per locale to public/og/{locale}.png.
 *
 * Fallback for `app/[locale]/opengraph-image.tsx`: under `output: "export"` that route is
 * written as an extensionless file (`out/en/opengraph-image`) that static hosts serve without
 * an image Content-Type, which social crawlers may reject. Runs before `next build`.
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
