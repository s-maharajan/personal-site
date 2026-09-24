# personal-site

My personal site: a short intro, case studies, and background. Built with React, Vite, Tailwind CSS, and React Router, and deployed on Vercel.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs to dist/
```

Requires Node 22.

## Editing content

All the text lives in `src/content/`, so most changes don't touch any components:

| File | What it holds |
| --- | --- |
| `site.js` | Name, role, intro, "Now" list, email, and social links. Empty links are hidden. |
| `work.js` | Case studies. Each one gets its own page at `/work/<slug>`. The first three appear on the home page. |
| `about.js` | Experience timeline, principles, toolbox, and planned writing. Add an `href` to a post to make it a link. |

## Structure

```
src/
  content/     text and data
  components/  Layout, Header, Footer, ThemeToggle, WorkList, Section, SocialLinks
  pages/       Home, Work, CaseStudy, About, NotFound
```

Colours are CSS variables in `src/index.css`, with light and dark palettes. The site follows the system theme until a visitor picks one with the toggle.

## Deploying

`vercel.json` builds with `npm run build` and rewrites every path to `index.html` so client-side routes work on refresh.
