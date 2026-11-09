# personal-site — health check

Date of this check: 2026-11-08 (task #71). Branch: `ops/71-personal-site-health-check-and-fix-run-t`.

Everything below was produced by running the project's own commands in the repository.
No test was weakened, skipped or deleted.

## 1. What works

All four commands in the project pass, together:

```
$ npm run verify        # lint && test && build && check:build
> eslint .
> vitest run
 Test Files  9 passed (9)
      Tests  83 passed (83)
> vite build && node scripts/build-og.js && node scripts/build-feeds.js && node scripts/prerender.js
vite v8.3.6 building client environment for production...
✓ 1748 modules transformed.
✓ built in 1.60s
og: wrote 12 images to dist/og/
feeds: wrote feed.xml, sitemap.xml and robots.txt to dist/
prerender: wrote 13 routes to dist/
> node scripts/check-build.js
Build is complete: 13 routes, 12 Open Graph cards, feed, sitemap and robots.txt.
```

Concretely, the following are healthy:

- **Lint** — ESLint 10.14.0 over the whole tree, including the `jsx-a11y` recommended
  rules, reports zero problems.
- **Tests** — 83 tests in 9 files, all passing. They cover the twelve month
  conversions, newest-first article ordering, required article fields and unique
  slugs, the Prose parser and renderer, server-rendered route content and
  per-page metadata for every essay, home, about and the 404 fallback, the
  Open Graph cards, the CSP and font preloads, and (new in this check) the
  feed/sitemap/robots generator.
- **Build** — produces every artifact the site references: 13 prerendered routes
  (`/`, `/about` and one per essay), 12 Open Graph cards at 1200×630 PNG, plus
  `feed.xml`, `sitemap.xml`, `robots.txt` and the fingerprinted assets. The
  client bundle is 273 kB (91 kB gzipped).
- **Build completeness** — `scripts/check-build.js` (new) asserts that every
  route, every card and every feed file actually landed in `dist/`, and that
  each prerendered page carries a `<title>` and a canonical link.
- **Content model** — 11 essays, unique slugs, every article has a title,
  topic, date, read time, summary, excerpt and at least one section.
- **Prose parser** — checked against the real bodies of all 11 essays (every
  paragraph, list and code block), not only against unit fixtures. It produces
  the expected blocks everywhere; no list is mis-grouped and no paragraph is
  swallowed into a list.
- **Open Graph cards** — the palette in `scripts/og-image.js` is asserted to
  still match `src/index.css`, so the cards cannot drift from the site colours.
- **Security headers** — the CSP hash in `vercel.json` is asserted to match the
  exact inline theme script in `index.html`; `script-src` allows only `'self'`
  and that one hash, never `'unsafe-inline'` or `'unsafe-eval'`.
- **Fonts** — Fraunces ships as committed local WOFF2 subsets; the test asserts
  there is no request to `fonts.googleapis.com` or `fonts.gstatic.com`.
- **Accessibility** — the contrast test confirms the faint 11–12px metadata
  meets WCAG AA 4.5:1 in both the light and the dark theme.

## 2. What is broken

### Fixed in this branch

1. **Three high-severity dependency advisories (fixed).**
   `npm audit` reported 11 vulnerabilities (3 high, 8 moderate) on the original
   `package-lock.json`. The three high ones are now patched:

   | Package | Before | After | Advisory |
   | --- | --- | --- | --- |
   | `vite` | 8.3.1 | 8.3.6 | GHSA-9jrq-w75r-8gcw, GHSA-rq7h-c2jc-7f22, GHSA-vfpm-58rq-9qcg |
   | `zod` | 4.3.6 | 4.6.7 | GHSA-mrhx-c7xc-m3w5 (memory exhaustion) |
   | `source-map-js` | 1.2.1 | 1.2.2 | GHSA-68fv-2mgg-jv7q (event-loop DoS) |
   | `postcss-selector-parser` | 6.1.4 | 6.1.6 | GHSA-rj75-hqrm-r3gf (CPU exhaustion) |

   `npm audit` now reports **7 moderate, 0 high**. All four updates are
   semver-compatible patches; `npm ci`, `npm run lint`, `npm test` and
   `npm run build` were all re-run afterwards and pass.

2. **Nothing ran the tests (fixed).**
   The repository had exactly one workflow, `.github/workflows/secret-scan.yml`.
   Nothing ran `npm test`, `npm run lint` or `npm run build` on any push, so a
   broken build could only ever be discovered by hand. A new
   `.github/workflows/ci.yml` runs lint, test, build and the build-completeness
   check on every push and pull request, and a second job fails the pipeline on
   a high-severity dependency advisory. Both actions are pinned to a commit SHA
   and the workflow uses `permissions: contents: read`, matching the existing
   secret-scan workflow.

3. **A mistyped article date silently corrupted the site (fixed).**
   `isoMonth()` returned `2025-00` for a month name it did not recognise (for
   example `"Sept 2025"`). That value then sorted the essay to the **top** of
   the home page and published `<pubDate>Invalid Date</pubDate>` to the RSS
   feed — with no error anywhere. `isoMonth()` now throws a message naming the
   offending date, and the failure surfaces at build time instead of in
   production.

4. **The feed, sitemap and robots generator had no tests at all (fixed).**
   `scripts/build-feeds.js` was at 0% coverage while producing three files the
   public depends on, including the XML escaping. It is now split into
   `feedXml()`, `sitemapXml()`, `robotsTxt()` and a `buildFeeds()` writer that
   returns what it wrote, and it has 8 new tests covering escaping, item
   ordering, publication dates, the channel header, sitemap coverage, robots.txt
   and the files actually landing on disk. The generated bytes were diffed
   against the pre-refactor output and are **identical**.

5. **The build output was never checked for completeness (fixed).**
   `scripts/check-build.js` now asserts that every route, every Open Graph card
   and every feed file exists, and that each prerendered page carries a title
   and a canonical link. It was verified to fail correctly when a card and a
   route are removed.

6. **The build was silent about two of its four stages (fixed).**
   `build-feeds.js` and `prerender.js` printed nothing on success. They now log
   what they wrote, so a partial build is visible in the log.

### Still open — not fixed here, and why

7. **The canonical origin is hardcoded to a placeholder domain (open, needs an
   owner decision).**
   `src/content/site.js` sets `url: "https://personal-site-six-lovat-75.vercel.app"`.
   That single value is the source of **every** canonical URL, `og:url`, sitemap
   `<loc>`, RSS `<link>` and `<guid>` on the site. If the real public domain is
   different, the whole site points search engines at the wrong origin. The
   README already flags this as a manual step ("Update that URL when changing
   the public domain"), so it is a known gap rather than a regression. It needs
   the true production domain, which cannot be determined from the repository.

8. **Unknown routes answer with HTTP 200 (open, cannot be verified offline).**
   `vercel.json` rewrites `/(.*)` to `/index.html` so the client-side 404 route
   can render. The consequence is a soft 404: an unknown URL is served with the
   home page's prerendered HTML and a 200 status, not a 404. That trade-off is
   deliberate (the README documents it), but it is worth confirming against the
   live site, and changing it needs a deployment to verify.

9. **Seven moderate dependency advisories remain (open, blocked on upstream).**
   `minimatch` via ESLint 10 and `fflate` via `satori` 0.63. The published
   fixes are breaking downgrades — `eslint@9.39.5` and `satori@0.32.0` — that
   would undo deliberate choices in this repository (the ESLint 10 setup
   documented in the README, and the satori version that renders the Open Graph
   cards). `npm audit fix --force` was therefore **not** run. Both are
   build-time-only and not reachable from a deployed page.

## 3. Missing tests

Measured with `npx vitest run --coverage` (v8 provider). The current split is
**57.4% statements, 64.6% branches, 70.1% functions, 58.9% lines**.

| File | Coverage | What is untested |
| --- | --- | --- |
| `scripts/prerender.js` | **0%** | The script that writes all 13 prerendered HTML files. Nothing asserts the files exist, that the head/body split was correct on disk, or that the built HTML matches what `entry-server.render()` returns. |
| `scripts/check-build.js` | **0%** | The new build-completeness checker. It is exercised by CI only, not by the unit suite. |
| `scripts/subset-fonts.js` | **0%** | The offline font subsetter. Regenerating `fonts/*.woff2` cannot be verified in CI today. |
| `src/main.jsx` | **0%** | The hydration entry point — the `root.hasChildNodes()` branch that chooses `hydrateRoot` over `createRoot`. A wrong choice here causes a hydration mismatch on every page. |
| `src/components/Layout.jsx` | **21%** | The fragment-link effect (lines 12–19): `decodeURIComponent` of the hash, `getElementById` lookup and `scrollIntoView`. |
| `src/components/Header.jsx` | **44%** | The theme cycle: `localStorage` writes, the blocked-storage fallback, and the `matchMedia` change listener lifecycle. |
| `src/pages/Essay.jsx` | **40%** | The reading-progress effect (lines 19–32) and the share handler (lines 44–53), including the clipboard fallback when `navigator.share` is absent. |
| `src/pages/Home.jsx` | **77%** | The topic filter's filtered branch (line 38). Only the unfiltered render is asserted. |

The root cause of most of that is structural, not an oversight in any one file:
**the project has no browser test environment at all.** The README states
"Tests run in Node without jsdom", so every interactive behaviour — the theme
toggle, the fragment scrolling, the reading-progress bar, the topic filter and
the share button — is exercised only by server rendering. Server rendering
proves the markup; it does not prove the behaviour.

Other gaps worth naming:

- **No test asserts the built `dist/` in the unit suite.** This check added
  `scripts/check-build.js` to close it in CI, but `npm test` still does not
  look at `dist/`.
- **No cross-artifact consistency test.** Nothing guarantees that a slug
  appearing in `writing.js` has both a prerendered page and an Open Graph card,
  or that the sitemap and the feed list the same set of routes. `check-build.js`
  does this at build time; a unit-level version would catch it earlier.
- **No test for the sitemap's `<lastmod>`, or for the feed's `atom:link`.**
  The feed's self link and channel metadata are asserted, but the sitemap has
  no `<lastmod>` at all.

## 4. Top 3 next improvements

### 1. Add a browser-like test environment and cover the client-side behaviour — **4–6 hours**

Add `jsdom` (or `happy-dom`) as a Vitest environment and write tests for the
five untested interactive behaviours: the theme cycle and its storage
fallbacks, the fragment-link scroll in `Layout`, the reading-progress
calculation and DOM writes in `Essay`, the share handler's clipboard fallback,
and the topic filter's filtered render in `Home`. This is the single largest
risk area in the repository — the client is where every remaining bug would
live, and it currently has no automated check at all. It should raise
`src/components` and `src/pages` from their current 21–77% into the 90s and
give `src/main.jsx` a real hydration test.

### 2. Move the canonical origin out of source into the build configuration — **1–2 hours**

Replace the hardcoded `site.url` with an environment variable
(`SITE_URL`), default it to the current value for local builds, and make the
build **fail** when it is unset in a production build. Every canonical URL,
`og:url`, sitemap entry and RSS guid is derived from it, so one misconfigured
value currently misdirects the whole site. This also removes the README's
manual "update this URL when changing the public domain" step and the class of
bug where a stale value ships unnoticed.

### 3. Close the remaining dependency advisories and keep them closed — **2–3 hours**

Two moderate advisories are still open: `minimatch` via ESLint 10 and `fflate`
via `satori` 0.63, both of which need a breaking downgrade to fix. Rather than
downgrading ESLint away from the documented ESLint 10 setup, plan a move to
the current ESLint major once `eslint-plugin-jsx-a11y` declares support for it,
and evaluate replacing `satori` with a maintained Open Graph renderer so the
`fflate` advisory disappears without downgrading. The `npm audit --audit-level=high`
job added in this branch stops the *high*-severity class from regressing in the
meantime; widening it to `--audit-level=moderate` should follow once the
remaining two are cleared.

### Also worth doing, smaller

- Return a real **404 status** for unknown routes (with a `404.html`) instead
  of the current soft 404 — **2–3 hours plus a deploy to verify**.
- Add **`<lastmod>`** to the sitemap entries and keep them in step with the
  article dates — **30 minutes**.
- Move the **prose and layout behaviours** that are currently only asserted
  through server-rendered strings into unit-testable helpers, the way
  `src/lib/essay.js` already does for heading slugs and reading progress —
  **2 hours**.
