# Architecture

personal-site is a static personal site: essays on integration, cloud and AI, a curated
learning log, and a short about page. It is a React 19 SPA that is **prerendered to plain
HTML at build time** and then hydrated in the browser.

There is no server, no API and no database. Everything the site serves — the content, the
fonts, the Open Graph cards, the feeds — is either committed to the repository or generated
from it during `npm run build`.

## Shape of the build

```
 src/content/*.js                 npm run build                        dist/
┌───────────────────────┐                                        ┌──────────────────────┐
│ site, profile,        │  1. vite build            ───────────▶  │ assets/*             │
│ writing, learning, nav│                                        │   fingerprinted JS,  │
└───────────────────────┘                                        │   CSS and WOFF2      │
                          2. node scripts/build-og.js ─────────▶  │ og/*.png             │
                              satori + resvg, offline              │   18 cards, 1200x630│
                                                                            │
                          3. node scripts/build-feeds.js ───────▶  │ feed.xml, sitemap.xml│
                              feed, sitemap, robots.txt            │   robots.txt         │
                                                                            │
                          4. node scripts/prerender.js ─────────▶  │ <route>/index.html   │
                              renderToString per route             │   full content + meta│
                                                                            │
                                                                            │ 404.html            │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

The four steps run in that order, and the order matters:

1. **`vite build`** produces the client bundle and the CSS. It also empties `dist/` and
   copies `public/` over, so anything written to `dist/` afterwards is safe.
2. **`scripts/build-og.js`** renders the Open Graph cards. It runs *after* the Vite build
   because that build empties `dist/` first. satori lays out a React-like tree into SVG and
   resvg rasterises it to PNG; the Fraunces files in `fonts/` are read from disk, so nothing
   is fetched and the build works offline.
3. **`scripts/build-feeds.js`** writes `feed.xml`, `sitemap.xml` and `robots.txt` from the
   same content modules the app renders.
4. **`scripts/prerender.js`** creates a Vite server in middleware mode, loads
   `src/entry-server.jsx` through it, and renders each route to `dist/<route>/index.html`.
   It also writes `dist/404.html`.

## Rendering

The same React tree serves both the prerendered HTML and the client app.

- `src/entry-server.jsx` exports `routes` — the list of every path the build writes — and
  `render(path)`, which calls `renderToString` inside a `MemoryRouter`.
- React 19 hoists `<title>`, `<meta>` and the canonical `<link>` out of the app markup.
  `render()` pulls them back out with a regular expression and returns them separately, so
  the prerenderer can put them in `<head>` and keep the rest inside `#root`.
- `src/main.jsx` checks whether `#root` already has children: if it does, `hydrateRoot`;
  otherwise `createRoot`. That single check is what makes the same bundle work as a
  prerendered page and as a client-side navigation.
- `src/App.jsx` lazily loads everything except the home page and the 404 page, with a
  `Suspense` fallback. The prerenderer passes the eager page components in as props, so the
  initial HTML still contains the full content and metadata of every published route rather
  than a loading placeholder.

## Routing

React Router 7 in the browser; a flat directory of static files on the server.

| Path | Source |
| --- | --- |
| `/` | `src/pages/Home.jsx` |
| `/writing` | `src/pages/Writing.jsx` |
| `/writing/:slug` | `src/pages/Essay.jsx`, one route per essay in `src/content/writing.js` |
| `/learning` | `src/pages/Learning.jsx` |
| `/learning/:section` | `src/pages/LearningSection.jsx`, one route per section in `src/content/learning.js` |
| `/about` | `src/pages/About.jsx` |
| anything else | `src/pages/NotFound.jsx` → `dist/404.html`, served with a real 404 status |

`vercel.json` sets `cleanUrls: true`, so `/about` is served from `about/index.html`.
Removed essay URLs redirect permanently to `/writing` — the list of slugs is in
`vercel.json` and must be updated when an essay is removed.

## Content

All content is JavaScript modules under `src/content/`, so it is typed by nothing but
review, and it is importable from the app, the build scripts and the tests alike.

