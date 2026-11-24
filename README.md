# Hassan Azab portfolio

Next.js server app (en, de, fr, ar). Marketing routes are statically generated; the app runs with `next start`.

## Run
- `npm run dev` — dev server
- `npm run build` — checks `site.url`, generates the English, German and French share images, then runs `next build`. The Arabic share image is checked in; regenerate it locally with `npx tsx scripts/capture-ar-og.ts` after changing its copy.
- `npm run start` — serves the production build (`next start`; add `-- -p 4173` to change the port)

## Test
- `npm test` — unit tests (vitest)
- `npm run test:e2e` — Playwright; builds and starts `next start` on :4183 itself, with env from the committed `.env.test` (test-only values, no secrets)

## Launch blockers
- Real domain (`site.url` is the placeholder `https://azab.dev`)
- Native-speaker translation review (de, fr, ar)
- Portrait photo
- Calculator, Consultation and Femine-EG currently deny framing; their own security headers must allow the final portfolio origin before they can be interactive inside the viewer.
- The Review URL is public, but its current service page reports that service status is unavailable. Check the app before launch.
- Voclio and Treasure Hunt links
