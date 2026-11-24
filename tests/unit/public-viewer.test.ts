import { expect, test } from "vitest";
import { getProject } from "@/lib/i18n";
import { sitePanelProject } from "@/components/work/site-props";

test("preview props never expose a project repository URL", () => {
  expect(JSON.stringify(sitePanelProject(getProject("review"), "en"))).not.toContain("github.com");
});

test("calculator has the three actual public pathways", () => {
  const calculator = getProject("calculator");
  expect(calculator.previews?.map((p) => p.liveUrl)).toEqual([
    "https://visa-file-strength-calculator.vercel.app/",
    "https://visa-file-strength-calculator.vercel.app/immigration/",
    "https://visa-file-strength-calculator.vercel.app/job-seeker/",
  ]);
});