| File | What it holds |
| --- | --- |
| `site.js` | Handle, job title, role, headline, tagline, location, canonical URL, and the GitHub and LinkedIn links. No email address and no full name is published. |
| `profile.js` | The about page: intro, focus areas, highlights, an anonymised timeline, certifications and open-source projects. Employer and client names, contact details and figures are deliberately left out. |
| `writing.js` | The essays. Each has an `area` (`AI`, `Integration` or `Cloud`), a topic, a date, a summary, `sources` (learning entry slugs) and `references` (outside links). Lists show AI essays first, then newest first. |
| `learning.js` | The learning log: curated entries grouped into sections, each with a takeaway, a summary, how it works, a way to try it, caveats, a source link, and usually a `flow` diagram. |
| `nav.js` | Header and footer navigation. |

**The content is public.** No email address, no full name, no employer or client names and
no work-internal wording may be published. There are tests for each of these rules.

## Diagrams

`src/components/Diagram.jsx` renders the flow and layered diagrams with no diagram library.

- A flow is `{ steps, loopBack?, loopLabel?, caption? }`, where a step is a label, a
  `{ label, tone }` object (`tone` is `"accent"` or `"dashed"`), or an array of steps that run
  in parallel.
- A layered diagram is `{ layers: [{ label, detail }], base?, caption? }`.

Diagrams render on the server (so they appear in the prerendered HTML), follow the theme,
and read left to right on wide screens and top to bottom on phones.

## Theming

Two themes, light and dark.

- The inline script in `index.html` applies the stored theme, or the system preference,
  **before paint**, so there is no flash of the wrong theme.
- `src/index.css` holds the design tokens in `@theme` (Tailwind CSS 4; there is no
  `tailwind.config.js`).
- The header button toggles between them and saves the choice in `localStorage`. The
  `theme-color` meta tags carry `media` attributes for the two system preferences, and the
  browser UI colour follows the chosen theme.
- The prerendered markup never depends on the stored theme: the button has a fixed label
  ("Switch between light and dark theme") and CSS shows the matching icon.

## Open Graph cards

The contract lives in `src/lib/og.js`: `OG_WIDTH` (1200), `OG_HEIGHT` (630), `OG_DIR`
(`og`), `SITE_OG_SLUG` (`site`), `ogFileName`, `ogImagePath`, `ogImageUrl` and
`learningOgSlug`. Both the page metadata and the build script read it, so a page can never
point at a file the build does not produce.

`dist/og/site.png` is the site card; `dist/og/<slug>.png` is each essay's card;
`dist/og/learning-<section>.png` is each learning section's card. The home and about pages
share the site card. `scripts/og-image.js` holds the palette, and a test compares it against
the colour tokens in `src/index.css` so the cards cannot drift from the site colours.

## Fonts

Fraunces is bundled rather than fetched: the TTF sources live in `fonts/` (SIL Open Font
License 1.1, see `fonts/OFL.txt`), and the browser uses committed Latin WOFF2 subsets in
`src/assets/`. There is no Google Fonts stylesheet and no third-party font request. The
regular face is preloaded; italic loads when used. Vite fingerprints both files.

The family names inside the TTF files differ on purpose: satori matches the face it draws
by family name, so each file is registered under the name it carries internally.

## Feeds and discovery

`scripts/build-feeds.js` writes `feed.xml` (essays and learning sections),
`sitemap.xml` and `robots.txt`, all from the same content modules the app renders, using
`site.url` as the base. `src/app/manifest.ts` is not used here — this is a plain site, not a
PWA.

## Security headers

`vercel.json` applies the headers, not the app. The Content-Security-Policy restricts
resource loads to the same origin, blocks embedding with `frame-ancestors 'none'`, and
disables plugins, base URL overrides and form submissions. It permits the exact inline theme
script by SHA-256 hash — it does not permit arbitrary inline scripts or eval. The reading
progress bar updates through CSSOM, which the policy allows.

Alongside it: `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a Permissions-Policy disabling camera,
microphone, geolocation and payment, `Cross-Origin-Opener-Policy: same-origin` and
`X-Frame-Options: DENY`. Vercel adds HSTS itself. Fingerprinted `/assets/*` files are served
with `Cache-Control: public, max-age=31536000, immutable`; HTML keeps the platform's normal
revalidation behaviour.

The Vite development and preview servers do **not** apply these headers.
