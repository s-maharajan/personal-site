# Task #71 — output

Health check and fix for `personal-site`. The full report is in
[`HEALTH.md`](HEALTH.md). This file records what was done offline and the
exact commands that still have to run outside this machine, in order.

## What was done in the repository

- Ran the full pipeline (`npm run lint`, `npm test`, `npm run build`) and
  captured the real output; it was green before anything was changed, and is
  green after.
- Measured coverage with the v8 provider to ground the missing-tests section.
- Patched the three high-severity dependency advisories
  (`vite` 8.3.1 → 8.3.6, `zod` 4.3.6 → 4.6.7, `source-map-js` 1.2.1 → 1.2.2,
  `postcss-selector-parser` 6.1.4 → 6.1.6). `npm audit` went from
  11 vulnerabilities (3 high, 8 moderate) to 7 moderate, 0 high.
- Fixed `isoMonth()` silently returning month `00` for an unrecognised month
  name, which sorted a mistyped essay to the top of the site and published
  `Invalid Date` to the RSS feed. It now throws with the offending date.
- Refactored `scripts/build-feeds.js` into testable pieces and added 8 tests.
  The generated `feed.xml`, `sitemap.xml` and `robots.txt` are byte-identical
  to the pre-refactor output.
- Added `scripts/check-build.js`, which asserts the build produced every route,
  every Open Graph card and every feed file, and that each prerendered page
  carries a title and a canonical link. Verified it fails when an artifact is
  removed.
- Added `.github/workflows/ci.yml`: lint, test, build and the build-completeness
  check on every push and pull request, plus a `npm audit --audit-level=high`
  gate. Actions are pinned to commit SHAs; the workflow uses
  `permissions: contents: read`, matching the existing secret-scan workflow.
- Added `npm run check:build` and `npm run verify` to `package.json`.
- Made `build-feeds.js` and `prerender.js` log what they wrote.

Test count went from 74 to 83 across 9 files. No test was weakened, skipped or
deleted.

## Remaining outside steps — exact commands, in order

These need the internet, a push, or a deploy, none of which this environment
allows. The push URL on this checkout is
`ops-push-disabled://github.com/s-maharajan/personal-site.git`, so the push
below has to be run from a checkout with normal push credentials.

### 1. Push the branch

```sh
cd /home/ops/automation/runs/71/wt
git push -u origin ops/71-personal-site-health-check-and-fix-run-t
```

### 2. Open the pull request

```sh
cd /home/ops/automation/runs/71/wt
gh pr create --base main --head ops/71-personal-site-health-check-and-fix-run-t \
  --title "Health check: patch vulnerable deps, add CI, cover the feed generator" \
  --body "$(cat <<'EOF'
Health check and fix for the personal site.

- Patch the three high-severity npm advisories (vite, zod, source-map-js,
  postcss-selector-parser). `npm audit` now reports 7 moderate, 0 high.
- Add a CI workflow that runs lint, test, build and a build-completeness
  check, plus a high-severity dependency audit gate. Actions pinned by SHA.
- Fix isoMonth() silently returning month "00" for an unrecognised month name.
- Cover scripts/build-feeds.js with 8 tests (it had none); output is
  byte-identical.
- Add scripts/check-build.js to assert the build produced every route, card
  and feed file.

74 -> 83 tests, all passing. Full report in HEALTH.md.
EOF
)"
```

### 3. Watch the new workflow run, and confirm it is green

```sh
cd /home/ops/automation/runs/71/wt
gh run list --workflow ci.yml --branch ops/71-personal-site-health-check-and-fix-run-t --limit 5
gh run watch $(gh run list --workflow ci.yml --branch ops/71-personal-site-health-check-and-fix-run-t --limit 1 --json databaseId --jq '.[0].databaseId')
```

### 4. Confirm the secret scan still passes on the new commits

```sh
cd /home/ops/automation/runs/71/wt
gitleaks git . --log-opts="--all" --config .gitleaks.toml --redact --no-banner
```

