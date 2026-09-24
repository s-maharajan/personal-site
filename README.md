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
| `site.js` | Name, role, tagline, intro, "Now" list, email, and social links. Empty links are hidden. |
| `work.js` | Case studies. Each one gets its own page at `/work/<slug>`. The first four appear on the home page, and `metric` is the big number on each card. |
| `about.js` | Experience timeline, principles, toolbox, and planned writing. Add an `href` to a post to make it a link. |

## Structure

```
src/
  content/     text and data
  components/  Layout, Header, Footer, Section, WorkGrid, Contact
  pages/       Home, Work, CaseStudy, About, NotFound
```

The site is dark only. Colours are CSS variables at the top of `src/index.css`, and each case study's headline number (`metric` in `work.js`) leads its card.

## Deploying

`vercel.json` builds with `npm run build` and rewrites every path to `index.html` so client-side routes work on refresh.
