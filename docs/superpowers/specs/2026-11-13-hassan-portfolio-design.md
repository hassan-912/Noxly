# Hassan Azab — Portfolio Design

Date: 2026-11-13 · Status: draft for approval

## 1. Intent

A personal portfolio that wins Hassan Azab software work from startups, businesses, and freelance clients. It proves capability through specific, honestly described projects and a sincere personal story: someone who understood the work behind the software (visa operations) and then built tools to make it easier.

Value proposition: "I understand the work behind the software—and build tools that make it easier."

The full content brief (identity, story facts, project facts, tech stacks, repo links, wording rules) is the source of truth for copy and claims. It is saved verbatim at `docs/brief.md` and this design does not repeat it.

## 2. Goals, non-goals, anti-goals

**Goals**
- A visitor understands within one screen who Hassan is, what he builds, and how to contact him.
- Featured work is reachable in one click/scroll, without waiting for any animation.
- Each project explains problem, contribution, approach, features, stack, status, and demonstrable outcomes.
- Complete EN / DE / FR / AR content, with a proper right-to-left Arabic layout.
- Calm, light-first, premium feel, with two cinematic moments (hero and the MG Mobile reveal).
- Easy for Hassan to update: content, translations, contacts, and status labels live in typed data files.

**Non-goals**
- No contact form, blog, CMS, analytics, or cookie banner.
- No live embedding of private company tools.

**Anti-goals (failure even if it "works")**
- Any invented metric, testimonial, approval rate, country count, seniority, or years of engineering experience.
- Presenting the ten months of operations work as engineering experience.
- Presenting MG Mobile or Crew-MG as released, or Crew-MG security as finished or certified.
- Exposing real customer data, staff accounts, payment actions, or authenticated sessions.
- Scroll hijacking, a loading intro, continuous glitching, or motion that delays access to the work.
- Copying the branding, text, or claims of the reference sites.
- A page that is just rows of identical rounded cards.

## 3. Constraints

- **Stack (chosen):** Next.js (App Router) + TypeScript + Tailwind CSS + Motion (`motion` package), statically exported (`output: "export"`). Hosted on Vercel.
- **Accessibility:** WCAG 2.2 AA, with keyboard and touch equivalents for every hover interaction, and full support for `prefers-reduced-motion`.
- **Responsive:** phone (≥360px), tablet, and desktop. No horizontal overflow at 360, 375, 768, 1024, or 1440px.
- **Static export:** no middleware and no server, so locale routing uses `generateStaticParams`. `next/image` runs with `unoptimized`, using images pre-optimised at build time.

## 4. Approaches considered

| Approach | Trade-off | Decision |
|---|---|---|
| **Next.js static export** | Hassan's everyday stack, so he can maintain it and clients see him using the tools he sells. Ships somewhat more JavaScript than Astro. | **Chosen by the user** |
| Astro + React islands | Lightest pages and best first load, but a framework Hassan doesn't use, so harder for him to own. | Not chosen |
| Hand-built Vite site (no framework) | Smallest dependencies, but four languages, routing, and the viewer would be fragile to maintain. | Dropped |

## 5. Decisions already made with the user

