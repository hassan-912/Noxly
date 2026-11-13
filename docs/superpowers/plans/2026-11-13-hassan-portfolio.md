# Hassan Azab Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A statically exported, four-language (EN/DE/FR/AR-RTL) portfolio for Hassan Azab that wins software clients through honest, well-presented projects, two cinematic moments, and coded demos with sample data.

**Architecture:** Next.js App Router with `output: "export"`, locale segment `/[locale]` built via `generateStaticParams`. All facts, copy, contacts, and status labels live in typed files under `src/content/`. UI sections are client components only where they need interaction or motion. Private MG tools appear as React demo components that reflow by container width inside a device frame.

**Tech Stack:** Node 22, Next.js 16.4, React 19, TypeScript (strict), Tailwind CSS 4.3, `motion` 14, Simple Icons + Lucide, Vitest (unit), Playwright 1.65 + `@axe-core/playwright` (e2e/a11y).

**Spec:** `docs/superpowers/specs/2026-11-13-hassan-portfolio-design.md` (approved). The full content brief is `docs/brief.md`. Executors read both.

**Model routing (user preference):** Tasks marked **[Fable]** go to a subagent with `model: "fable"`. All other tasks run on the default model.

## Global Constraints

- **Claims:** every factual claim traces to `docs/brief.md`, the spec, or a public repo. Never invent metrics, testimonials, approval rates, country counts, seniority, or years of engineering experience.
- **Operations work:** the ~10 months of visa operations are industry experience, never engineering experience.
- **AI vs deterministic:** AI-assisted review is always visually and verbally distinct from deterministic checks. No claims of guaranteed accuracy, universal document support, or approval prediction.
- **Calculator output** is a "preliminary MG assessment", never an official eligibility decision.
- **MG Mobile** shows "In development · not released": no app-store badges, no release wording, no Laravel, no travel-provider partnerships.
- **Crew-MG security** is an ongoing development requirement, never complete or certified. Use the brief's exact Crew-MG wording.
- **Demo label:** every coded demo shows "Illustrative demo · sample data" (localized). No real customer data.
- **Authorship:**
  - Solo: Review, Calculator, Consultation, MG Mobile, Crew-MG, Mawid, QR Studio.
  - Shared: Voclio ("team of eight"), Muscle Generator (team).
- **Links:**
  - Live: `https://queue-r-code.vercel.app` (embed, click-to-load) and `https://consultatioin.vercel.app` (external link only; it sends `X-Frame-Options: DENY`).
  - No links for Crew-MG live, Femine-EG, Voclio, Treasure Hunt, or the Muscle Generator live site.
  - Muscle Generator links only `https://github.com/hassan-912/grow-muscle`.
- **Contacts:**
  - WhatsApp `+201023174210` → `https://wa.me/201023174210`
  - Email `hassanazb.56@gmail.com`
  - LinkedIn `https://www.linkedin.com/in/hassan-azb-b60587246/`
  - GitHub `https://github.com/hassan-912`
- **Site URL:** placeholder `https://azab.dev`. The build prints a warning while it is the placeholder.
- **Accessibility:** WCAG 2.2 AA. Every hover effect has focus-visible and tap equivalents. `prefers-reduced-motion` removes drift, scramble, scroll-linked transforms, and stagger.
- **Never:** smooth-scroll libraries, scroll locking, looping glitch effects, a loader, or content hidden until an animation finishes.
- **No horizontal overflow** at 360, 375, 768, 1024, or 1440px in any locale.
- **Use CSS logical properties** only (`ms-`/`me-`/`ps-`/`pe-`/`start`/`end`); no `left`/`right` in layout.
- **Latin script in every locale:** numbers, counters, dates, and technology names (no Arabic-Indic digits). Pinned in Task 11 (test: `ar` strings contain no `[٠-٩]`).
- **Colours (exact):**

  | Token | Value |
  |---|---|
  | ink | `#0E1A24` |
  | ink-muted | `#4A6878` |
  | slate | `#5C7E8F` |
  | surface | `#FFFFFF` |
  | frost | `#F4F7F9` |
  | mist | `#D4DDE2` |
  | grey | `#A2A2A2` |
  | indigo | `#525AFF` |
  | periwinkle | `#6D8BC0` |
  | teal | `#4AB5B5` |
  | teal-text | `#2C7F80` |
  | sky | `#8FD9FB` |

  Slate, grey, teal, and sky are never small text.
