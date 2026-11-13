import { site } from "../src/content/site";

const PLACEHOLDER = "https://azab.dev";

if (site.url === PLACEHOLDER) {
  console.warn(
    `⚠ site.url is the placeholder ${PLACEHOLDER} — set the real domain before launch`,
  );
}
process.exit(0);
