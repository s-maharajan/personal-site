# personal-site

A blog: a list of essays, newest first, and a short about page. Built with React 19, Vite, Tailwind CSS, and React Router 7, deployed on Vercel.

## Run it locally

```sh
npm ci
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests (Node; no browser required)
npm run lint
npm run build    # outputs to dist/
npm run og       # re-render the Open Graph cards into dist/og/
```

Requires Node 22.12 or newer within Node 22.

`npm test` covers all twelve month conversions, newest-first article ordering,
required article fields and unique slugs, and Prose parsing and static rendering
(paragraphs, lists, fenced code, bold, and inline code), plus server-rendered route
content and per-page metadata for every essay, home, about, and the 404 fallback. Tests run in Node without
jsdom. The Open Graph cards are covered too: the suite renders them, checks every
file is a 1200x630 PNG, checks the cards carry the title, topic and author, and
checks the card palette still matches `src/index.css`.

## Editing content

Content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.js` | Name, role, tagline, location, email, and social links. |
| `writing.js` | Published essays, listed at `/writing` and shown at `/writing/<slug>`. |
| `learning.js` | The learning log: curated notes grouped into sections, shown at `/learning` and `/learning/<section>`. |
| `nav.js` | Header and footer navigation. |

`learning.js` was curated from the private `daily-learning` notes: only items rated
worth keeping, de-duplicated, grouped into sections, each with a one-line takeaway, a
summary, how it works, a way to try it, caveats and the public source link. Edit it by
hand; each entry needs a unique `slug` within its section.

## Structure

```
src/
  content/     site, writing, learning, nav
  components/  Layout, Header, Footer, Icons
  lib/         og (Open Graph paths and sizes), learning (dates, sorting), essay
  pages/       Home, Writing, Essay, Learning, LearningSection, About, NotFound
scripts/       build-feeds, build-og, prerender
fonts/         Fraunces TTF sources and licence (cards and web subsets)
```

## Deploying

`npm run build` runs Vite, generates the feeds, sitemap and robots.txt, then
server-renders `/`, `/writing`, `/learning`, `/about`, every `/learning/<section>` and
every `/writing/<slug>` into `dist/<route>/index.html` (the list is `routes` in
`src/entry-server.jsx`), plus `dist/404.html`.
Each page includes its content, title, description, Open Graph tags and canonical URL.
Essay descriptions use `summary`; canonical and Open Graph URLs use `site.url` in
`src/content/site.js`. Update that URL when changing the public domain.

The build also renders the Open Graph cards: `dist/og/site.png` for the site and
`dist/og/<slug>.png` for every essay, `dist/og/learning-<section>.png` for every learning section, all 1200x630 PNGs. `scripts/build-og.js`
draws them with satori and rasterises them with resvg, using the palette from
`src/index.css` and the Fraunces files in `fonts/`. Nothing is fetched at build
time, so the build works offline. Every page points at its card with
`og:image`, `og:image:width`, `og:image:height` and `twitter:card=summary_large_image`;
essays use their own card, the home and about pages share the site card. Run
`npm run og` on its own to re-render the cards.

The browser hydrates the rendered content and continues to navigate client-side,
updating page metadata. There are two themes, light and dark. The inline theme script
applies the saved theme, or the system preference, before paint; the header button
toggles between them and saves the choice. `vercel.json` uses `cleanUrls`, so `/about`
serves `about/index.html`, and unknown paths get `404.html` with a real 404 status.

The site is the Vercel project `s-maharajan`, served at https://s-maharajan.vercel.app.

## Performance and response headers

Fraunces is served locally as committed Latin WOFF2 subsets, with no Google Fonts
stylesheet or third-party font requests. The regular face is preloaded; italic
loads when used. Vite fingerprints both files under `/assets/`. See
[fonts/README.md](fonts/README.md) for coverage and offline regeneration.
Home and the small 404 page load eagerly; Essay and About use `React.lazy` with a
loading status. The prerenderer supplies eager versions of those pages so the
initial HTML still contains full content and metadata on every published route.

Vercel sends `Cache-Control: public, max-age=31536000, immutable` for fingerprinted
`/assets/*` files only. HTML keeps the platform's normal revalidation behaviour.
All routes receive a CSP restricting resource loads to the same origin, blocking
embedding with `frame-ancestors 'none'`, and disabling plugins, base URL overrides
and form submissions. The policy permits the exact inline theme script by SHA-256
hash; it does not permit arbitrary inline scripts or eval. When editing that
script in `index.html`, update its hash in `vercel.json` (the security test detects
a mismatch). The reading-progress bar updates through CSSOM, which the policy
allows. External social and email links remain normal navigation links.

Responses also set `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin` and a Permissions Policy
disabling camera, microphone, geolocation and payment access. These headers are
applied by Vercel; the Vite development and preview servers do not apply them.

## Secret scanning

[Gitleaks](.github/workflows/secret-scan.yml) scans the full Git history on pushes, pull requests,
manual runs and a weekly schedule. CI uses a pinned, checksum-verified Gitleaks 8.30.1
binary with read-only repository permissions; no license key is required.

To check locally with Gitleaks 8.30.1 installed:

```sh
gitleaks git . --log-opts="--all" --config .gitleaks.toml --redact --no-banner
```

Keep credentials and local environment files out of Git. `.env.example` may contain
placeholders only. If a real secret is detected, remove it and rotate it; do not
add a blanket scanner exclusion to make the check pass.

## Reading essays

Essays with three or more sections include a compact Contents list. Section
headings have shareable `#heading-slug` links, revealed on hover or keyboard focus
(and always visible on touch devices). Slugs follow heading text, with numeric
suffixes for duplicates; changing a heading changes its link. Fragment links work
on initial load and client navigation, with space above the target heading.
A thin accent bar at the top tracks progress through the essay body, reaching
100% when its end enters the viewport. It updates without animation, including
with reduced motion enabled, and is hidden when printing.

## Accessibility

Lint includes the recommended `eslint-plugin-jsx-a11y` rules. A scoped npm peer
override keeps the existing ESLint 10 setup: jsx-a11y 6.10.2 declares support only
through ESLint 9; its recommended rules are verified by `npm run lint` on ESLint 10.
Topic filters expose selection with `aria-pressed`; the icon-only theme button announces its current
mode and next action. The first keyboard stop is a visible-on-focus skip link to
main content, which accepts focus without adding a tab stop. Subsequent Tab stops
follow document order, with a visible focus outline.

Faint text (including 11–12px metadata) meets WCAG AA's 4.5:1 requirement:
`#6A7167` on light `#F3F4EF` is 4.55:1, and `#808779` on dark `#121410` is
4.99:1. On the next-essay card's surface, the ratios are 5.04:1 (light) and
4.55:1 (dark). The skip link uses the surface and primary text colours in both themes.
