# Fonts

Fraunces, the site's one web font, is bundled here so the Open Graph cards can
be rendered at build time without reaching the network.

| File | Family | Weight | Style |
| --- | --- | --- | --- |
| `Fraunces-Regular.ttf` | Fraunces | 400 | normal |
| `Fraunces-SemiBold.ttf` | Fraunces SemiBold | 600 | normal |
| `Fraunces-Bold.ttf` | Fraunces | 700 | normal |
| `Fraunces-Italic.ttf` | Fraunces | 400 | italic |
| `Fraunces-SemiBoldItalic.ttf` | Fraunces SemiBold | 600 | italic |

These are the static instances Fraunces v38 ships (the upstream project is
[undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)). They are
licensed under the SIL Open Font License 1.1 — the licence text is in
[OFL.txt](OFL.txt).

The family names differ between the files on purpose: satori matches the face
it draws with by family name, so each file is registered under the name it
carries internally.

The browser uses committed WOFF2 subsets in `src/assets/`, generated from the
Regular and Italic sources above. Both are static 400-weight faces; medium text
uses the browser's weight matching. The regular face is preloaded in
`index.html`; `src/index.css` defines both faces with `font-display: swap`.
The subsets retain available glyphs from Latin / Latin Extended-A (U+0020–007E,
U+00A0–017F), general punctuation (U+2000–206F), euro, trademark and arrows
(U+2190–21FF). Characters absent from the source or subset use the system serif
fallback. The same SIL Open Font License covers these subsets.

To regenerate offline after `npm ci`:

```sh
node scripts/subset-fonts.js
```

The script uses the pinned HarfBuzz WASM dependency to subset the local TTFs and
Node's Brotli encoder to package untransformed WOFF2 tables. Font generation is
an explicit maintenance step; ordinary builds use the committed files.
