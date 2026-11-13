# Phase 2 — Real work, blog and admin: design

Date: 2026-11-13 · Status: draft for approval
Extends: `docs/superpowers/specs/2026-11-13-hassan-portfolio-design.md` (phase 1). Where this document differs, it wins.
Source request: the user's phase-2 brief (in conversation, 2026-11-13), summarised below.

## 1. Intent

Make the portfolio show Hassan's **real** work instead of demos. Turn the site into a server-backed Next.js app with a blog that Hassan writes himself through a protected admin area. Everything stays honest: no sample data, no fake posts, no invented URLs, and no infrastructure that isn't real.

## 2. Decisions from the user (2026-11-13)

- **Copy:** Hassan is the user and approves the copy Claude writes, within the anti-goals.
- **Old portfolio repo:** not reused.
- **Demo data:** none anywhere on the site. Remove the coded demos, the hero mock screens, and the Crew-MG and MG Mobile mocks.
- **Muscle Generator:** removed from the site entirely.
- **Screenshots:** both sources. Claude captures public pages; Hassan supplies private screens with no customer data.
- **MG Mobile:** gets a case-study page, so there are four case studies.
- **Domain:** none yet, and no Vercel deployment for now. The build warns about the placeholder domain.
- **Blog style reference:** https://www.seifashraf.tech/blog. (`safe.ashraf.tech` does not resolve.)
- **Storage:** a new, separate Supabase project named `personal`, for Postgres plus Storage. It is never mixed with MG company data.

## 3. Goals, non-goals, anti-goals

**Goals**
- Each featured project shows the real website where it can be embedded. Otherwise it shows an honest explanation, a real screenshot, and an "Open website" link.
- A real system-architecture diagram per project, describing only what is actually used (Task 7, in progress).
- A blog with a listing page, article pages, search, tag filter, table of contents, code highlighting and SEO. It starts with an honest empty state.
- `/admin`: login and logout, password change, and a Markdown editor with preview. Articles can be drafted, published, unpublished and deleted. Image upload goes to persistent storage, and localized versions are written by hand.
- Data survives restarts and redeploys.

**Non-goals**
- Comments, likes, view counts, newsletters, analytics.
- Automatic translation.
- Multi-user roles beyond a single admin.

**Anti-goals**
- Fabricated articles or metrics.
- Fake interactive demos.
- Bypassing other sites' security headers.
- Committing or logging the admin password.
- Drafts visible to the public.
- Diagram infrastructure (Redis, queues, workers, payments) that a project doesn't use.

## 4. Recon facts

| Project | Real URL | Embeddable now? | Why |
|---|---|---|---|
| Calculator | https://visa-file-strength-calculator.vercel.app (repo homepage) | No | CSP `frame-ancestors 'none'` |
| Consultation | https://consultatioin.vercel.app | No | `X-Frame-Options: DENY` + `frame-ancestors 'none'` |
| Review | none found | No | no public URL (Streamlit tool; its Supabase project is paused) |
| QR Studio | https://queue-r-code.vercel.app | Yes | no blocking headers |

- **Embedding later:** the fix for Calculator and Consultation is to add the portfolio's origin to `frame-ancestors` in each app's own repo and redeploy. That needs (a) a portfolio domain and (b) the user's approval for each repo change and deploy. Until then the viewer uses the honest fallback.
- **Login inside an embed:** even when embedding works, browsers often block sign-in inside a cross-site frame (third-party cookies). The "Open website" link is the reliable way to sign in.

## 5. Approach (builder's call where not stated)

- **Server app:** remove `output: "export"`. Next.js 16 runs on Node (`next start`). Public pages stay statically generated where possible; the blog and admin render dynamically. Tests run against `next start` instead of `out/`.
- **Database:** Supabase Postgres, accessed only from the server with the `postgres` driver and Drizzle ORM. Migrations are SQL files under `drizzle/`, applied by `npm run db:migrate`. The browser never talks to the database, and no Supabase keys go to the client.
- **Media:** a Supabase Storage bucket `blog-media` with public-read objects under random UUID names. Uploads go through an authenticated server route that uses the service-role key, which stays server-only. Allowed types: JPEG, PNG, WebP and AVIF, up to 5 MB, verified by content sniffing. The original filename is never used in the path.
- **Authentication:** custom, because the brief requires a username plus a server-side setup command. A Supabase Auth login would require an email address instead.
  - Tables:
    - `admin_users(id, username unique, password_hash, created_at, password_changed_at)`
    - `admin_sessions(id = sha256(token), user_id, expires_at, created_at, last_seen_at)`
    - `login_attempts(key, window_start, count)`
  - Passwords are hashed with argon2id (`@node-rs/argon2`).
  - The session cookie is `__Host-hp_session`: HttpOnly, Secure (except on localhost in development), SameSite=Strict, Path=/, a 7-day sliding window, and rotated on login.
  - Rate limit: 5 failed attempts per username+IP per 15 minutes, then a lockout until the window ends. The error message is generic.
  - CSRF protection: SameSite=Strict, plus Server Actions' built-in origin check, plus an explicit `Origin` check on the upload route handler.
  - Every admin page, action and route calls `requireAdmin()` on the server. `proxy.ts` only redirects visitors without a session cookie as a convenience; it is not the security boundary.
  - **Password change:** requires the current password, re-hashes, and invalidates every other session.
- **Admin setup command:** `npm run admin:setup`.
  - It reads `ADMIN_USERNAME` (default `Hassan`) and `ADMIN_INITIAL_PASSWORD` from the server environment, creates the user if it doesn't exist, and refuses to overwrite an existing one unless `--reset` is passed.
  - It never prints the password. `.env.example` holds placeholders only.