- **Private MG tools** (Review, Calculator, Consultation, Crew-MG, MG Mobile) are shown as **coded interactive demos with synthetic sample data**, each clearly labelled "Illustrative demo · sample data". There are no screenshots of real records.
- **Live embeds:** only QR Studio (`queue-r-code.vercel.app`, verified live as "QR Studio Pro"). It loads only after a click ("Load live site"), with a captured screenshot as the poster and fallback.
  - Muscle Generator is **not embedded or linked live** in v1, because its live URL is unverified (builder's call).
- **Posters (builder's call):** captured once during the build with Playwright from the public site and committed as static, optimised images. If a site is down at capture time, use a designed fallback card (project name, pitch, external link), never a blank frame.
- **Contacts are verified by the user:**
  - WhatsApp +201023174210 is the primary call to action (`https://wa.me/201023174210`).
  - Email: hassanazb.56@gmail.com.
  - LinkedIn: https://www.linkedin.com/in/hassan-azb-b60587246/
  - GitHub: https://github.com/hassan-912
- **No contact form.**
- **Portrait:** a slot exists in the story section and shows a typographic monogram ("HA") until a photo is supplied.

## 6. Recon facts that shape the build

- **Public repos:** Review-Project, Visa-File-Strength-Calculator, consultatioin, Crew-MG, mawe-ed, and queue-r-code- are all public.
- **Consultation:** `consultatioin.vercel.app` is live (titled "MG Consultations") but sends `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so it **cannot be embedded**. Show the coded demo plus an external "Visit site" link.
- **Crew-MG:** `crew-mg.vercel.app` redirects to a login page. Do not link it as a demo; use the repo link only.
- **Muscle Generator:** the repo `grow-muscle` describes itself as "team work", and `muscle-gen-buildable` has a second contributor. Credit shared authorship (as with Voclio) and link the `grow-muscle` repo only.
- **Authorship:** GitHub shows Hassan as the only committer on Review-Project, Visa-File-Strength-Calculator, consultatioin, Crew-MG, mawe-ed, and queue-r-code-. The user confirmed solo authorship (§16a).
- **Older portfolio:** a Next.js portfolio repo (`hassan-912/portfolio`, last pushed July 2025) exists. **Builder's call:** greenfield project; the builder may look at the old repo for reusable pieces, but nothing in it must be preserved.

## 7. Information architecture

Routes: `/[locale]` with locales `en`, `de`, `fr`, and `ar`. `/` is a static page that sends visitors to their preferred language (from `navigator.language`, defaulting to `en`) and also shows plain links. Featured projects get case-study pages at `/[locale]/work/[slug]`.

Single-page section order:
1. **Header:** name wordmark, anchor navigation, language menu, and the "Let's talk" CTA. On phones, the menu opens in a sheet.
2. **Hero + introduction:** headline, intro paragraph, primary CTA (WhatsApp), and secondary CTA ("Explore my work", which jumps to the viewer).
3. **Featured work:** the project viewer with Review, Calculator, and Consultation, each linking to its case study.
4. **Interactive technology diagram**, one view per project.
5. **Services:** five client outcomes and a three-step way of working (understand the workflow → build → improve after delivery).
6. **Story:** curiosity → learning → MG Visa operations → pitching improvements in month seven → software engineer now → the "leave a place better" line.
7. **Further projects**, in mixed visual weight:
   - QR Studio and Mawid as medium entries; QR Studio gets a click-to-load live preview.
   - Voclio, Femine-EG, Treasure Hunt, and Muscle Generator as an expandable index list.
8. **Current development:** the MG Mobile cinematic reveal, then Crew-MG.
9. **Contact:** WhatsApp, email (mailto plus a copy button), LinkedIn, GitHub, and the location (New Cairo, Cairo, Egypt).
10. **Footer.**

Case-study pages: Review, Calculator, Consultation, and MG Mobile (four routes; Crew-MG has none). Each covers problem, contribution, approach, key features, stack with icons, status, demonstrable outcomes (qualitative only), the architecture diagram view, the demo, and links. The MG Mobile page keeps the "In development · not released" status prominent.

**Copy (builder's call):** Claude writes all English copy (case studies, story, services, UI) strictly from the facts in `docs/brief.md`, bounded by the anti-goals in §2, then translates it. Where the brief is silent, write less rather than invent. Every factual claim must trace to the brief, this doc, or a public repo.

## 8. Visual system

**Colour roles.** Pairings must be AA-checked; the builder verifies the exact values.

| Role | Value | Use |
|---|---|---|
| Ink | `#0E1A24` | Body and heading text |
| Ink-muted | `#4A6878` (darkened Frosted Aura slate) | Secondary text |
| Slate | `#5C7E8F` | Large text, icons, and lines only (below AA for small text on white) |
| Surface | `#FFFFFF` | Page background |
| Frost | `#F4F7F9` | Alternating sections |
| Mist | `#D4DDE2` | Borders and dividers |
| Grey | `#A2A2A2` | Hairlines only, never text |
| Indigo (Neptune) | `#525AFF` | Primary interactive accent, links, focus ring (about 4.9:1 on white) |
| Periwinkle | `#6D8BC0` | Secondary accent, diagram nodes |
| Teal | `#4AB5B5` | Decorative; use `#2C7F80` when it carries text |
| Sky | `#8FD9FB` | Glows, atmosphere |
| Pastels (lavender, peach, mint, derived) | — | Hero atmosphere and occasional section washes only |

**Typography** (self-hosted with `next/font`)
- Latin: Geist (display and UI), with large, tight-tracked display sizes.
- Labels, tags, counters, and the scramble effect: Geist Mono.
- Arabic: IBM Plex Sans Arabic, with line heights adjusted for Arabic. The builder may substitute faces of equal quality that cover Latin Extended and Arabic.

**Surfaces**
- Mostly flat white and frost, with fine hairlines.
- Frosted glass is limited to the sticky header, the viewer's control bar, and device frames.
- Depth comes from soft layered shadows, never heavy blur everywhere.

**Layout variety**
- Hero: asymmetric split.
- Viewer: a wide stage with a project rail.
- Diagram: full-bleed canvas.
- Services: numbered editorial list.
- Story: vertical timeline with a pull quote.
- Further projects: mixed sizes plus an index list.
- Contact: one large typographic block.

## 9. Motion

**Cinematic moment 1 — Hero**
- A slowly drifting pastel aurora (CSS or canvas gradients) that pauses off-screen.
- The headline reveals word by word, about 1s in total.
- "simpler" (or the localized equivalent fragment) text-scrambles once, in about 600ms.
- Two or three coded product screens settle into a layered composition as the visitor scrolls the first viewport.
- Content is readable immediately; there is no loader.

**Cinematic moment 2 — MG Mobile reveal**
- On desktop, a short sticky stage (about 150vh) carries a scroll-linked transition: a desktop browser frame showing the Consultation demo morphs into a phone frame showing MG Mobile screens (English and Arabic). The "In development · not released" status stays visible throughout.
- Phones and reduced motion get a static composed layout with no sticky stage.

**Small interactions**
- Hover illumination (a cursor-tracked soft glow) and small lifts on interactive items.
- Every hover effect has a matching focus-visible style and works by tap.
- Scramble is used only on small labels (section counters, status pills), on reveal, once.

**Reduced motion**
- No aurora drift, scramble, scroll-linked transforms, or staggered reveals; short opacity fades at most.

**Never**
- Smooth-scroll libraries, scroll locking, or looping glitch effects.

## 10. Project viewer

- **Project rail** (ARIA tablist): number, name, and status chip. It's horizontally scrollable on phones and mirrored in RTL.
- **Stage:** a framed preview with desktop, tablet, and phone controls (radio group).
  - Coded demos are React components that reflow by container width (container queries), so the device controls genuinely change the layout.
  - Live embeds only change the iframe width.
- **Beside or below the stage:** pitch, short description, stack labels with icons and readable names, status, links (repo, live site where allowed, case study), and the demo label.
- **Demos:** lazy-loaded (dynamic import) when the viewer nears the viewport. Each is a small, credible, interactive slice using synthetic data:
  - **Review:** a two-document field comparison with a discrepancy highlighted and the source evidence shown. The deterministic check and the "AI-assisted narrative check" are visually distinct, and there is a report preview.
  - **Calculator:** a short questionnaire leading to a "Preliminary MG assessment" with a funding check (sample rate) and the disclaimer "not an official eligibility decision".
  - **Consultation:** a booking flow (choose consultant → slot → payment step shown as a mock → QR ticket) and a staff schedule view.
  - **Crew-MG** (Current development section): a non-authenticated mock showing two moments, with an "In development" status. The builder makes no security claims beyond the brief's wording.
    - An admin generating a one-time referral link (shown as used/expired after one use).
    - A newcomer's view of a training/resource library with sample module titles.
  - **MG Mobile** (cinematic section and case study): there are no real screens to match, so invent plausible phone screens labelled illustrative:
    - Home with the next consultation.
    - Assessment progress.
    - QR ticket.
    - A staff view.
    - Each in English and Arabic (RTL).
    No app-store badges; no release language.

## 11. Interactive technology diagram

- An SVG node graph, with a tab per project: Review, Consultation, Calculator, Mobile. The pipelines are as given in the brief.
- Nodes are buttons; selecting one shows a concise explanation in a side panel (a bottom sheet on phones).
- Animated dashes run along the paths, with a persistent caption: "Illustrative animation — not live traffic."
- Flow runs left-to-right in LTR, right-to-left in Arabic, and stacks vertically on phones.
- Each project has its own layout; there is no shared "one architecture" implication.

## 12. Content and data model

```
src/content/
  site.ts          # name, title, location, site URL, contacts (whatsapp, email, linkedin, github), CV url (null)
  status.ts        # status keys → localized labels (released, live, in-development, not-released, graduation-project, maintained…)
  projects.ts      # per project: slug, tier (featured | further | in-development), repo, liveUrl, embeddable, demo component id,
                   # stack[] (tech ids), status key, authorship (solo | shared + note), localized text fields
  tech.ts          # tech id → readable name, icon, category (language | framework | database | integration)
  diagrams.ts      # per project: nodes, edges, localized node explanations
  i18n/en.ts de.ts fr.ts ar.ts   # UI strings; en.ts defines the type, others must satisfy it (compile-time completeness)
```

Localized project text lives as `Record<Locale, …>` inside `projects.ts`, or in per-locale files keyed by slug; the builder chooses. Missing translations must fail the build.

## 13. Internationalisation

- `<html lang dir>` is set per locale; Arabic uses `dir="rtl"`.
- Use CSS logical properties throughout (`ms-`/`me-`, `start`/`end`). Directional icons and animations mirror in RTL.
- The language menu keeps the current section anchor when switching.
- DE, FR, and AR copy is written by Claude in the brief's tone. It is flagged for native-speaker review before launch, not treated as final.
- Numbers, dates, and technology names stay in Latin script in every locale.

## 14. Metadata, SEO, performance

- Per-locale `<title>` and description, `hreflang` alternates, canonical URLs, `sitemap.xml`, `robots.txt`, and JSON-LD `Person`.
- Open Graph and Twitter images per locale, generated at build time.
- Site URL is configurable. Default: `https://azab.dev`, a placeholder until a domain is confirmed.
- Fonts are subset and self-hosted. Demos and iframes are lazy; images are pre-optimised (AVIF/WebP).
- Targets: Lighthouse performance ≥ 90 on mobile, accessibility 100.

## 15. Verification

- Playwright smoke tests across all four locales:
  - navigation anchors
  - language switching
  - `dir="rtl"` on Arabic
  - viewer project switching and device controls (keyboard included)
  - diagram node selection
  - contact link targets (`wa.me/201023174210`, `mailto:`, LinkedIn, GitHub)
  - no horizontal overflow at 360, 768, and 1440px
  - reduced-motion emulation removes the sticky stage and scramble
- axe accessibility checks on each locale.
- Manual review in the built-in browser at phone, tablet, and desktop sizes.

## 16. Placeholders and unverified items (must be surfaced in the UI or the README)

- **Domain:** not decided (`https://azab.dev` used as a placeholder).
- **Portrait:** none supplied; the monogram is used.
- **Femine-EG:** public link not verified, so there is no link until it is.
- **Voclio:** repository or live link and release status not verified. Show it as a "graduation project · team of eight" with no link.
- **Treasure Hunt:** no repo identified, so no link.
- **Muscle Generator:** live URL is unverified, so only the `grow-muscle` repo is linked.
- **Domain behaviour (builder's call):** while `site.url` is the placeholder, the build prints a clear warning, and the README lists it as a launch blocker.

## 16a. Answered by the user

- **Authorship:** Hassan built Review, Calculator, Consultation, MG Mobile, Crew-MG, Mawid, and QR Studio on his own. Contribution copy may say "I designed and built". Voclio and Muscle Generator remain shared.
- **Domain:** not decided yet. Keep `site.url` as the placeholder, with the build warning and README launch blocker described above.
- **Reference screenshots:** the palette, hover, scramble, and diagram screenshots were never received. The design follows the written brief instead.
- **Translations:** DE, FR, and AR need native-speaker review.
- **CV download:** none supplied, so the slot stays hidden.

## 17. Left to the builder

- The exact component structure and animation implementation (CSS vs. Motion per effect).
- Icon set: Simple Icons for technologies and Lucide for UI are suggested.
- Final type scale and spacing tokens, within the system above.
- The exact layout of each demo, within the scope in §10.
- How screenshots for the live-embed posters are captured.
