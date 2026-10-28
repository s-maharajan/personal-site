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

The browser still loads Fraunces from Google Fonts (see `index.html`). These
files exist for the build-time cards only.