- **Blog data model:**
  - `articles(id, cover_image_url, cover_alt, tags text[], created_at, updated_at)`
  - `article_versions(article_id, locale, slug, title, excerpt, content_md, seo_title, seo_description, status draft|published, published_at, updated_at)`, with `unique(locale, slug)` and `unique(article_id, locale)`.
  - Each locale version is written and published separately, and a locale's blog lists only that locale's published versions. There is no automatic translation; the editor shows which locales are missing.
- **Rendering:**
  - Markdown goes through unified, remark-gfm and rehype-sanitize (a strict allow-list, with no raw HTML or scripts), then Shiki for code blocks.
  - Heading ids come from rehype-slug. A table of contents appears when an article has 3 or more h2/h3 headings.
  - Reading time is word count ÷ 200, rounded up.
- **Public blog:**
  - Pages: `/[locale]/blog` and `/[locale]/blog/[slug]`.
  - Search (title, excerpt and tags; server-side `ILIKE`) and tag filter through URL query params, so results are shareable.
  - Empty, no-results and error states, with `loading.tsx` skeletons.
  - Published changes call `revalidatePath`.
  - Per-article metadata, OG image (the cover if present, otherwise a generated card), and sitemap entries for published versions.
  - Visual direction follows the seifashraf.tech/blog reading layout (to be studied in the browser before design): a narrow reading column, generous line-height, a clear date/reading-time/tag line and quiet navigation, all in Hassan's own palette and type.
- **Admin UI:**
  - `/admin/login`, `/admin` (article list with status per locale), `/admin/articles/new`, `/admin/articles/[id]` (editor), `/admin/account` (password change).
  - The admin UI is English. Arabic content fields use `dir="auto"`. Every page is `noindex`.
  - **Editor:**
    - A Markdown textarea with a toolbar: headings, bold, italic, link, code, list, quote, image upload that inserts Markdown.
    - Live preview using the same renderer as the public site.
    - Fields: slug, with validation and auto-suggestion from the title.
    - Excerpt, tags, cover upload, and SEO fields.
    - Save draft, Publish, Unpublish, and Delete (with confirmation).
- **Validation:** zod schemas on every action input. Slugs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`; Arabic titles get a Latin slug that the author types.

## 6. Real work instead of demos

- **Delete:** `src/components/demos/`, the `demo-lab` route, and the `demos.*` dictionary keys. Remove the "Illustrative demo · sample data" wording everywhere.
- **Featured work viewer:** keeps the rail, the device controls and an **"Open website"** link. The stage per project:
  - **Embeddable** (none of the featured three today): the real site in the device frame, click-to-load, with a timeout fallback (as in Task 6).
  - **Blocked by its own headers** (Calculator, Consultation):
    - an honest panel: "This site's security settings don't allow it to be shown inside another page."
    - a real screenshot of its public entry page, captured by Playwright, with no login and no personal data
    - an "Open website" button
    - Device controls switch between desktop and mobile screenshots.
  - **No public URL** (Review):
    - "Internal tool — not publicly accessible", plus Hassan's real screenshots if he supplies them.
    - Without screenshots, a text-only presentation and the repo link.
- **Embeddability is data:** `projects.ts` gets `embed: "allowed" | "blocked-by-site" | "no-public-url"` and `screenshots: {desktop?, mobile?}`. Flipping one value turns on embedding once the domain and header changes exist.
- **Hero:** the mock composition is replaced by real screenshots of public pages (Calculator, Consultation, QR Studio), in the same layered, settling composition, labelled with each project's name rather than "illustrative".
- **MG Mobile reveal and Crew-MG:** use Hassan's real screenshots. Until they arrive, use a text-and-status presentation: no fake phone screens, and the desktop-to-phone transition only once there are real images.
- **Muscle Generator:** removed from content, tests and translations.

## 7. Diagram (Task 7, in progress)

Per project:
- Rounded cards with technology icons on a dotted grid, with labelled connections where the brief supports them.
- Selecting a node shows its role, its technology, and the nodes it connects to and from.
- A note says it is the project's actual architecture. The moving dashes are captioned "Illustrative animation — not live traffic".
- The user's "Users → Frontend → API → Database / Queue / External → Workers" reference is a visual inspiration only. A project gets a queue or workers only if it really has one; none of the documented projects do.

## 8. Constraints carried from phase 1

These still bind: the anti-goals, the four locales with Arabic RTL, accessibility (WCAG 2.2 AA), reduced motion, logical CSS, no overflow from 320px to 1440px, the colour roles and the fonts.

## 9. Verification

- **Unit tests (vitest):** auth (hash and verify, session rotation and expiry, rate limit), Markdown sanitisation (script, iframe and `javascript:` links stripped), slug validation, reading time, TOC.
- **E2E (Playwright, against `next start` with a test database):**
  - Viewer fallbacks and the "Open website" links.
  - Admin login, logout and wrong password; lockout after 5 attempts.
  - Unauthorised requests to every admin action and upload rejected (401/redirect).
  - Draft → edit → publish → visible publicly → unpublish → 404 publicly → delete.
  - Image upload persists across a server restart.
  - Drafts never appear in the listing, sitemap or search.
  - Blog keyboard access and RTL; no overflow.
- **Test database:** a separate Supabase branch or a local Postgres (Docker), chosen by the builder. Tests never run against production data.

## 10. Placeholders and blockers

- **Domain:** none, which blocks embedding Calculator and Consultation and sets the final canonical URLs.
- **Review tool URL:** none known.
- **Screenshots from Hassan:** Review, MG Mobile and Crew-MG.
- **Hosting for the Node server:** undecided. The README documents Vercel and a generic Node host, plus the required environment variables.
- **Supabase project `personal`:** approved by the user on 2026-11-13; created after a cost check.
