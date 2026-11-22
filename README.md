# personal-site

The personal site of s-maharajan, live at https://s-maharajan.vercel.app: essays on
integration, cloud and AI, a section-by-section learning log, and a short about page.
Built with React 19, Vite, Tailwind CSS and React Router 7, prerendered to static HTML
and deployed on Vercel. Two themes, light and dark.

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

`npm test` runs in Node without jsdom. It covers:

- content: essay and learning fields, unique slugs, newest-first ordering, sources
  on every essay, no redaction markers or work-internal wording, no email address and
  no full name on any page;
- rendering: Prose (paragraphs, lists, fenced code, bold, inline code, links and bare
  https links), diagrams, and every prerendered route with its metadata;
- the build: Open Graph cards (1200x630 PNGs whose palette matches `src/index.css`),
  the CSP hash of the theme script, caching and redirects in `vercel.json`, and colour
  contrast in both themes.

[CI](.github/workflows/ci.yml) runs lint, tests and the build on every push and pull
request. [Dependabot](.github/dependabot.yml) opens weekly pull requests for npm
packages (minor and patch updates grouped) and GitHub Actions, waiting 7 days after a
release (14 for majors) before proposing it; security updates are not delayed. `fflate` is pinned to a
patched version through `overrides`, because the Open Graph renderer depends on an
affected release.

## Editing content

Content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.js` | Handle, job title (`title`, shown above the home headline), full role (`role`, used in titles and the About page), headline, tagline, location, and GitHub and LinkedIn links. No email address or full name is published. |
| `profile.js` | The About page profile from the CV: intro, focus areas (AI first), highlights, an anonymised timeline, certifications and open-source projects. Employer and client names, contact details and figures stay out. |
| `writing.js` | Published essays, listed at `/writing` and shown at `/writing/<slug>`. Each essay has an `area` (`AI`, `Integration` or `Cloud`); lists always show AI essays first, then newest first. Each essay lists `sources` (learning entry slugs) and `references` (outside links); a Sources section is added from them. A section can carry a `diagram`. |
| `learning.js` | The learning log: curated notes grouped into sections, shown at `/learning` and `/learning/<section>`. |
| `nav.js` | Header and footer navigation. |

`learning.js` was curated from the private `daily-learning` notes: only items rated
worth keeping, de-duplicated, grouped into sections, each with a one-line takeaway, a
summary, how it works, a way to try it, caveats and the public source link. Most
entries also have a `flow`: the step-by-step "how it works" diagram from the original
note. Edit it by hand; each entry needs a unique `slug` within its section.

New picks arrive automatically. [Import learning](.github/workflows/import-learning.yml)
runs every 3 hours (or on demand). It reads `site/notes` from `smaharajan/daily-learning`
with a read-only deploy key, adds each new ✅ pick with
[`scripts/import-learning.js`](scripts/import-learning.js), then lints, tests, builds and
pushes; Vercel deploys the push. The importer takes the title, source, summary, how it
works, try-it, caveats and diagram from the note, uses the "At a glance" line as the
takeaway, and picks a section by keywords (move an entry by hand if it lands in the
wrong one). Picks with redaction markers lose those lines, or are skipped when a required
field has one. `scripts/learning-seen.json` holds hashes of every source already
considered, so a pick is imported once and entries removed by hand stay removed.
`scripts/learning-refresh.json` records the last refresh: its date (`lastRefresh`) and
the newest note it covered (`lastNote`). Each run lists every pick in the notes dated
after `lastNote` with what happened to it: imported, already considered, or not
imported and why (not rated ✅, no verdict yet, an `lnkd.in` source). Review that list
for picks worth adding by hand.

One-time setup: add the public half of a fresh SSH key as a read-only deploy key on
`smaharajan/daily-learning`, and the private half as the `DAILY_LEARNING_DEPLOY_KEY`
Actions secret here.

Diagrams use `src/components/Diagram.jsx`, with no diagram library. A flow is
`{ steps, loopBack?, loopLabel?, caption? }`, where a step is a label, a
`{ label, tone }` object (`tone` is `"accent"` or `"dashed"`), or an array of steps
that run in parallel. A layered diagram is `{ layers: [{ label, detail }], base?, caption? }`.
Diagrams render on the server, follow the theme, and read left to right on wide
screens and top to bottom on phones.

## Structure

```
src/
  content/     site, profile, writing, learning, nav
  components/  Layout, Header, Footer, Prose, Diagram, PostList, SectionCard, PageMeta, Icons
  lib/         og (Open Graph paths and sizes), learning (dates, sorting), essay
  pages/       Home, Writing, Essay, Learning, LearningSection, About, NotFound
