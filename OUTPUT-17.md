# Task 17 handoff

Implemented local Fraunces WOFF2 subsets and preload, lazy Essay/About routes
with complete prerendering, immutable asset caching, and site-wide security
headers including a CSP hash for the inline theme script. Updated README and
font documentation; added security/cache/font regression tests and offline font
subset generation.

Validation passed: lint, all 74 tests, production build, and checks of all 13
prerendered pages for matching inline-script CSP hashes, existing local assets,
and absence of Google Fonts references or loading fallbacks. FreeType decoded
both font subsets and confirmed Latin/punctuation glyph coverage.

Commit blocked by environment policy: `git add` cannot create
`/home/ops/workspace/personal-site/.git/worktrees/wt/index.lock` because the linked
Git metadata is outside the writable workspace and mounted read-only. No commit,
push or deployment occurred. Changes remain in the working directory.

Headers are configured for Vercel and were not tested against a live deployment.
The committed subsets are static 400-weight regular/italic faces; unsupported
characters use the system serif fallback. Ordinary builds need no font generation.

## Intended commit message

```text
Self-host Fraunces, split route bundles and secure static responses

Replace Google Fonts with preloaded, committed Latin WOFF2 subsets and provide
offline regeneration. Lazy-load Essay and About while preserving complete
prerendered content. Apply immutable caching only to fingerprinted assets, plus
site-wide CSP and security headers; authorize the pre-paint theme script by
SHA-256 hash.

Bundle sizes (Vite production report, decimal kB):
Before initial/total JS: 280,435 bytes (92.66 kB gzip).
After initial JS: 272,725 bytes (90.64 kB gzip).
About: 1,070 bytes (0.54 kB gzip).
Essay: 7,166 bytes (2.73 kB gzip).
Initial JS drops 7,710 bytes (2.75%).
Total JS becomes 280,961 bytes (93.91 kB aggregate gzip).

Validation: lint, all 74 tests, full production build; all 13 prerendered pages
checked for matching CSP hashes, existing local asset references and absence of
Google Fonts/loading fallbacks. Both WOFF2 faces decode with FreeType and contain
Latin/punctuation glyphs. Document font generation, route loading and deployment
header behaviour.
```
