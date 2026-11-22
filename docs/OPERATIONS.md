# Operations

## What is deployed

personal-site is a static site deployed to **Vercel** as the project `s-maharajan`, served at
<https://s-maharajan.vercel.app>. The previous project address
(`personal-site-six-lovat-75.vercel.app`) redirects permanently to the same path on the
current one.

There is no server to run and no database to migrate. `npm run build` produces a `dist/`
directory of static files, and Vercel serves it.

## Deploying

Vercel is connected to the Git repository and deploys on every push to `main`. The build
command and output directory come from `vercel.json`:

```json
"buildCommand": "npm run build",
"outputDirectory": "dist"
```

So a deploy is a push to `main`. There is no separate deploy step to run.

### What the build produces

| Output | What it is |
| --- | --- |
| `dist/index.html` | The home page, prerendered with full content and metadata. |
| `dist/<route>/index.html` | Every other route: `/writing`, `/writing/<slug>`, `/learning`, `/learning/<section>`, `/about`. |
| `dist/404.html` | The not-found page. Vercel serves it with a real 404 status. |
| `dist/assets/*` | Fingerprinted JS, CSS and WOFF2 fonts. Served with `Cache-Control: public, max-age=31536000, immutable`. |
| `dist/og/*.png` | 18 Open Graph cards, 1200×630. |
| `dist/feed.xml`, `dist/sitemap.xml`, `dist/robots.txt` | The feeds and the discovery files. |

The build needs **no network access**: the fonts are committed and the Open Graph renderer
reads them from disk.

### Routes and redirects

`vercel.json` sets `cleanUrls: true`, so `/about` is served from `about/index.html`.

Two redirect rules:

- Removed essay URLs redirect permanently (301) to `/writing`. **The list of slugs in
  `vercel.json` must be updated when an essay is removed**, or the old URL will 404.
- The old project host redirects permanently to the same path on the current host.

### Changing the canonical URL

`site.url` in `src/content/site.js` is the canonical origin. It drives the canonical link,
the Open Graph URLs, the feed and the sitemap. Update it when the public domain changes.

## Scheduled and automated work

| Workflow | When | What it does |
| --- | --- | --- |
| `.github/workflows/import-learning.yml` | Every 3 hours (`17 */3 * * *`), and on demand | Imports new ✅ picks from the private `daily-learning` notes into `src/content/learning.js`, verifies, and pushes. Vercel deploys the push. |
| `.github/workflows/ci.yml` | Every push and pull request | Lint, test, build. |
| `.github/workflows/codeql.yml` | Pushes to `main`, pull requests, and Mondays at 04:41 UTC | CodeQL `security-extended` for JavaScript and workflows. |
| `.github/workflows/security.yml` | Pushes, pull requests, manual runs, weekly | Semgrep, npm audit and signatures, Snyk. |
| `.github/workflows/secret-scan.yml` | Pushes, pull requests, manual runs, weekly | Gitleaks over the full git history. |
| `.github/workflows/osv-scanner.yml` | Pushes, pull requests, manual runs, weekly | OSV-Scanner over the lockfile. |

### The import-learning job

It checks out `smaharajan/daily-learning` with a read-only deploy key, imports the new picks,
and — **only if the import changed something** — lints, tests, builds, commits and pushes.

The write token is not left in `.git/config` while npm, lint, tests and the build run;
`persist-credentials: false` is set on both checkouts, and only the final push step receives
a token (via `gh auth setup-git`, which reads `GH_TOKEN` from the environment and writes
nothing to disk).

The commit it pushes stages exactly three paths: `src/content/learning.js`,
`scripts/learning-seen.json` and `scripts/learning-refresh.json`.

**One-time setup:** add the public half of a fresh SSH key as a read-only deploy key on
`smaharajan/daily-learning`, and the private half as the `DAILY_LEARNING_DEPLOY_KEY` Actions
secret on this repository. The key must work for that one repository only.

If the job stops importing, check that the secret is present and that the deploy key is still
valid on the source repository.

## Security scanning

| Tool | Workflow | What it checks | Account needed |
| --- | --- | --- | --- |
| Semgrep 1.185.0 | `security.yml` | JavaScript, React and GitHub Actions rules (`p/default`, `p/javascript`, `p/react`, `p/github-actions`); fails on any finding | No |
| npm audit | `security.yml` | Known advisories (moderate and above) and registry signatures | No |
| Snyk CLI 1.1309.0 | `security.yml` | Dependencies (`snyk test`) and source (`snyk code test`), medium and above | Free Snyk account; skipped until `SNYK_TOKEN` exists |
| CodeQL | `codeql.yml` | `security-extended` queries for JavaScript and workflows | No |
| Gitleaks | `secret-scan.yml` | Secrets in the full git history | No |
| OSV-Scanner | `osv-scanner.yml` | The lockfile against the OSV database | No |

