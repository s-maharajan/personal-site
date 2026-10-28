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
| `writing.js` | Published essays, shown on the home page and at `/writing/<slug>`. |

## Structure

```
src/
  content/     site, writing
  components/  Layout, Header, Footer, Icons
  lib/         og (shared Open Graph image paths and sizes)
  pages/       Home, Essay, About, NotFound
scripts/       build-feeds, build-og, prerender
fonts/         Fraunces, bundled for the build-time cards
```

## Deploying

`npm run build` runs Vite, generates the feeds, sitemap and robots.txt, then
server-renders `/`, `/about`, and every `/writing/<slug>` into `dist/<route>/index.html`.
Each page includes its content, title, description, Open Graph tags and canonical URL.
Essay descriptions use `summary`; canonical and Open Graph URLs use `site.url` in
`src/content/site.js`. Update that URL when changing the public domain.

The build also renders the Open Graph cards: `dist/og/site.png` for the site and
`dist/og/<slug>.png` for every essay, all 1200x630 PNGs. `scripts/build-og.js`
draws them with satori and rasterises them with resvg, using the palette from
`src/index.css` and the Fraunces files in `fonts/`. Nothing is fetched at build
time, so the build works offline. Every page points at its card with
`og:image`, `og:image:width`, `og:image:height` and `twitter:card=summary_large_image`;
essays use their own card, the home and about pages share the site card. Run
`npm run og` on its own to re-render the cards.

The browser hydrates the rendered content and continues to navigate client-side,
updating page metadata. The inline theme script still applies the saved or system
theme before paint. `vercel.json` keeps its routing fallback: existing static files
win, and unmatched URLs serve `index.html` for the client-side 404 page.

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
