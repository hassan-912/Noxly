import { describe, expect, test } from "vitest";
import * as simpleIcons from "simple-icons";
import * as lucide from "lucide-react";
import { locales, type ProjectSlug } from "@/content/types";
import { projects } from "@/content/projects";
import { tech } from "@/content/tech";
import { site } from "@/content/site";
import { status } from "@/content/status";
import { story } from "@/content/story";
import { services } from "@/content/services";
import { diagrams } from "@/content/diagrams";
import { dictionaries } from "@/content/i18n";
import { en } from "@/content/i18n/en";
import { dirOf, getDictionary, getProject, getProjects, isLocale } from "@/lib/i18n";

/** Every leaf path of a nested string object, e.g. "hero.headline". */
function leafPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => leafPaths(v, prefix ? `${prefix}.${k}` : k));
}

function leafValues(obj: unknown): unknown[] {
  if (typeof obj !== "object" || obj === null) return [obj];
  return Object.values(obj).flatMap(leafValues);
}

const isLocalized = (v: object) => {
  const keys = Object.keys(v).sort();
  return keys.length === locales.length && [...locales].sort().every((l, i) => keys[i] === l);
};

/** All strings a visitor reads in English: Localized values contribute only their `en` side. */
function englishStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(englishStrings);
  if (typeof value === "object" && value !== null) {
    if (isLocalized(value)) return englishStrings((value as Record<string, unknown>).en);
    return Object.values(value).flatMap(englishStrings);
  }
  return [];
}

const all: ProjectSlug[] = [
  "review", "calculator", "consultation", "mg-mobile", "crew-mg", "mawid",
  "qr-studio", "voclio", "femine-eg", "treasure-hunt", "muscle-generator",
];

describe("dictionaries", () => {
  test("every locale dictionary has exactly the keys of en", () => {
    const enKeys = leafPaths(en).sort();
    expect(enKeys.length).toBeGreaterThan(50);
    for (const locale of locales) {
      const dict = dictionaries[locale];
      expect(leafPaths(dict).sort(), locale).toEqual(enKeys);
      for (const v of leafValues(dict)) {
        expect(typeof v, locale).toBe("string");
        expect((v as string).trim().length, locale).toBeGreaterThan(0);
      }
    }
  });

  test("required UI strings are exact", () => {
    expect(en.hero.ctaPrimary).toBe("Let's talk about your project.");
    expect(en.hero.ctaSecondary).toBe("Explore my work.");
    expect(en.hero.headline).toBe("Software that makes work feel simpler.");
    expect(en.hero.headline).toContain(en.hero.scrambleWord);
    expect(en.hero.scrambleWord).toBe("simpler");
    expect(en.demos.label).toBe("Illustrative demo · sample data");
    expect(en.diagram.caption).toBe("Illustrative animation — not live traffic");
    expect(en.building.mobileStatus).toBe("In development · not released");
    expect(en.footer.privacy).toBe("This site sets no cookies and no tracking.");
  });

  test("helpers: getDictionary, isLocale, dirOf", () => {
    expect(getDictionary("en")).toBe(en);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("es")).toBe(false);
    expect(dirOf("ar")).toBe("rtl");
    for (const l of ["en", "de", "fr"] as const) expect(dirOf(l)).toBe("ltr");
  });
});

