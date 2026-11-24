# Graph Report - Azab.dev  (2026-11-14)

## Corpus Check
- 122 files · ~63,024 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .ttf 1, .ico 1)

## Summary
- 619 nodes · 1592 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94b52da1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Hero and Motion
- Build Scripts and Icons
- App Config and Blog Route
- package.json
- Pages and Case Studies
- Diagram Canvas Layout
- Header and Language Menu
- Contact Form and Notes
- TypeScript Config
- Portfolio Brief and Projects
- Diagram E2E Tests
- Phase 2 Blog and Admin Plan
- Phase 1 Build Plan
- Featured Projects and Diagram
- Consultation Desktop Screen
- Design Specs and Decisions
- CRS Calculator Mobile
- Consultation Mobile Screen
- Agent Rules and Run Scripts
- CRS Calculator Desktop
- Job Seeker Calculator Desktop
- Femine EG Desktop
- Femine EG Mobile
- Arabic OG Image
- Tourism Calculator Desktop
- Job Seeker Calculator Mobile
- Graphify Agent Rules
- Tourism Calculator Mobile
- File Icon
- Next.js Logo
- vitest
- dependencies
- scripts
- eslint.config.mjs
- dotenv

## God Nodes (most connected - your core abstractions)
1. `getDictionary()` - 37 edges
2. `Locale` - 36 edges
3. `cn()` - 35 edges
4. `react` - 25 edges
5. `lucide-react` - 24 edges
6. `isLocale()` - 23 edges
7. `Original portfolio brief (verbatim)` - 23 edges
8. `next` - 21 edges
9. `site` - 19 edges
10. `locales` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Launch blockers list` --semantically_similar_to--> `Placeholders and unverified items`  [INFERRED] [semantically similar]
  README.md → docs/superpowers/specs/2026-11-13-hassan-portfolio-design.md
- `Launch blockers list` --references--> `Embed status per project (allowed, blocked-by-site, no-public-url)`  [INFERRED]
  README.md → docs/superpowers/specs/2026-11-13-phase2-real-work-blog-admin-design.md
- `OFL.txt (SIL Open Font License 1.1, Noto Arabic)` --references--> `Visual system (colour roles, typography, surfaces)`  [AMBIGUOUS]
  assets/fonts/OFL.txt → docs/superpowers/specs/2026-11-13-hassan-portfolio-design.md
- `positions()` --calls--> `layoutDiagram()`  [EXTRACTED]
  tests/unit/diagram-layout.test.ts → src/components/diagram/layout.ts
- `Next.js breaking-changes agent rules` --conceptually_related_to--> `Server mode (next start, drop static export)`  [INFERRED]
  AGENTS.md → docs/superpowers/plans/2026-11-13-phase2.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Consultation branch selection cards** — public_screens_consultation_desktop_uae_dubai_branch, public_screens_consultation_desktop_nasr_city_branch, public_screens_consultation_desktop_zayed_branch, public_screens_consultation_desktop_qena_branch [EXTRACTED 1.00]
- **Consultation branch choices** — public_screens_consultation_mobile_uae_dubai_branch, public_screens_consultation_mobile_nasr_city_branch, public_screens_consultation_mobile_zayed_branch, public_screens_consultation_mobile_qena_branch [EXTRACTED 1.00]
- **Canada CRS Calculator Components** — public_screens_calculator_immigration_mobile_crs_calculator, public_screens_calculator_immigration_mobile_live_crs_score, public_screens_calculator_immigration_mobile_country_toggle, public_screens_calculator_immigration_mobile_occupation_check [EXTRACTED 1.00]
- **MG tool family (Review, Calculator, Consultation, Mobile, Crew-MG)** — docs_brief_mg_visa_document_review, docs_brief_mg_visa_calculator, docs_brief_mg_consultation, docs_brief_mg_mobile, docs_brief_crew_mg [EXTRACTED 1.00]
- **Phase 2 blog and admin system components** — docs_superpowers_plans_2026_11_13_phase2_database_layer, docs_superpowers_plans_2026_11_13_phase2_admin_auth, docs_superpowers_plans_2026_11_13_phase2_markdown_pipeline, docs_superpowers_plans_2026_11_13_phase2_upload_route, docs_superpowers_plans_2026_11_13_phase2_admin_editor, docs_superpowers_plans_2026_11_13_phase2_public_blog [EXTRACTED 1.00]
- **Portfolio brief, specs and plans chain** — docs_brief, docs_superpowers_specs_2026_11_13_hassan_portfolio_design, docs_superpowers_plans_2026_11_13_hassan_portfolio, docs_superpowers_specs_2026_11_13_phase2_real_work_blog_admin_design, docs_superpowers_plans_2026_11_13_phase2, docs_superpowers_plans_2026_11_13_portfolio_completion [EXTRACTED 1.00]
- **Clog promotions** — public_screens_femine_eg_mobile_top_promo_bar, public_screens_femine_eg_mobile_winter_essentials_banner, public_screens_femine_eg_mobile_get_5_percent_off_tab [INFERRED 0.75]

## Communities (38 total, 8 thin omitted)

### Community 0 - "Hero and Motion"
Cohesion: 0.07
Nodes (54): react, HeadlinePart, splitHeadline(), HeroComposition(), HeroScreen, layout, Screen(), StaggerHeadline() (+46 more)

### Community 1 - "Build Scripts and Icons"
Cohesion: 0.07
Nodes (36): simple-icons@^16.37.0, simple-icons, dots, simpleBySlug, SimpleIcon, DiagramEdge, DiagramNode, node() (+28 more)

### Community 2 - "App Config and Blog Route"
Cohesion: 0.05
Nodes (51): nextConfig, next, main(), dynamicParams, generateMetadata(), LocaleLayout(), personJsonLd(), resolveLocale() (+43 more)

### Community 3 - "package.json"
Cohesion: 0.13
Nodes (20): devDependencies, @axe-core/playwright@^4.14.0, tailwindcss@4.3.3, @tailwindcss/turbopack@4.3.3, tsx@^4.23.15, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19 (+12 more)

### Community 4 - "Pages and Case Studies"
Cohesion: 0.10
Nodes (42): lucide-react, BlogRedirect(), FixturesPage(), metadata, generateMetadata(), Home(), generateMetadata(), Props (+34 more)

### Community 5 - "Diagram Canvas Layout"
Cohesion: 0.12
Nodes (23): CanvasLabels, DiagramCanvas(), DiagramView, Project, Shape, ViewNode, CELL, DiagramLayout (+15 more)

### Community 6 - "Header and Language Menu"
Cohesion: 0.50
Nodes (5): ChoiceGroup(), ContactForm(), ContactFormCopy, contactFormCopy, composeContactMessage()

### Community 7 - "Contact Form and Notes"
Cohesion: 0.11
Nodes (36): Featured(), Notes(), postHref(), PostRow(), articleJsonLd(), dynamicParams, generateMetadata(), generateStaticParams() (+28 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Portfolio Brief and Projects"
Cohesion: 0.15
Nodes (15): OFL.txt (SIL Open Font License 1.1, Noto Arabic), Original portfolio brief (verbatim), Contact channels (WhatsApp, email, LinkedIn, GitHub), Crew-MG, Femine-EG, Mawid Reminders, Four languages with Arabic RTL, Services offered (+7 more)

### Community 10 - "Diagram E2E Tests"
Cohesion: 0.20
Nodes (13): arTabLabels, centre(), flows(), live(), node(), nodes(), openDiagram(), panel() (+5 more)

### Community 11 - "Phase 2 Blog and Admin Plan"
Cohesion: 0.20
Nodes (13): Admin authentication (argon2id, sessions, lockout), Admin article editor and server actions, Drizzle schema and PGlite test database, Sanitized Markdown rendering pipeline, Public blog (listing, search, tags, TOC, SEO), Authenticated image upload route and storage drivers, Admin UI and Markdown editor, Blog data model (articles, article_versions per locale) (+5 more)

### Community 12 - "Phase 1 Build Plan"
Cohesion: 0.19
Nodes (13): Restrained motion with two cinematic moments, Project viewer with device controls and embeds, Phase 1 implementation plan (12 tasks), Case-study pages (4 projects x 4 locales), Coded demos with sample data, Typed content layer (src/content), Hero with aurora, stagger and scramble, MG Mobile scroll-linked reveal (+5 more)

### Community 13 - "Featured Projects and Diagram"
Cohesion: 0.24
Nodes (12): Interactive technology diagram (per-project architecture), MG Consultation, MG Mobile (in development, not released), MG Visa Calculator, MG Visa Document Review, QR Studio / Dynamic Bio, TechDiagram component (layoutDiagram, NodePanel), Portfolio completion checklist (+4 more)

### Community 14 - "Consultation Desktop Screen"
Cohesion: 0.20
Nodes (8): Consultation Desktop Screen, Hotline Footer (17621), English Language Toggle, MG International Visa Consultancy Logo, Nasr City Branch Card, Qena Branch Card, UAE Dubai Branch Card (highlighted), Zayed Branch Card

### Community 15 - "Design Specs and Decisions"
Cohesion: 0.27
Nodes (9): Muscle Generator, Phase 2 implementation plan (tasks 13-25), Phase 1 portfolio design spec, Information architecture and section order, Placeholders and unverified items, Phase 2 design: real work, blog and admin, Phase 2 placeholders and blockers, Real work instead of demos (+1 more)

### Community 16 - "CRS Calculator Mobile"
Cohesion: 0.25
Nodes (9): Canada CRS Calculator Mobile Screenshot, Canada / Australia Country Toggle, Canada CRS Calculator, Express Entry CRS Score, Live CRS Score Badge (0 / 1,200), Canada Occupation Check Card, Profession / Field Selector, Regulated Occupation Eligibility (+1 more)

### Community 17 - "Consultation Mobile Screen"
Cohesion: 0.36
Nodes (8): Consultation mobile screen, Arabic-first bilingual layout with map backdrop, Branch picker card list, English language toggle, Egypt Nasr City branch, Egypt Qena branch, UAE Dubai branch (selected), Egypt Zayed branch

### Community 18 - "Agent Rules and Run Scripts"
Cohesion: 0.29
Nodes (3): Static export architecture (output export, locale segment), Server mode (next start, drop static export), Run, build and test scripts (next start, vitest, Playwright)

### Community 19 - "CRS Calculator Desktop"
Cohesion: 0.29
Nodes (6): Canada CRS Calculator, Canada and Australia country switch, Canada Express Entry, Live CRS score widget, MG-visa Score, Immigration calculator desktop screenshot

### Community 20 - "Job Seeker Calculator Desktop"
Cohesion: 0.38
Nodes (7): Destination Selector (Germany, Austria, Sweden), EUR to EGP Exchange Rate, Job Seeker Portal, MG-visa Score, Opportunity Card Form, Proof of Funds Panel, University and Degree Recognition Fields

### Community 22 - "Femine EG Mobile"
Cohesion: 0.47
Nodes (6): Femine EG mobile storefront screenshot, Can I help? chat widget, Get 5% off side tab, Shop by Category grid (Sneakers, Clogs, and more), Top promo bar: Buy 2 Get 1 Free on Clogs, Winter Essentials hero banner (Buy 2 clogs for 1099 EGP)

### Community 23 - "Arabic OG Image"
Cohesion: 0.50
Nodes (4): Arabic OG image for azab.dev, azab.dev, Hassan Azab, Software engineer at MG Visa, problem solver (Arabic tagline)

### Community 24 - "Tourism Calculator Desktop"
Cohesion: 0.40
Nodes (5): Calculator Desktop Screenshot, Eight-Section Assessment, MG AI Scoring Engine, Tourism Visa Profile, Visa File Strength Calculator

### Community 25 - "Job Seeker Calculator Mobile"
Cohesion: 0.60
Nodes (5): Job Seeker Portal mobile screenshot, Destination selector (Germany, Austria, Sweden), Opportunity Card program, University and degree recognition form section, Vocational Training Search program

### Community 27 - "Tourism Calculator Mobile"
Cohesion: 0.67
Nodes (4): Calculator Mobile Screenshot, MG AI Scoring Engine, Tourism Visa Profile, Visa File Strength Calculator

### Community 33 - "vitest"
Cohesion: 0.15
Nodes (8): @playwright/test@^1.65.0, vitest@^5.1.0, @playwright/test, vitest, OUT_DIR, selected, sizes, targets

### Community 34 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, clsx@^2.1.1, lucide-react@^1.72.0, motion@^14.13.0, next@16.4.6, react@19.3.0, react-dom@19.3.0, clsx (+2 more)

### Community 35 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, screens, start, test, test:e2e

### Community 36 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

## Ambiguous Edges - Review These
- `Visual system (colour roles, typography, surfaces)` → `OFL.txt (SIL Open Font License 1.1, Noto Arabic)`  [AMBIGUOUS]
  assets/fonts/OFL.txt · relation: references

## Knowledge Gaps
- **40 isolated node(s):** `Case-study pages (4 projects x 4 locales)`, `Whole-site verification (overflow, axe, links)`, `Hotline Footer (17621)`, `English Language Toggle`, `MG International Visa Consultancy Logo` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 160 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `Pages and Case Studies` to `Hero and Motion`, `Build Scripts and Icons`, `App Config and Blog Route`, `dependencies`, `package.json`, `Diagram Canvas Layout`, `Header and Language Menu`, `Contact Form and Notes`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `Case-study pages (4 projects x 4 locales)`, `Whole-site verification (overflow, axe, links)`, `Hotline Footer (17621)` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Hero and Motion` be split into smaller, more focused modules?**
  _Cohesion score 0.0715372907153729 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Hero and Motion` to `Build Scripts and Icons`, `App Config and Blog Route`, `dependencies`, `package.json`, `Pages and Case Studies`, `Diagram Canvas Layout`, `Header and Language Menu`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Build Scripts and Icons` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._
- **Why does `next` connect `App Config and Blog Route` to `dependencies`, `package.json`, `Pages and Case Studies`, `Contact Form and Notes`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Visual system (colour roles, typography, surfaces)` and `OFL.txt (SIL Open Font License 1.1, Noto Arabic)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._