- **Fonts:** Geist, Geist Mono, IBM Plex Sans Arabic (via `next/font`).

## Review Focus

1. **Long German and French strings** at 360px (nav, CTAs, rail chips, status pills) must wrap or truncate without horizontal overflow. Pinned in Task 12 (overflow test runs per locale).
2. **Arabic RTL with embedded Latin tech names and numbers** (e.g. "Next.js", "01 / 03") must render in the correct order. The project rail, diagram flow, and directional arrows must mirror. Pinned in Tasks 5 and 7 (RTL assertions) and Task 3 (`dir`).
3. **No JavaScript or slow JavaScript:** the headline, intro, CTAs, project text, and contact links must be in the static HTML and visible without JS. Pinned in Task 4 (`javaScriptEnabled: false` test).
4. **Live site down or blocked:** QR Studio's iframe failing must leave the poster and an external link, never a blank or broken frame. Pinned in Task 6 (route-abort test).
5. **Keyboard-only and touch-only visitors** on the rail, device controls, diagram nodes, and the expandable index must reach every hover-revealed detail. Pinned in Tasks 5, 6, 7, and 8 (keyboard tests) and Task 12 (axe).

---

## File Structure

```
next.config.ts                     # output: "export", images.unoptimized, trailingSlash: true
src/app/(root)/layout.tsx, page.tsx            # "/" language redirect page (own <html>)
src/app/[locale]/layout.tsx                    # <html lang dir>, fonts, Header, Footer, SkipLink
src/app/[locale]/page.tsx                      # home: all sections in spec §7 order
src/app/[locale]/work/[slug]/page.tsx          # case studies
src/app/[locale]/opengraph-image.tsx           # per-locale OG (fallback: scripts/og.ts → public/og/*.png)
src/app/sitemap.ts, robots.ts
src/content/types.ts, site.ts, status.ts, tech.ts, projects.ts, diagrams.ts, story.ts, services.ts
src/content/i18n/en.ts, de.ts, fr.ts, ar.ts, index.ts
src/lib/i18n.ts, metadata.ts, motion.ts, cn.ts
src/components/layout/  Header, LanguageMenu, MobileNav, Footer, SkipLink
src/components/ui/      ScrambleText, StatusPill, TechLabel, GlowSurface, SectionHeading
src/components/hero/    Hero, Aurora, StaggerHeadline, HeroComposition
src/components/demos/   DemoLabel, ReviewDemo, CalculatorDemo, ConsultationDemo, CrewDemo, MobileScreens, data/*.ts
src/components/work/    ProjectViewer, ProjectRail, DeviceControls, DeviceFrame, ProjectInfo, LiveEmbed
src/components/diagram/ TechDiagram, DiagramCanvas, NodePanel
src/components/sections/ Services, Story, FurtherProjects, CurrentDevelopment, MobileReveal, Contact
src/components/casestudy/ CaseStudy
scripts/capture-posters.ts, scripts/check-site-url.ts
public/posters/qr-studio.webp
tests/unit/*.test.ts       tests/e2e/*.spec.ts
```

---

### Task 1: Scaffold, tokens, fonts, test harness

**Files:**
- Create: the project via `create-next-app`, `next.config.ts`, `src/app/globals.css`, `src/lib/cn.ts`, `vitest.config.ts`, `playwright.config.ts`, `scripts/check-site-url.ts`, `README.md`, `.gitignore`.
- Test: `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`.

**Interfaces:**
- Produces:
  - Tailwind theme tokens `ink`, `ink-muted`, `slate`, `surface`, `frost`, `mist`, `grey`, `indigo`, `periwinkle`, `teal`, `teal-text`, and `sky` (as `--color-*` in `@theme`).
  - Font CSS vars `--font-sans`, `--font-mono`, and `--font-arabic`.
  - npm scripts `dev`, `build` (runs `check-site-url` then `next build`), `test` (vitest), `test:e2e` (playwright against `npx serve out -l 4173`).
  - `cn(...classes: ClassValue[]): string`.

- [ ] **Step 1:** Scaffold and merge into the project root.
  - `create-next-app` refuses a folder that already contains `docs/`, so scaffold into a sibling temp folder: `npx create-next-app@16.4.6 ../azab-scaffold --ts --tailwind --app --src-dir --eslint --use-npm --import-alias "@/*" --yes`.
  - Move its contents (including dotfiles, excluding `.git`) into the project root and delete the temp folder.
  - Run `git init`. Keep the existing `docs/`.