(Gitleaks is not installed in this environment. The workflow
`.github/workflows/secret-scan.yml` runs it on the push in step 1; the command
above is the local equivalent once the binary is available.)

### 5. Merge, then deploy

```sh
cd /home/ops/automation/runs/71/wt
gh pr merge ops/71-personal-site-health-check-and-fix-run-t --squash --delete-branch
```

Vercel builds on the merge to `main` using `vercel.json`
(`buildCommand: npm run build`, `outputDirectory: dist`). To deploy by hand
instead:

```sh
cd /home/ops/automation/runs/71/wt
npm i -g vercel
vercel link
vercel deploy --prod
```

### 6. Verify the deployed site

```sh
# The prerendered routes and the Open Graph card are served.
curl -sSf -o /dev/null -w '%{http_code}\n' https://personal-site-six-lovat-75.vercel.app/
curl -sSf -o /dev/null -w '%{http_code}\n' https://personal-site-six-lovat-75.vercel.app/about
curl -sSf -o /dev/null -w '%{http_code}\n' https://personal-site-six-lovat-75.vercel.app/writing/why-rag-hallucinates-chunking
curl -sSf -o /dev/null -w '%{http_code}\n' https://personal-site-six-lovat-75.vercel.app/og/site.png

# The feed, sitemap and robots are served and the feed is still valid XML.
curl -sSf https://personal-site-six-lovat-75.vercel.app/feed.xml | xmllint --noout -
curl -sSf https://personal-site-six-lovat-75.vercel.app/sitemap.xml | xmllint --noout -
curl -sSf https://personal-site-six-lovat-75.vercel.app/robots.txt

# The security headers are applied in production.
curl -sSI https://personal-site-six-lovat-75.vercel.app/ | grep -iE 'content-security-policy|x-content-type-options|referrer-policy|permissions-policy'

# An unknown route: currently a soft 404 (HTTP 200 with the home page HTML).
curl -sS -o /dev/null -w '%{http_code}\n' https://personal-site-six-lovat-75.vercel.app/this-route-does-not-exist
```

### 7. Decide the production canonical origin (open item 7 in `HEALTH.md`)

`src/content/site.js` currently hardcodes
`url: "https://personal-site-six-lovat-75.vercel.app"`, and every canonical
URL, `og:url`, sitemap entry and RSS guid is derived from it. If the real
domain differs, change it in one place and rebuild:

```sh
cd /home/ops/automation/runs/71/wt
# Edit the `url` field in src/content/site.js to the real public origin, then:
npm run verify
git commit -am "Set the canonical origin to the production domain"
git push origin ops/71-personal-site-health-check-and-fix-run-t
```

Improvement 2 in `HEALTH.md` proposes moving this to a `SITE_URL` environment
variable with a build-time guard, so that this step cannot be forgotten. That
change was not made here because it alters the build contract and needs the
real domain first.

## Not done, deliberately

- **No push, no PR, no deploy, no message to any external service.** The task
  rules for this run forbid it and the environment blocks it as well.
- **`npm audit fix --force` was not run.** It would downgrade `eslint` to 9 and
  `satori` to 0.32, undoing deliberate choices in this repository and breaking
  the Open Graph card rendering. The seven remaining moderate advisories are
  build-time only; see item 3 of the top-three improvements in `HEALTH.md`.
- **No test was weakened, skipped or deleted.** The test count went up, from
  74 to 83.
- **The canonical origin was not changed**, because the correct value is not
  derivable from the repository.

## Skills and agents used

- **`commit`** skill — followed for the cleanup, atomic-commit planning and
  conventional-commit message format.
- **`explore` sub-agent** — commissioned as a second pair of eyes for the bug
  hunt. It did not return a result within the run, so the investigation was
  completed directly instead: the Prose parser was exercised against the real
  bodies of all 11 essays, coverage was measured per file, and every build
  artifact was inspected and diffed.
- Direct tooling: `vitest` (tests and coverage), `eslint`, `vite build`,
  `npm audit`, and the GitHub API to resolve the action commit SHAs.