describe("projects", () => {
  test("all eleven projects exist with unique slugs and orders", () => {
    expect(projects.map((p) => p.slug).sort()).toEqual([...all].sort());
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
    for (const slug of all) expect(getProject(slug).slug).toBe(slug);
    const orders = getProjects().map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  test("every project has non-empty text in all four locales", () => {
    for (const p of projects) {
      for (const locale of locales) {
        const t = p.text[locale];
        for (const field of ["name", "pitch", "summary"] as const) {
          expect(t[field]?.trim(), `${p.slug}.${locale}.${field}`).toBeTruthy();
        }
        for (const v of englishStrings(t)) expect(v.trim(), `${p.slug}.${locale}`).not.toBe("");
      }
      if (p.authorship.kind === "shared") {
        for (const locale of locales) expect(p.authorship.note[locale].trim()).not.toBe("");
      }
    }
  });

  test("featured and case-study projects have every text field", () => {
    for (const p of projects.filter((p) => p.tier === "featured" || p.caseStudy)) {
      for (const locale of locales) {
        const t = p.text[locale];
        expect(t.problem?.trim(), p.slug).toBeTruthy();
        expect(t.contribution?.trim(), p.slug).toBeTruthy();
        expect(t.approach?.trim(), p.slug).toBeTruthy();
        expect(t.features?.length, p.slug).toBeGreaterThan(0);
        expect(t.outcomes?.length, p.slug).toBeGreaterThan(0);
      }
    }
  });

  test("every stack id exists in tech.ts", () => {
    for (const p of projects) {
      expect(p.stack.length, p.slug).toBeGreaterThan(0);
      for (const id of p.stack) expect(tech[id], `${p.slug}: ${id}`).toBeDefined();
    }
  });

  test("featured tier is review, calculator, consultation in order; mg-mobile and crew-mg are in-development", () => {
    expect(getProjects("featured").map((p) => p.slug)).toEqual(["review", "calculator", "consultation"]);
    expect(getProjects("in-development").map((p) => p.slug).sort()).toEqual(["crew-mg", "mg-mobile"]);
    expect(getProjects("further").map((p) => p.slug).sort()).toEqual(
      ["femine-eg", "mawid", "muscle-generator", "qr-studio", "treasure-hunt", "voclio"],
    );
  });

  test("caseStudy is true only for review, calculator, consultation, mg-mobile", () => {
    expect(projects.filter((p) => p.caseStudy).map((p) => p.slug).sort()).toEqual(
      ["calculator", "consultation", "mg-mobile", "review"],
    );
  });

  test("liveUrl is null except qr-studio and consultation; embeddable only qr-studio", () => {
    const live = Object.fromEntries(projects.filter((p) => p.liveUrl).map((p) => [p.slug, p.liveUrl]));
    expect(live).toEqual({
      "qr-studio": "https://queue-r-code.vercel.app",
      consultation: "https://consultatioin.vercel.app",
    });
    expect(projects.filter((p) => p.embeddable).map((p) => p.slug)).toEqual(["qr-studio"]);
  });

  test("repo for muscle-generator is https://github.com/hassan-912/grow-muscle; voclio, femine-eg, treasure-hunt have no repo", () => {
    expect(getProject("muscle-generator").repo).toBe("https://github.com/hassan-912/grow-muscle");
    for (const slug of ["voclio", "femine-eg", "treasure-hunt"] as const) expect(getProject(slug).repo).toBeNull();
    expect(getProject("review").repo).toBe("https://github.com/hassan-912/Review-Project");
    expect(getProject("calculator").repo).toBe("https://github.com/hassan-912/Visa-File-Strength-Calculator");
    expect(getProject("consultation").repo).toBe("https://github.com/hassan-912/consultatioin");
    expect(getProject("crew-mg").repo).toBe("https://github.com/hassan-912/Crew-MG");
    expect(getProject("mawid").repo).toBe("https://github.com/hassan-912/mawe-ed");
    expect(getProject("qr-studio").repo).toBe("https://github.com/hassan-912/queue-r-code-");
  });

  test("voclio and muscle-generator authorship is shared; the other seven are solo", () => {
    const shared = projects.filter((p) => p.authorship.kind === "shared").map((p) => p.slug).sort();
    expect(shared).toEqual(["muscle-generator", "voclio"]);
    for (const slug of ["review", "calculator", "consultation", "mg-mobile", "crew-mg", "mawid", "qr-studio"] as const) {
      expect(getProject(slug).authorship.kind, slug).toBe("solo");
    }
    const voclio = getProject("voclio").authorship;
    expect(voclio.kind === "shared" && voclio.note.en).toMatch(/team of eight/i);
  });

  test("statuses are only those the brief or spec supports", () => {
    expect(getProject("qr-studio").status).toEqual(["public-site"]);
    for (const slug of ["mawid", "femine-eg", "treasure-hunt"] as const) expect(getProject(slug).status, slug).toEqual([]);
  });

  test("mg-mobile status includes in-development and not-released", () => {
    expect(getProject("mg-mobile").status).toEqual(expect.arrayContaining(["in-development", "not-released"]));
    expect(getProject("crew-mg").status).toContain("in-development");
    for (const p of projects) for (const s of p.status) expect(status[s], `${p.slug}: ${s}`).toBeDefined();
  });

  test("demo ids belong to the private MG tools only", () => {
    const withDemo = Object.fromEntries(projects.filter((p) => p.demo).map((p) => [p.slug, p.demo]));
    expect(withDemo).toEqual({
      review: "review", calculator: "calculator", consultation: "consultation",
      "crew-mg": "crew-mg", "mg-mobile": "mg-mobile",
    });
  });

  test("brief's pitches and Crew-MG wording are verbatim", () => {
    const pitch = (s: ProjectSlug) => getProject(s).text.en.pitch;
    expect(pitch("review")).toBe("Make every detail easier to check.");
    expect(pitch("calculator")).toBe("Turn complicated questions into a clearer starting point.");
    expect(pitch("consultation")).toBe("A clearer journey from first booking to follow-up.");
    expect(pitch("mg-mobile")).toBe("Bringing the MG experience into your hand.");
    expect(pitch("mawid")).toBe("Keep the next important step in sight.");
    expect(pitch("qr-studio")).toBe("One scan. A more useful connection.");
    const crew = getProject("crew-mg").text.en;
    expect(crew.pitch).toBe("Company knowledge, with controlled access from the start.");
    expect(crew.summary).toBe(
      "I'm developing an internal platform to help the MG team access company training and visa resources. " +
        "It uses one-time referral links to support controlled onboarding, with access-management features " +
        "being developed around the company's security needs.",
    );
  });
});

describe("tech", () => {
  test("every tech has a readable name, a category and exactly one existing icon", () => {
    const slugs = new Set(Object.values(simpleIcons).map((i) => (i as { slug?: string }).slug));
    for (const [id, t] of Object.entries(tech)) {
      expect(t.name.trim(), id).not.toBe("");
      expect(["language", "framework", "database", "integration", "platform"], id).toContain(t.category);
      expect((t.simpleIcon === null) !== (t.lucide === null), `${id} needs exactly one icon`).toBe(true);
      if (t.simpleIcon) expect(slugs.has(t.simpleIcon), `${id}: simple-icons/${t.simpleIcon}`).toBe(true);
      if (t.lucide) expect(t.lucide in lucide, `${id}: lucide/${t.lucide}`).toBe(true);
    }
  });

  test("brief's glyph-less techs use Lucide icons", () => {
    for (const id of ["ocr", "pdf-reporting", "anabin", "easykash", "cron-triggers", "web-push"]) {
      expect(tech[id]?.simpleIcon, id).toBeNull();
      expect(tech[id]?.lucide, id).toBeTruthy();
    }
  });
});

describe("diagrams", () => {
  test("four project-specific diagrams with valid nodes and edges", () => {
    expect(diagrams.map((d) => d.project).sort()).toEqual(["calculator", "consultation", "mg-mobile", "review"]);
    for (const d of diagrams) {
      const ids = new Set(d.nodes.map((n) => n.id));
      expect(ids.size, d.project).toBe(d.nodes.length);
      for (const [from, to] of d.edges) {
        expect(ids.has(from), `${d.project}: ${from}`).toBe(true);
        expect(ids.has(to), `${d.project}: ${to}`).toBe(true);
      }
      for (const n of d.nodes) {
        for (const id of n.tech) expect(tech[id], `${d.project}/${n.id}: ${id}`).toBeDefined();
        for (const locale of locales) {
          expect(n.label[locale].trim()).not.toBe("");
          expect(n.explain[locale].trim()).not.toBe("");
        }
      }
    }
  });
});

describe("site, story, services", () => {
  test("contacts match the verified values exactly", () => {
    expect(site.contacts).toEqual({
      whatsapp: { e164: "+201023174210", href: "https://wa.me/201023174210" },
      email: "hassanazb.56@gmail.com",
      linkedin: "https://www.linkedin.com/in/hassan-azb-b60587246/",
      github: "https://github.com/hassan-912",
    });
    expect(site.name).toBe("Hassan Azab");
    expect(site.url).toBe("https://azab.dev");
    expect(site.location.en).toBe("New Cairo, Cairo, Egypt");
    expect(site.cvUrl).toBeNull();
    expect(site.portrait).toBeNull();
  });

  test("story ends with the brief's exact 'leave a place better' line", () => {
    expect(story.quote.en).toBe(
      "I want to leave a place better than I found it—with clearer systems, easier work, " +
        "and something useful that continues to make a difference.",
    );
    expect(story.chapters.length).toBeGreaterThanOrEqual(5);
  });

  test("services list five outcomes and three steps: understand, build, improve", () => {
    expect(services.outcomes).toHaveLength(5);
    expect(services.steps.map((s) => s.id)).toEqual(["understand", "build", "improve"]);
  });

  test("no English copy contains banned claim patterns", () => {
    const banned = [
      /\d+\s*%/, /years? of (engineering )?experience/i, /guarantee/i, /approval rate/i,
      /\b\d+\+? countries\b/i, /testimonial/i, /senior/i, /certified/i, /app store|google play/i,
      /partner/i, /predict/i, /accura(te|cy)/i,
    ];
    const strings = englishStrings([en, projects, story, services, diagrams, status, site]);
    expect(strings.length).toBeGreaterThan(200);
    for (const s of strings) for (const re of banned) expect(s, `${re} in: ${s}`).not.toMatch(re);
  });

  test("English copy never mentions Laravel or an app-store release", () => {
    const strings = englishStrings([en, projects, story, diagrams]);
    for (const s of strings) {
      expect(s).not.toMatch(/laravel/i);
      expect(s).not.toMatch(/\b(now available|download (it|the app)|released on)\b/i);
    }
  });
});
