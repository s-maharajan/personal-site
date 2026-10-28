# Task #47: personal-site release readiness review

**Scope:** the 14 unreleased commits in `origin/main..HEAD` (tasks #12–#17: Vitest tests, static prerender with per-page meta, build-time OG images, essay TOC/headings/reading progress, a11y lint pass, security and performance headers). Together they change 44 files (+4131/−238).

## Verdict: **NO-GO** (it becomes a GO once two fixes and one check are done)

Neither review agent found a code defect severe enough to block on its own. Both independently flagged one regression in this release: **every unknown URL is served the prerendered Home page with HTTP 200**. Nobody has run the build or the tests on this branch, and no CI would catch a break before Vercel deploys. I would not ship a regression that affects every page plus an unverified build.

**To get to GO:** fix B1, run lint, tests and build once (B2), and remove the stray agent notes (S1). Then check a Vercel preview with the checks under "Preview checks" and promote. Rollback risk is low: it's a static site, and Vercel's instant rollback to the previous deployment works.

## Blockers (ranked)

| # | Finding | Files | Found by |
|---|---|---|---|
| B1 | **Soft-404 regression.** `prerender.js` writes the Home page into `dist/index.html`, and the catch-all rewrite sends every unmatched path to it. `/writing/typo` returns 200 with Home's title, a canonical pointing at `/` and no `noindex`. The client then hydrates `NotFound` over Home's markup, which logs a hydration mismatch and re-renders from scratch. `noindex` only appears after JS runs. The README (`README.md:66-67`) now describes this behaviour wrongly. **Fix:** prerender a `dist/404.html` and drop the catch-all rewrite (every real route is now a static file) or narrow it. Add a test that a missing route gets a 404 with `noindex` in the static HTML. | `scripts/prerender.js:13-20`, `vercel.json:5-7`, `src/entry-server.test.jsx:84-89`, `README.md:66-67` | release-readiness-agent, code-quality-review (I confirmed it by reading the source) |
| B2 | **The build is unverified and has no gate.** There is no `node_modules` in the worktree, so neither agent could run `npm run lint`, `npm test` or `npm run build`. The only evidence they pass is the earlier agents' own notes (`OUTPUT-16.md`, `OUTPUT-17.md`). The only workflow is the secret scan, and Vercel runs just `npm run build`. So the CSP-hash test (`scripts/security.test.js:15-24`), which guards the inline theme script, never runs before a deploy. If someone edits `index.html:12-24`, the script is silently blocked in production. **Fix:** run `npm ci && npm run lint && npm test && npm run build` once before release. Then add it as a required CI check, or run `npm test` before the build. | `.github/workflows/secret-scan.yml`, `package.json:13`, `vercel.json:3`, `scripts/security.test.js:15-24`, `index.html:12-24` | release-readiness-agent, code-quality-review, github-actions-hardening |

## Should fix (soon, ideally in this release)

| # | Finding | Files | Found by |
|---|---|---|---|
| S1 | **Agent handoff notes are committed.** The checkpoint commits `7a2abed` and `e6a35f4` added `OUTPUT-16.md` and `OUTPUT-17.md`. They are not deployed (Vite only copies `public/`), but they expose internal sandbox paths and contain statements that are now stale. Delete them and add `OUTPUT-*.md` to `.gitignore`. This report, `OUTPUT-47.md`, falls under the same rule. | `OUTPUT-16.md`, `OUTPUT-17.md`, `.gitignore` | release-readiness-agent, code-quality-review |
| S2 | **Stale chunks after a redeploy blank the app.** Essay and About are loaded with `lazy()` and there is no error boundary. A tab opened before a deploy navigates, the old hashed chunk is gone, `import()` rejects, and the whole tree unmounts. Add an error boundary around `<Outlet>` that reloads the page once, and move `<Suspense>` inside Layout. | `src/App.jsx:7-8,13` | code-quality-review |
| S3 | **The prerender can fail silently.** Both `.replace("</head>")` and `.replace('<div id="root"></div>')` do nothing if the template changes, so pages ship with an empty root and no meta while the build stays green. Assert both markers are present and log the page count. Also, `createServer` runs in dev mode (`import.meta.env.DEV` is true during SSR). | `scripts/prerender.js:7-11,18-20` | code-quality-review |
| S4 | **The hand-written WOFF2 encoder is only checked structurally.** If a browser's font sanitizer rejects the output, the site silently falls back to Georgia. Use a maintained encoder, or add a test that decodes the files. | `scripts/subset-fonts.js:23-53`, `scripts/security.test.js:52-57` | code-quality-review |

## Nice-to-haves

1. **Scroll handler.** It calls `getBoundingClientRect()` and writes a style on every scroll event; throttle it with `requestAnimationFrame` (`src/pages/Essay.jsx:19-35`).
2. **OG card SemiBold.** The 600 weight is registered as the family "Fraunces SemiBold" but requested as "Fraunces" at 600, so satori falls back to another weight. Long titles can also overflow, and the placeholder text "personal-site" is drawn on every card (`scripts/og-image.js:29-37,89-95,129,188`).
3. **`og:type`.** It is hard-coded to `website` for essays too; move it into `PageMeta.jsx` and set `article` with `article:published_time` (`index.html:6`).
4. **Heading anchors.** The anchor's `aria-label="Link to X"` sits inside the `<h2>`, so screen readers announce "X Link to X" (`src/pages/Essay.jsx:~126`).
5. **Meta-hoisting regex.** It is over-broad and could hoist an SVG `<title>` or `<meta itemprop>` (`src/entry-server.jsx:12`).
6. **Font preload.** The preload `href="/src/assets/…woff2"` relies on Vite rewriting it to a hashed path; check it in the built `dist/` (`index.html:11`).
7. **Header and footer weight.** `font-medium` now renders at 400 because the variable font was replaced with static faces; confirm this is intended (`src/components/Header.jsx:65`, `Footer.jsx:9`).
8. **Tests:** content tests pin dates and slugs, so publishing an essay will break them (`src/content/writing.test.js:30-32`). There are no tests against the built `dist/` and no jsdom tests for the hash-scroll and reading-progress code (`src/components/Layout.jsx:10-23`). The contrast tests miss `muted`, the accent colour and the skip-link pair (`src/accessibility.test.js`).
9. **Headers:** `vercel.json` sets no HSTS (Vercel normally adds it, so confirm on the preview). The CSP will block the Vercel Toolbar on previews.
10. **Docs and config:** the README lists the build order wrongly (`README.md:49`). `site.url` is hard-coded to the `vercel.app` hostname and needs updating for a custom domain (`src/content/site.js:7`).
11. **CI hardening (github-actions-hardening, all LOW/INFO):**
    - No `.github/dependabot.yml` for the `github-actions` ecosystem, so the SHA-pinned `actions/checkout` won't get update PRs.
    - `runs-on: ubuntu-latest` is a mutable runner image.
    - `push` and `pull_request` both trigger, so same-repo PRs get duplicate runs.

## What's already in good shape

- **Workflow security (github-actions-hardening on `.github/workflows/secret-scan.yml`):** no CRITICAL, HIGH or MEDIUM findings. Specifically:
  - Only unprivileged triggers (`push`, `pull_request`, `schedule`, `workflow_dispatch`); no `pull_request_target` or `workflow_run`.
  - No `${{ }}` interpolation in `run:` blocks. The `${{ github.ref }}` in the concurrency group is not a shell sink.
  - Least-privilege top-level `permissions: contents: read`.
  - `actions/checkout` is pinned to a full SHA with a version comment, and sets `persist-credentials: false`.
  - The gitleaks binary is version-pinned and SHA-256 verified.
  - The job has a timeout, and no secrets are used.
  - The workflow is unchanged in this release range.
- **CSP (`vercel.json:23`)** matches what the app loads: fonts are self-hosted, there are no inline `style=""` attributes, no `dangerouslySetInnerHTML`, and no third-party origins. The inline script is pinned by hash, though I couldn't recompute the hash myself (see Limitations).
- **Caching:** immutable caching applies only to the hashed `/assets/*` files. HTML, OG images, the feed and the sitemap keep Vercel's default revalidation.
- **The build fails safely.** The steps are chained with `&&`, and the prerender closes its server in `finally`. If the build fails, Vercel keeps the previous deployment live.
- **The OG pipeline needs no network at build time** (fonts come from `fonts/`, and the image-rendering binaries are pinned in the lockfile). No secrets in the diff.
- **Code structure:** there is a single OG contract (`src/lib/og.js`). Essay helpers are pure and well tested (`src/lib/essay.js`). Lazy routes hydrate over the SSR markup.

## Preview checks (before promoting)

- Run `curl -sI` against `/`, `/about`, `/writing/<slug>`, `/assets/<file>`, `/og/site.png` and `/nope`. Check status codes, the CSP, HSTS and `Cache-Control`.
- Load `/about` and an essay with devtools open. There should be no CSP violations and no hydration errors, and the font preload should resolve to a hashed `/assets/` path.

## Kit agents and skills used

- **`release-readiness-agent`** (subagent): ran read-only over `origin/main..HEAD` and covered deploy and rollback safety, headers and CSP, build failure modes, config and secrets, and stray artefacts. Its verdict was conditional GO with 0 blockers, 1 HIGH (B1) and 3 MEDIUM (B2, S1, preview checks).
- **`code-quality-review`** (subagent): ran read-only over the same diff and covered correctness, error handling, tests, performance and maintainability. It found 0 hard blockers and 4 should-fix issues (B1, S2, S3, S4), plus the nice-to-haves.
- **`github-actions-hardening`** (skill): applied to `.github/workflows/secret-scan.yml` following its 7-step process and report format. It found only LOW/INFO hardening gaps.

**How the verdict was reached:** both agents rated B1 HIGH and called it the thing to fix before release. I confirmed it by reading `scripts/prerender.js` and `vercel.json`. I raised the combined verdict to NO-GO because, on top of that regression, nobody has run the build (B2).

## Limitations

- There is no `node_modules`, and installing needs the network, so I couldn't run lint, tests or the build. The subagents' shell access was also denied after their first commands.
- My own attempt to recompute the CSP hash of the inline script needed approval and was not run. The hash in `vercel.json:23` has not been checked.
- Line numbers come from reading HEAD and may be off by a line or two (marked `~` where the agents said so).
- This review changed no code, workflows or config; it wrote only this file.