Semgrep and CodeQL results appear under **Security → Code scanning**. Test files are excluded
from Semgrep in `.semgrepignore`. Workflows install packages with `npm ci --ignore-scripts`,
because no dependency needs an install script.

To enable Snyk: sign up at snyk.io with GitHub, copy the token from **Account settings →
Auth Token**, then:

```bash
gh secret set SNYK_TOKEN -R s-maharajan/personal-site
```

To run Semgrep locally:

```bash
pipx run semgrep==1.185.0 scan --metrics=off --error \
  --config p/default --config p/javascript --config p/react --config p/github-actions
```

To run Gitleaks locally, with Gitleaks 8.30.1 installed:

```bash
gitleaks git . --log-opts="--all" --config .gitleaks.toml --redact --no-banner
```

Keep credentials and local environment files out of Git. `.env.example` may contain
placeholders only. If a real secret is detected, remove it and rotate it; do not add a
blanket scanner exclusion to make the check pass.

## Response headers

`vercel.json` applies them, not the app. The Content-Security-Policy restricts resource
loads to the same origin, blocks embedding with `frame-ancestors 'none'`, and disables
plugins, base URL overrides and form submissions. It permits the exact inline theme script
by SHA-256 hash and nothing else — no arbitrary inline scripts, no eval. The reading
progress bar updates through CSSOM, which the policy allows.

Alongside it: `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a Permissions-Policy disabling camera,
microphone, geolocation and payment, `Cross-Origin-Opener-Policy: same-origin` and
`X-Frame-Options: DENY`. Vercel adds HSTS itself.

Fingerprinted `/assets/*` files get `Cache-Control: public, max-age=31536000, immutable`.
HTML keeps the platform's normal revalidation behaviour.

**The Vite development and preview servers do not apply these headers.** Only the deployed
site does.

## Health checks

There is no health endpoint. The site is static, so check the deployed output:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://s-maharajan.vercel.app/            # 200
curl -sS -o /dev/null -w "%{http_code}\n" https://s-maharajan.vercel.app/about        # 200
curl -sS -o /dev/null -w "%{http_code}\n" https://s-maharajan.vercel.app/nope         # 404
curl -sS -o /dev/null -w "%{http_code}\n" https://s-maharajan.vercel.app/feed.xml     # 200
curl -sS -o /dev/null -w "%{http_code}\n" https://s-maharajan.vercel.app/og/site.png  # 200
curl -sSI https://s-maharajan.vercel.app/ | grep -i content-security-policy
```

A 404 for an unknown path is correct behaviour — `dist/404.html` is served with a real 404
status.

## Rollback

Vercel keeps the previous deployment. From the Vercel dashboard, promote the earlier
deployment, or redeploy a known-good commit by pushing it to `main`. Because the build is
deterministic and offline, rebuilding any commit reproduces the same output.

## Backups

The repository is the backup: the content, the fonts and the committed WOFF2 subsets are all
in git. The only generated artefacts are the Open Graph cards and the feeds, and both are
reproduced by `npm run build`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| A page 404s on a direct visit | The route is not in `routes` in `src/entry-server.jsx`, so it was never prerendered | Add the route and rebuild |
| The old essay URL 404s instead of redirecting | The slug is missing from the redirect list in `vercel.json` | Add the slug to the redirect rule |
| The theme flashes white on load | The inline theme script's hash no longer matches the CSP, so the browser blocks it | Recompute the hash and update `vercel.json` (see [docs/DEVELOPMENT.md](DEVELOPMENT.md#working-on-the-theme-script)) |
| The Open Graph cards are missing or stale | `npm run build` did not run the OG step | Run `npm run og` and check `dist/og/` |
| A card's colours do not match the site | The palette in `scripts/og-image.js` drifted from `src/index.css` | Update the palette; the test compares the two |
| The import-learning job stopped importing | The `DAILY_LEARNING_DEPLOY_KEY` secret expired, or the deploy key was revoked | Re-issue the key pair and update both sides |
| The import pushes a change that breaks CI | The importer is not the problem; the content is | Fix the content, or revert the commit — the workflow will not push again until a new pick arrives |
| Fonts look wrong in the Open Graph card | satori matches faces by family name, and the TTF family names differ deliberately | Use the face name that matches the file; see `fonts/README.md` |
| A build fails on a machine with no network | It should not — the build is offline | Check that `fonts/` and `src/assets/` are present; a missing file means an incomplete checkout |
