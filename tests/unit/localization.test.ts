import { expect, test } from "vitest";
import { dictionaries } from "@/content/i18n";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { story } from "@/content/story";
import { diagrams } from "@/content/diagrams";
import { status } from "@/content/status";

test.each(["de", "fr", "ar"] as const)("%s renders translated portfolio content", (locale) => {
  const en = dictionaries.en;
  const local = dictionaries[locale];
  expect(local.nav.work).not.toBe(en.nav.work);
  expect(local.hero.headline).not.toBe(en.hero.headline);
  expect(local.sections.services.title).not.toBe(en.sections.services.title);
  expect(local.viewer.blockedNote).not.toBe(en.viewer.blockedNote);
  expect(projects[0].text[locale].summary).not.toBe(projects[0].text.en.summary);
  expect(services.outcomes[0].body[locale]).not.toBe(services.outcomes[0].body.en);
  expect(story.chapters[0].body[locale]).not.toBe(story.chapters[0].body.en);
  expect(diagrams[0].nodes[0].label[locale]).not.toBe(diagrams[0].nodes[0].label.en);
  expect(status["internal-tool"][locale]).not.toBe(status["internal-tool"].en);
  expect(local.hero.headline).toContain(local.hero.scrambleWord);
});

test("QR Studio is absent from the public project list", () => {
  expect(JSON.stringify(projects)).not.toContain("qr-studio");
});