- [ ] **Step 2:** Install the dev tools:
  ```bash
  npm i motion lucide-react simple-icons clsx
  npm i -D vitest @playwright/test @axe-core/playwright serve tsx
  npx playwright install chromium
  ```
- [ ] **Step 3:** Set up the config and global styles.
  - `next.config.ts`: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`.
  - `globals.css`:
    - Tokens with the exact hex values from Global Constraints.
    - Focus ring: `:focus-visible { outline: 2px solid #525AFF; outline-offset: 3px }`.
    - `html { scroll-padding-top: 5rem }`.
    - A `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration`/`transition-duration` to `0.01ms`.
- [ ] **Step 4:** Write `scripts/check-site-url.ts`. It reads `site.url` (a stub `src/content/site.ts` for now) and prints `⚠ site.url is the placeholder https://azab.dev — set the real domain before launch` when it matches. It exits 0.
- [ ] **Step 5:** Write the smoke tests.
  - Unit: `expect(1).toBe(1)` to prove the vitest wiring.
  - E2e: visit `/en/` and expect status 200 (temporary; replaced in Task 3).
- [ ] **Step 6:** Run `npm run build && npm test`. Expected: `out/` exists, vitest passes, and the placeholder warning is printed.
- [ ] **Step 7:** Write `README.md` with run, build, and test instructions plus a "Launch blockers" list (domain, native-speaker translation review, portrait, Femine-EG/Voclio/Treasure Hunt links). Commit with `chore: scaffold Next.js static site with tokens and test harness`.

### Task 2: Content layer and English copy

**Files:**
- Create:
  - Content: `src/content/{types,site,status,tech,projects,diagrams,story,services}.ts`.
  - Dictionaries: `src/content/i18n/{en,index}.ts`, plus `de.ts`, `fr.ts`, and `ar.ts` as temporary copies of `en`, marked `// TODO(task 11)`.
  - Helpers: `src/lib/i18n.ts`.
- Test: `tests/unit/content.test.ts`.

**Interfaces:**
- Produces:
```ts
// types.ts
export const locales = ["en", "de", "fr", "ar"] as const;
export type Locale = typeof locales[number];
export type Localized<T> = Record<Locale, T>;
export type ProjectSlug = "review" | "calculator" | "consultation" | "mg-mobile" | "crew-mg" | "mawid"
  | "qr-studio" | "voclio" | "femine-eg" | "treasure-hunt" | "muscle-generator";
export type DemoId = "review" | "calculator" | "consultation" | "crew-mg" | "mg-mobile";
export type StatusKey = "internal-tool" | "public-site" | "in-development" | "not-released"
  | "graduation-project" | "client-store" | "study-project" | "personal-project" | "team-project";
export type TechId = string; // keys of tech.ts
export interface ProjectText { name: string; pitch: string; summary: string; problem?: string;
  contribution?: string; approach?: string; features?: string[]; outcomes?: string[]; }
export interface Project { slug: ProjectSlug; tier: "featured" | "further" | "in-development"; order: number;
  repo: string | null; liveUrl: string | null; embeddable: boolean; demo: DemoId | null;
  stack: TechId[]; status: StatusKey[]; authorship: { kind: "solo" } | { kind: "shared"; note: Localized<string> };
  caseStudy: boolean; text: Localized<ProjectText>; }
// site.ts
export const site: { name: string; url: string; location: Localized<string>;
  contacts: { whatsapp: { e164: "+201023174210"; href: "https://wa.me/201023174210" }; email: string;
  linkedin: string; github: string }; cvUrl: null; portrait: null };
// lib/i18n.ts
export function getDictionary(locale: Locale): Dictionary;   // Dictionary = type of en (strings widened)
export function isLocale(x: string): x is Locale;
export function dirOf(locale: Locale): "ltr" | "rtl";
export function getProjects(tier?: Project["tier"]): Project[];  // sorted by order
export function getProject(slug: ProjectSlug): Project;
// diagrams.ts
export interface DiagramNode { id: string; label: Localized<string>; tech: TechId[]; explain: Localized<string>; col: number; row: number; }
export interface Diagram { project: "review" | "consultation" | "calculator" | "mg-mobile"; nodes: DiagramNode[]; edges: [string, string][]; }
export const diagrams: Diagram[];
```

- [ ] **Step 1: Write the failing tests** in `tests/unit/content.test.ts`:
```ts
test("every locale dictionary has exactly the keys of en", ...)   // deep key comparison, no empty strings
test("every project has non-empty text in all four locales", ...)
test("every stack id exists in tech.ts", ...)
test("featured tier is review, calculator, consultation in order; mg-mobile and crew-mg are in-development", ...)
test("caseStudy is true only for review, calculator, consultation, mg-mobile", ...)
test("liveUrl is null except qr-studio and consultation; embeddable only qr-studio", ...)
test("repo for muscle-generator is https://github.com/hassan-912/grow-muscle; voclio, femine-eg, treasure-hunt have no repo", ...)
test("voclio and muscle-generator authorship is shared; the other seven are solo", ...)
test("mg-mobile status includes in-development and not-released", ...)
test("contacts match the verified values exactly", ...)
test("no English copy contains banned claim patterns", ...)
  // regexes, case-insensitive: /\d+\s*%/, /years? of (engineering )?experience/i, /guarantee/i,
  // /approval rate/i, /\b\d+\+? countries\b/i, /testimonial/i, /senior/i, /certified/i, /app store|google play/i
```
- [ ] **Step 2:** Run `npx vitest run tests/unit/content.test.ts`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement the types, `site.ts`, `status.ts` (localized labels), and `tech.ts`.**
  - `tech.ts` covers every tech named in the brief: readable name, Simple Icons slug or `null`, and a category.
  - Techs without a Simple Icons glyph (OCR, PDF reporting, Anabin, EasyKash, Cron Triggers, Web Push) use a Lucide icon name instead.
- [ ] **Step 4: Write the English copy in `projects.ts`, `story.ts`, `services.ts`, `diagrams.ts`, and `en.ts`.**
  - Sources: only the brief's facts plus Global Constraints.
  - Use the brief's pitches verbatim, and the Crew-MG paragraph verbatim.
  - Featured and case-study projects get all fields; further projects get `name`, `pitch`, `summary`, and optionally `features`.
  - `outcomes` are qualitative statements of what now exists or is easier (e.g. "Reviewers see each discrepancy next to the source text it came from").
  - The story follows spec §7.6 and ends with the brief's exact "leave a place better" line.
  - Diagram nodes follow the four pipelines in the brief.
- [ ] **Step 5:** Run `npx vitest run`. Expected: PASS. (The locale-completeness test passes because the DE/FR/AR files are still copies.)
- [ ] **Step 6:** Commit with `feat(content): typed content layer and English copy`.

### Task 3: Locale routing, layout shell, navigation, metadata

**Files:**
- Create:
  - Routes: `src/app/(root)/{layout,page}.tsx`, `src/app/[locale]/{layout,page}.tsx`, `src/app/[locale]/opengraph-image.tsx`, `src/app/{sitemap,robots}.ts`.
  - Helpers: `src/lib/metadata.ts`.
  - Layout components: `src/components/layout/*`.
- Test: `tests/e2e/shell.spec.ts`, `tests/unit/metadata.test.ts`.

**Interfaces:**
- Consumes: `getDictionary`, `dirOf`, `site`, `locales`.
- Produces:
  - `buildMetadata(locale: Locale, path: string, title?: string, description?: string): Metadata`, with canonical and `alternates.languages` for all four locales plus `x-default` → `/en/`.
  - Section anchor ids: `#work`, `#systems`, `#services`, `#story`, `#projects`, `#building`, `#contact`. Later tasks render their section with exactly these ids; the home page imports placeholders until then.

- [ ] **Step 1: Write the failing tests.**
  - E2e:
    ```ts
    test("each locale sets lang and dir", ...)            // ar → dir="rtl", others "ltr"
    test("language menu switches locale and keeps hash", ...)  // from /en/#services pick Deutsch → /de/#services
    test("language menu is keyboard operable", ...)        // Tab to trigger, Enter, ArrowDown, Enter
    test("skip link moves focus to main", ...)
    test("mobile nav at 375px opens, traps focus, closes on Escape", ...)
    test("root page links to all four locales", ...)
    ```
  - Unit:
    ```ts
    test("buildMetadata gives hreflang for en, de, fr, ar and x-default", ...)
    test("sitemap lists 4 home URLs and 16 case-study URLs", ...)
    ```
- [ ] **Step 2:** Run `npm run build && npx playwright test tests/e2e/shell.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement the locale layout and root page.**
  - `[locale]/layout.tsx`: `generateStaticParams` over `locales`; `<html lang={locale} dir={dirOf(locale)}>`; the Arabic font class applied when `ar`; JSON-LD `Person` (name, jobTitle, address New Cairo, `sameAs` LinkedIn/GitHub).
  - `(root)/page.tsx`: a small client script that picks the best locale from `navigator.languages` and calls `location.replace`, plus visible plain links and a `<noscript>` note.
- [ ] **Step 4: Implement the header, menus, and footer.**
  - Header: frosted sticky bar, wordmark, anchor links, the LanguageMenu (a menu button with native-name options: English, Deutsch, Français, العربية), and a "Let's talk" link to WhatsApp.
  - MobileNav: dialog sheet below `md`.
  - Footer: contacts plus "No cookies, no tracking".
- [ ] **Step 5: Implement the metadata.**
  - `opengraph-image.tsx` renders the name, title, and value proposition on frost with the indigo accent, one per locale.
  - If static export rejects it, replace it with `scripts/og.ts` (satori + resvg) writing `public/og/{locale}.png`, referenced from `buildMetadata`.
- [ ] **Step 6:** Run the tests. Expected: PASS.
- [ ] **Step 7:** Commit with `feat(shell): locale routing, header, language menu, metadata`.

### Task 4: Hero and introduction **[Fable]**

**Files:**
- Create: `src/components/hero/{Hero,Aurora,StaggerHeadline,HeroComposition}.tsx`, `src/components/ui/ScrambleText.tsx`, `src/lib/motion.ts`.
- Test: `tests/e2e/hero.spec.ts`, `tests/unit/scramble.test.ts`.

**Interfaces:**
- Consumes: `getDictionary`, `site.contacts`. `HeroComposition` uses static thumbnails of the demos from Task 5 if they exist; until then it uses its own simplified static mock screens. Leave a `// swap after task 5` note.
- Produces:
  - `useMotionOK(): boolean` (false under reduced motion).
  - `<ScrambleText text: string; as?: ElementType; once?: true; durationMs?: number />`, which renders the final text in the HTML and scrambles only after mount when `useMotionOK()`.
  - `scrambleFrame(target: string, progress: number, rng: () => number): string` (pure).

- [ ] **Step 1: Write the failing tests.**
  - Unit:
    ```ts
    test("scrambleFrame at progress 1 returns target exactly", ...)
    test("scrambleFrame keeps spaces and length", ...)
    test("scrambleFrame reveals left-to-right in logical order", ...)   // index < progress*len equals target char
    ```
  - E2e:
    ```ts
    test("h1 text and both CTAs are present with JS disabled", ...)   // javaScriptEnabled: false
    test("primary CTA → https://wa.me/201023174210, secondary → #work", ...)
    test("reduced motion: no element has a running animation on the aurora and h1 text equals final text immediately", ...)
    test("h1 is visible within 300ms of load", ...)   // no loader
    test("aurora pauses when hero is off-screen", ...) // data-paused="true" after scrolling past
    ```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement the hero** to spec §9 moment 1.
  - Layout: an asymmetric split, with text at the start side and the product composition at the end side.
  - Aurora: CSS gradient layers drifting over ~20s and paused through IntersectionObserver.
  - Headline: words stagger in over ≤1s total using opacity/translate only.
  - Scramble: the brief's "simpler" fragment (localized equivalent from the dictionary key `hero.scrambleWord`) scrambles once in ~600ms.
  - Composition: 2–3 tilted, layered screens settle via `useScroll` over the first viewport.
- [ ] **Step 4:** Run the tests. Expected: PASS. Check visually at 375, 768, and 1440px in the browser pane.
- [ ] **Step 5:** Commit with `feat(hero): cinematic hero with aurora, stagger and one-time scramble`.

### Task 5: Coded demos with sample data **[Fable]**

**Files:**
- Create: `src/components/demos/{DemoLabel,ReviewDemo,CalculatorDemo,ConsultationDemo,CrewDemo,MobileScreens}.tsx`, `src/components/demos/data/{review,calculator,consultation,crew,mobile}.ts`, `src/components/demos/registry.ts`.
- Test: `tests/e2e/demos.spec.ts` (against a test-only route `src/app/[locale]/__demos/page.tsx`, excluded from the sitemap and set to `noindex`).

**Interfaces:**
- Produces:
  - `demoRegistry: Record<DemoId, React.LazyExoticComponent<ComponentType<DemoProps>>>`, where `DemoProps = { locale: Locale }`.
  - `<MobileScreens locale screen?: "home" | "assessment" | "ticket" | "staff" lang: "en" | "ar" />` for Task 9.
  - Every demo root has `data-demo={id}` and `container-type: inline-size`, and renders `<DemoLabel/>`.

- [ ] **Step 1: Write the failing tests:**
```ts
test("every demo shows the localized 'Illustrative demo · sample data' label", ...)
test("review: deterministic findings and AI-assisted check are in separately labelled regions", ...)
  // getByRole("region",{name:/factual checks/i}) and /AI-assisted/i both exist and differ
test("review: selecting a discrepancy reveals its source evidence (keyboard Enter works)", ...)
test("calculator: completing the questionnaire shows 'Preliminary MG assessment' and the not-official disclaimer", ...)
test("consultation: booking flow reaches a QR ticket; payment step says it is a mock", ...)
test("crew: generated referral link shows 'used' after one simulated use", ...)
test("mobile screens render in ar with dir=rtl inside the phone", ...)
test("each demo reflows: at container 360px no element overflows the frame", ...)
test("no demo makes a network request", ...)   // page.on('request') only same-origin static assets
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement the data files.** Use obviously synthetic data: fictional names (e.g. "Sample Applicant A"), fixed sample exchange rates labelled "sample rate", and no real company records.
- [ ] **Step 4: Implement each demo** to the scope in spec §10.
  - Calm UI in the site palette, so the demos read as one family of products.
  - Container queries at roughly 420px and 760px.
  - All text comes from the dictionary keys `demos.*`.
- [ ] **Step 5:** Run the tests. Expected: PASS. Commit with `feat(demos): coded sample-data demos for MG tools`.

### Task 6: Project viewer **[Fable]**

**Files:**
- Create: `src/components/work/{ProjectViewer,ProjectRail,DeviceControls,DeviceFrame,ProjectInfo,LiveEmbed}.tsx`, `src/components/ui/{TechLabel,StatusPill,GlowSurface}.tsx`, `scripts/capture-posters.ts`, `public/posters/qr-studio.webp`.
- Test: `tests/e2e/viewer.spec.ts`.

**Interfaces:**
- Consumes: `getProjects("featured")`, `demoRegistry`, `tech`, `status`.
- Produces:
  - `<ProjectViewer locale projects: Project[] />`, rendered in `#work`.
  - `<LiveEmbed url poster title locale />`, reused by Task 8 for QR Studio.
  - `<TechLabel id: TechId />` and `<StatusPill status: StatusKey />`.
  - `<GlowSurface>`: cursor-tracked glow on pointer devices, with the same highlight on `:focus-visible` and on `:active` for touch.

- [ ] **Step 1: Write the failing tests:**
```ts
test("rail is a tablist; ArrowRight/ArrowLeft move selection (mirrored in ar)", ...)
test("switching project updates title, counter '02 / 03', stack labels and links", ...)
test("device radio group sets frame width: desktop ≥ 960, tablet 768, phone 390 (clamped to viewport)", ...)
test("device controls are hidden below 768px viewport and frame shows phone layout", ...)
test("demo chunk is not requested until viewer is near viewport", ...)
test("consultation shows 'Visit site' external link with rel=noopener and no iframe", ...)
test("each project links repo and case study; links open correct URLs", ...)
test("LiveEmbed: no iframe before click; after click iframe src is queue-r-code.vercel.app", ...)
test("LiveEmbed: when the frame request is aborted, poster and external link remain visible", ...)
  // page.route("https://queue-r-code.vercel.app/**", r => r.abort()); after 8s timeout → fallback shown
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement `capture-posters.ts`** (Playwright, 1440×900 screenshot of QR Studio converted to WebP at quality ≤ 80). Run it once and commit the image. If capture fails, write no file and print an error; `LiveEmbed` then renders the designed fallback card.
- [ ] **Step 4: Implement the viewer.**
  - Rail on the start side (on top below `lg`).
  - Stage with a frosted control bar.
  - `ProjectInfo` beside the stage on `xl` and below it otherwise.
  - Crossfade between projects (instant under reduced motion).
  - Frame width animates between devices.
- [ ] **Step 5:** Run the tests. Expected: PASS. Commit with `feat(work): project viewer with device previews and click-to-load embed`.

### Task 7: Interactive technology diagram **[Fable]**

**Files:**
- Create: `src/components/diagram/{TechDiagram,DiagramCanvas,NodePanel}.tsx`.
- Test: `tests/e2e/diagram.spec.ts`, `tests/unit/diagram-layout.test.ts`.

**Interfaces:**
- Consumes: `diagrams`, `tech`.
- Produces:
  - `<TechDiagram locale initial?: Diagram["project"] />`, used in `#systems` and on case studies.
  - `layoutDiagram(d: Diagram, dir: "ltr" | "rtl", orientation: "horizontal" | "vertical"): { nodes: {id; x; y}[]; paths: {from; to; d: string}[] }` (pure).

- [ ] **Step 1: Write the failing tests.**
  - Unit:
    ```ts
    test("ltr: x increases with col; rtl: x decreases with col", ...)
    test("vertical: y increases with col, x by row", ...)
    test("every edge has a path whose endpoints sit on its nodes", ...)
    ```
  - E2e:
    ```ts
    test("tabs switch between review, consultation, calculator, mobile with different node sets", ...)
    test("nodes are buttons; Enter selects and panel shows that node's explanation", ...)
    test("caption 'Illustrative animation — not live traffic' is always visible", ...)
    test("reduced motion: path dash animation is not running", ...)
    test("375px: vertical layout and panel as bottom sheet, no overflow", ...)
    ```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement the diagram.** Use SVG with animated `stroke-dashoffset` dashes, run only while in view. Show a selected-node halo in indigo. The node panel uses `aria-live="polite"`.
- [ ] **Step 4:** Run the tests. Expected: PASS. Commit with `feat(diagram): project-specific interactive architecture diagram`.

### Task 8: Services, Story, Further projects, Contact

**Files:**
- Create: `src/components/sections/{Services,Story,FurtherProjects,Contact}.tsx`, `src/components/ui/SectionHeading.tsx`.
- Test: `tests/e2e/sections.spec.ts`.

**Interfaces:**
- Consumes: `services`, `story`, `getProjects("further")`, `LiveEmbed`, `TechLabel`, `StatusPill`, `ScrambleText`, `site`.

- [ ] **Step 1: Write the failing tests:**
```ts
test("services lists five outcomes and three steps: understand, build, improve", ...)
test("story contains the exact 'leave a place better' sentence and no 'years of experience'", ...)
test("story portrait slot shows 'HA' monogram with aria-hidden and no <img>", ...)
test("QR Studio and Mawid render as medium entries; QR Studio has LiveEmbed", ...)
test("index rows (voclio, femine-eg, treasure-hunt, muscle-generator) expand with Enter/Space and aria-expanded", ...)
test("voclio shows 'team of eight' and no link; muscle-generator links grow-muscle repo only", ...)
test("contact: WhatsApp, mailto, LinkedIn, GitHub hrefs exact; copy-email button announces 'Copied'", ...)
test("section headings use ScrambleText only on the small counter label", ...)
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement the sections** with the layouts from spec §8:
  - Services: a numbered editorial list.
  - Story: a vertical timeline (start-side rail) with a pull quote.
  - Further projects: medium entries plus an index of `<button aria-expanded>` rows.
  - Contact: one large typographic block with the location line.
- [ ] **Step 4:** Run the tests. Expected: PASS. Commit with `feat(sections): services, story, further projects, contact`.

### Task 9: Current development — MG Mobile reveal and Crew-MG **[Fable]**

**Files:**
- Create: `src/components/sections/{CurrentDevelopment,MobileReveal}.tsx`.
- Test: `tests/e2e/mobile-reveal.spec.ts`.

**Interfaces:**
- Consumes: `MobileScreens`, `demoRegistry["consultation"]` (as a static desktop frame), `demoRegistry["crew-mg"]`, `StatusPill`, `useMotionOK`.

- [ ] **Step 1: Write the failing tests:**
```ts
test("'In development · not released' is visible at every scroll position through the stage", ...) // sample 5 positions
test("desktop: stage is sticky ~150vh and frame morphs (width shrinks) as user scrolls", ...)
test("375px viewport: no sticky element; static composition with phone screens", ...)
test("reduced motion at 1440px: no sticky element; static composition", ...)
test("page scrolls freely through the section (window.scrollY reaches section end with wheel)", ...)
test("both en and ar phone screens are shown; no app-store text or badges", ...)
test("crew-mg block uses the brief's exact wording and links only the repo", ...)
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement the reveal** to spec §9 moment 2, using `useScroll` on the section with transforms only (width/radius/scale). No `overflow: hidden` on `body` and no wheel listeners.
- [ ] **Step 4:** Run the tests. Expected: PASS. Commit with `feat(building): MG Mobile reveal and Crew-MG`.

### Task 10: Case-study pages

**Files:**
- Create: `src/app/[locale]/work/[slug]/page.tsx`, `src/components/casestudy/CaseStudy.tsx`.
- Modify: `src/app/[locale]/page.tsx` (final section order; remove placeholders).
- Test: `tests/e2e/casestudy.spec.ts`.

**Interfaces:**
- Consumes: `getProject`, `TechDiagram`, `demoRegistry`, `MobileScreens`, `buildMetadata`.

- [ ] **Step 1: Write the failing tests:**
```ts
test("16 routes exist: 4 locales × review, calculator, consultation, mg-mobile", ...)
test("crew-mg has no case study route (404 in export)", ...)
test("each page has headings: problem, contribution, approach, features, stack, status, outcomes", ...)
test("mg-mobile page shows not-released status above the fold", ...)
test("each page embeds the matching diagram tab and demo", ...)
test("each page has a working back link to /{locale}/#work and a contact CTA", ...)
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement** with `generateStaticParams` over locales × case-study projects and `buildMetadata` per page. Wire the home page sections in spec §7 order.
- [ ] **Step 4:** Run the tests. Expected: PASS. Commit with `feat(work): case-study pages`.

### Task 11: German, French and Arabic translations

**Files:**
- Modify: `src/content/i18n/{de,fr,ar}.ts` and the `de`/`fr`/`ar` entries in `projects.ts`, `story.ts`, `services.ts`, `diagrams.ts`, `status.ts`, and `site.ts`.
- Test: `tests/unit/content.test.ts` (extend).

- [ ] **Step 1: Add failing tests:**
```ts
test("no de/fr/ar string is identical to its en counterpart, except tech names, URLs and proper nouns allow-list", ...)
test("ar strings contain Arabic script; de/fr strings contain no Arabic script", ...)
test("ar strings contain no Arabic-Indic digits [٠-٩]", ...)
test("banned-claim regexes also pass in de/fr (translated patterns: Prozent|Jahre Erfahrung|garantiert; ans d'expérience|garanti)", ...)
```
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Translate.**
  - Tone: sincere and confident, first person, natural rather than literal.
  - Arabic: Modern Standard Arabic, with Latin tech names kept as-is.
  - Keep the brief's quoted lines faithful in meaning.
  - Add a `translationReviewNeeded: true` flag in `src/content/i18n/index.ts`, surfaced in the README.
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS. Then check `/ar/` at 375 and 1440px in the browser pane for bidi order and mirroring.
- [ ] **Step 5:** Commit with `feat(i18n): German, French and Arabic content`.

### Task 12: Whole-site verification and polish

**Files:**
- Create: `tests/e2e/{overflow,a11y,links}.spec.ts`.
- Modify: whatever the checks find.

- [ ] **Step 1: Write the tests:**
```ts
for each locale × [360, 375, 768, 1024, 1440]:
  test("no horizontal overflow on home and each case study", ...)  // document.documentElement.scrollWidth <= innerWidth
for each locale:
  test("axe finds no serious or critical violations on home and one case study", ...)
test("every external link is in the allow-list from Global Constraints and has rel=noopener", ...)
test("no request to any third-party origin happens before user interaction", ...)
```
- [ ] **Step 2:** Run `npm run build && npx playwright test`. Fix failures until everything passes.
- [ ] **Step 3:** Run Lighthouse (mobile) on `/en/` and `/ar/` against `out/` served locally. Targets: performance ≥ 90, accessibility 100. Fix regressions.
- [ ] **Step 4:** Do a manual pass in the browser pane at phone, tablet, and desktop sizes, with and without reduced motion, in `en` and `ar`. Note anything off.
- [ ] **Step 5:** Finalise the README launch-blocker list (domain, native-speaker review, portrait, Femine-EG/Voclio/Treasure Hunt links, Muscle Generator live URL, missing reference screenshots). Commit with `test: whole-site verification; docs: launch blockers`.
