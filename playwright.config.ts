import { config } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

// `next start` runs with NODE_ENV=production and ignores .env.test, so load it here and pass it through.
const parsed = config({ path: ".env.test", quiet: true }).parsed ?? {};

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:4183" },
  webServer: {
    command: "npm run build && npm run start -- -p 4183",
    url: "http://localhost:4183",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: { ...parsed, NODE_ENV: "production" } as Record<string, string>,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], ...(process.env.CI ? {} : { channel: "chrome" }) } }],
});