scripts/       build-feeds, build-og, prerender
fonts/         Fraunces TTF sources and licence (cards and web subsets)
```

## Styles

Tailwind CSS 4 is configured in `src/index.css` (`@theme`); there is no
`tailwind.config.js`. Three local conventions keep the Tailwind 3 look:

- `max-w-reading` (42rem) is the text column. Tailwind 4's own `max-w-prose` is 65ch.
- `stack-y-*` spaces children with top margins, like Tailwind 3's `space-y-*`.
- Text sizes keep fixed rem line heights. When an element has a `leading-*` class and
  a responsive size, pin the size's line height too (`sm:text-3xl/9`).

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
URLs of essays that were removed redirect permanently to `/writing`, and the
previous project address (`personal-site-six-lovat-75.vercel.app`) redirects to the
same path on `s-maharajan.vercel.app`. Once a visitor picks a theme, the browser UI
colour (`theme-color`) follows it too.

The site is the Vercel project `s-maharajan`, served at https://s-maharajan.vercel.app.

## Performance and response headers

Fraunces is served locally as committed Latin WOFF2 subsets, with no Google Fonts
stylesheet or third-party font requests. The regular face is preloaded; italic
loads when used. Vite fingerprints both files under `/assets/`. See
[fonts/README.md](fonts/README.md) for coverage and offline regeneration.
Home and the small 404 page load eagerly; the other pages use `React.lazy` with a
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
allows. External social links remain normal navigation links.

Responses also set `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin` and a Permissions Policy
disabling camera, microphone, geolocation and payment access, plus
`Cross-Origin-Opener-Policy: same-origin` and `X-Frame-Options: DENY` (for browsers
that predate `frame-ancestors`). Vercel adds HSTS itself. These headers are
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

## Security scanning

All of these are free for a public repository and run on pushes to `main`, pull
requests, manual runs and a weekly schedule:

| Tool | Workflow | What it checks | Account needed |
| --- | --- | --- | --- |
| Semgrep 1.185.0 | [security.yml](.github/workflows/security.yml) | JavaScript, React and GitHub Actions rules (`p/default`, `p/javascript`, `p/react`, `p/github-actions`); fails on any finding | No |
| npm audit | [security.yml](.github/workflows/security.yml) | Known advisories (moderate and above) and registry signatures | No |
| Snyk CLI 1.1309.0 | [security.yml](.github/workflows/security.yml) | Dependencies (`snyk test`) and source (`snyk code test`), medium and above | Free Snyk account; skipped until the `SNYK_TOKEN` secret exists |
| CodeQL | [codeql.yml](.github/workflows/codeql.yml) | `security-extended` queries for JavaScript and workflows | No |
| Gitleaks | [secret-scan.yml](.github/workflows/secret-scan.yml) | Secrets in the full history | No |

Semgrep and CodeQL results appear under **Security → Code scanning**. Test files are
excluded from Semgrep in [.semgrepignore](.semgrepignore). Workflows install packages
with `npm ci --ignore-scripts` (no dependency needs an install script), and the import
workflow hands its write token only to the final push step.

To enable Snyk: sign up at snyk.io with GitHub, copy the token from **Account settings
→ Auth Token**, then `gh secret set SNYK_TOKEN -R s-maharajan/personal-site`.

To run Semgrep locally:

```sh
pipx run semgrep==1.185.0 scan --metrics=off --error \
  --config p/default --config p/javascript --config p/react --config p/github-actions
```

Report vulnerabilities as described in [SECURITY.md](SECURITY.md).

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
Topic filters expose selection with `aria-pressed`. The theme button has a fixed
label ("Switch between light and dark theme"), and CSS shows the matching icon, so the
prerendered markup never depends on the stored theme. The first keyboard stop is a
visible-on-focus skip link to main content. Diagrams are ordered lists of steps with a
caption, so screen readers get the steps in order.

Small text meets WCAG AA's 4.5:1 in both themes: faint text on the page, surface and
raised backgrounds, and the accent colour as link text and as a button fill. The
tests compute these ratios from the colour tokens in `src/index.css`.
