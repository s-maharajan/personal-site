# Development

## Setup

Requires **Node 22.12 or newer within Node 22** (see `engines` in `package.json`).

```bash
npm ci
npm run dev      # http://localhost:5173
```

Nothing to configure. The site is static: all the content is committed under `src/content/`
and the fonts under `fonts/`, so a fresh clone builds and runs offline.

## Commands

Run in this order — it is the order CI uses.

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint over the whole project. |
| `npm test` | Vitest. Runs in Node — no browser and no jsdom. |
| `npm run build` | `vite build`, then the Open Graph cards, the feeds and the prerender. Output in `dist/`. |
| `npm run og` | Re-render only the Open Graph cards into `dist/og/`. |
| `npm run preview` | Serve the built `dist/` locally. |

There is no `typecheck` script: the project is JavaScript with JSX, not TypeScript.

## Testing

```bash
npm test
```

The tests run in Node without jsdom, so they are fast and need no browser. They cover:

- **Content** — essay and learning fields, unique slugs, newest-first ordering, sources on
  every essay, no redaction markers or work-internal wording, no email address and no full
  name on any page.
- **Rendering** — Prose (paragraphs, lists, fenced code, bold, inline code, links and bare
  https links), diagrams, and every prerendered route with its metadata.
- **The build** — Open Graph cards (1200×630 PNGs whose palette matches `src/index.css`), the
  CSP hash of the theme script, caching and redirects in `vercel.json`, and colour contrast in
  both themes.

Test files live next to the code they cover (`src/content/writing.test.js`,
`src/components/Prose.test.jsx`, `scripts/og-image.test.js`, `scripts/security.test.js`, and
so on).

## Editing content

Content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.js` | Handle, job title, full role, headline, tagline, location, canonical URL, and the GitHub and LinkedIn links. |
| `profile.js` | The about page: intro, focus areas, highlights, an anonymised timeline, certifications, open-source projects. |
| `writing.js` | The essays, listed at `/writing` and shown at `/writing/<slug>`. |
| `learning.js` | The learning log: curated entries grouped into sections. |
| `nav.js` | Header and footer navigation. |

### Adding an essay

Add an entry to `src/content/writing.js` with a unique `slug`, a `title`, a `topic`, an
`area` (`AI`, `Integration` or `Cloud`), a `date`, a `summary`, `sources` and `references`.
Lists always show AI essays first, then newest first. A section can carry a `diagram`.

The route is picked up automatically: `src/entry-server.jsx` builds `routes` from
`sortedArticles`.

### Adding a learning entry

Add it to the right section in `src/content/learning.js`. Each entry needs a unique `slug`
within its section, plus a `title`, `date`, `source`, `url`, `takeaway`, `summary`, `points`,
`tryIt` and `caveat`. Most entries also have a `flow` — the step-by-step "how it works"
diagram from the original note.

### The content rules

These are enforced by tests, and they are not negotiable:

- No email address and no full name anywhere.
- No redaction markers (`[removed]`) and no work-internal wording.
- Employer and client names, contact details and figures stay out.
- Every essay has sources.
- Slugs are unique within their section (or their collection).

### New learning picks arrive automatically

The [Import learning](../.github/workflows/import-learning.yml) workflow runs every 3 hours, or
on demand. It reads `site/notes` from `smaharajan/daily-learning` with a read-only deploy
key, adds each new ✅ pick with `scripts/import-learning.js`, then lints, tests, builds and
pushes. Vercel deploys the push.

The importer takes the title, source, summary, how it works, try-it, caveats and diagram from
the note, uses the "At a glance" line as the takeaway, and picks a section by keyword
(title hits count three times; the most hits wins, ties go to the earlier section, and no
hits means the developer toolbox). **Move an entry by hand if it lands in the wrong
section.**

Picks with redaction markers lose those lines, or are skipped when a required field has one.
`scripts/learning-seen.json` holds hashes of every source already considered, so a pick is
imported once and entries removed by hand stay removed. `scripts/learning-refresh.json`
records the last refresh: its date (`lastRefresh`) and the newest note it covered
(`lastNote`).

Each run lists every pick in the notes dated after `lastNote` with what happened to it:
imported, already considered, or not imported and why (not rated ✅, no verdict yet, an
`lnkd.in` source). Review that list for picks worth adding by hand.

One-time setup: add the public half of a fresh SSH key as a read-only deploy key on
`smaharajan/daily-learning`, and the private half as the `DAILY_LEARNING_DEPLOY_KEY` Actions
secret here.

To run the importer by hand:

```bash
node scripts/import-learning.js <daily-learning checkout>/site/notes
```

## Working on the styles

Tailwind CSS 4 is configured in `src/index.css` (`@theme`); there is no
`tailwind.config.js`. Three local conventions keep the Tailwind 3 look:

- `max-w-reading` (42rem) is the text column. Tailwind 4's own `max-w-prose` is 65ch.
- `stack-y-*` spaces children with top margins, like Tailwind 3's `space-y-*`.
- Text sizes keep fixed rem line heights. When an element has a `leading-*` class and a
  responsive size, pin the size's line height too (`sm:text-3xl/9`).

## Working on the theme script

The inline script in `index.html` applies the saved theme before paint. Its SHA-256 hash is
allow-listed in the CSP in `vercel.json`. **When you edit that script, update the hash in
`vercel.json` in the same change** — the security test detects a mismatch.

To compute the new hash:

```bash
node -e "const c=require('crypto'),f=require('fs');const s=f.readFileSync('index.html','utf8');const m=s.match(/<script>([\s\S]*?)<\/script>/);console.log('sha256-'+c.createHash('sha256').update(m[1],'utf8').digest('base64'))"
```

## Adding a page

1. Create `src/pages/<Page>.jsx`.
2. Add the route to `src/App.jsx`.
3. Add it to `routes` in `src/entry-server.jsx` if it should be prerendered.
4. Add its metadata to `pageMeta` in `src/components/PageMeta.jsx`.

A new route that is not prerendered still works client-side, but it will 404 on a direct
visit.

## Adding an external resource

The CSP in `vercel.json` allows resources from the same origin only. A new external host
needs a matching `img-src`, `connect-src` or `style-src` entry in the same change.

## Before you push

```bash
npm run lint
npm test
npm run build
```

CI runs exactly these three on every push and pull request. The build is offline, so a
failure there is a real problem, not a network one.
