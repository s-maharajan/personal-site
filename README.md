# personal-site

A blog: a list of essays, newest first, and a short about page. Built with React 19, Vite, Tailwind CSS, and React Router 7, deployed on Vercel.

## Run it locally

```sh
npm ci
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests (Node; no browser required)
npm run lint
npm run build    # outputs to dist/
```

Requires Node 22.12 or newer within Node 22.

`npm test` covers all twelve month conversions, newest-first article ordering,
required article fields and unique slugs, and Prose parsing and static rendering
(paragraphs, lists, fenced code, bold, and inline code), plus server-rendered route
content and per-page metadata for every essay, home, about, and the 404 fallback. Tests run in Node without
jsdom.

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
  pages/       Home, Essay, About, NotFound
```

## Deploying

`npm run build` runs Vite, generates the feeds, sitemap and robots.txt, then
server-renders `/`, `/about`, and every `/writing/<slug>` into `dist/<route>/index.html`.
Each page includes its content, title, description, Open Graph tags and canonical URL.
Essay descriptions use `summary`; canonical and Open Graph URLs use `site.url` in
`src/content/site.js`. Update that URL when changing the public domain.

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
