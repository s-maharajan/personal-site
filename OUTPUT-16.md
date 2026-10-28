# Task 16 handoff

Implementation is complete. `npm run lint`, `npm test` (70 tests),
`npm run build`, and `npm ci --dry-run --offline` pass.
A missing-alt lint smoke check confirmed `jsx-a11y/alt-text` fires on ESLint 10.
Keyboard order, the first-stop skip link, and its focusable main target were
checked in rendered markup; no browser was available for interactive testing.

Commit creation was blocked by the environment: the worktree's Git metadata is
outside the writable workspace. Git could not create
`/home/ops/workspace/personal-site/.git/worktrees/wt/index.lock` (read-only filesystem).
No commit was created, and nothing was pushed or deployed.

Prepared commit message:

```text
Improve accessibility and enable recommended jsx-a11y rules

Expose topic selection with aria-pressed; make the skip target focusable and
keep its label readable in both themes. Verify the named theme button and
document-order focus without positive tabindex values. Keep Open Graph faint
text aligned with the light palette. Document behaviour in README.

Contrast notes (WCAG relative luminance, small text AA >= 4.5:1):
- Light faint #868E84 on #F3F4EF was 3.06:1; #6A7167 is 4.55:1.
- Dark faint #6E756A on #121410 was 3.90:1; #808779 is 4.99:1.
- Faint on surface is 5.04:1 light and 4.55:1 dark.
Add regression tests for both themes.

Preserve ESLint 10 via a scoped jsx-a11y peer override: version 6.10.2 declares
support through ESLint 9. Recommended lint passes and a missing-alt smoke check
reports jsx-a11y/alt-text. No existing dependency versions changed.

Validation: npm run lint; npm test (70 passed); npm run build;
npm ci --dry-run --offline. Keyboard order and skip target checked in rendered
markup; no browser available for interactive verification.
```
