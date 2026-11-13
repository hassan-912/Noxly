# Hassan Azab portfolio

Next.js server app (en, de, fr, ar). Marketing routes are statically generated; the app runs with `next start`.

## Run
- `npm run dev` — dev server
- `npm run build` — checks `site.url`, writes the per-locale share images to `public/og/` (`scripts/og.tsx`, git-ignored), then `next build`
- `npm run start` — serves the production build (`next start`; add `-- -p 4173` to change the port)

## Test
- `npm test` — unit tests (vitest)
- `npm run test:e2e` — Playwright; builds and starts `next start` on :4173 itself, with env from the committed `.env.test` (test-only values, no secrets)

## Launch blockers
- Real domain (`site.url` is the placeholder `https://azab.dev`)
- Native-speaker translation review (de, fr, ar)
- Portrait photo
- Femine-EG, Voclio and Treasure Hunt links
