# personal-site

A blog: a list of essays, newest first, and a short about page. Built with React 19, Vite, Tailwind CSS, and React Router 7, deployed on Vercel.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs to dist/
```

Requires Node 22.

## Editing content

Content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.js` | Name, role, tagline, location, email, and social links. |
| `writing.js` | Published essays, shown on the home page and at `/writing/<slug>`. |

## Structure

```
src/
  content/     site, writing
  components/  Layout, Header, Footer, Icons
  pages/       Home, Essay, About, NotFound
```

## Deploying

`vercel.json` builds with `npm run build` and rewrites all routes to `index.html` for client-side routing.
