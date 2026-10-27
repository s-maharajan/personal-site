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

## Secret scanning

[Gitleaks](.github/workflows/secret-scan.yml) scans the full Git history on pushes, pull requests,
manual runs and a weekly schedule. CI uses a pinned, checksum-verified Gitleaks 8.30.1
binary with read-only repository permissions; no license key is required.

To check locally with Gitleaks 8.30.1 installed:

```sh
gitleaks git . --log-opts="--all" --config .gitleaks.toml --redact --no-banner
```

Keep credentials and local environment files out of Git. `.env.example` may contain
placeholders only. If a real secret is detected, remove it and rotate it; do not
add a blanket scanner exclusion to make the check pass.
