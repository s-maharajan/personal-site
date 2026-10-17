# personal-site

Personal portfolio and engineering notebook: distributed systems, AI inference infrastructure, and high-scale platform architecture. Built with React 19, Vite, Tailwind CSS, and React Router 7, deployed on Vercel.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs to dist/
```

Requires Node 22.

## Features

- **Interactive Systems Lab**: Real-time LLM tail-latency, concurrency, and cost simulator (`LLMSimulator.jsx`).
- **In-Depth Case Studies**: Root-cause investigations, interactive pipeline architecture diagrams, trade-off comparisons, code artifacts, and production scale metrics.
- **Global Command Palette (`⌘K`)**: Fast keyboard navigation across all case studies, technical writing, pages, and quick actions.
- **Technical Writing & Essays**: Deep architectural breakdowns covering RAG chunking, FP8 vs AWQ quantization, continuous CI LLM evaluation harnesses, and durable agent state machines.
- **Printable Resume (`/resume`)**: Clean web resume with dedicated `@media print` styling for one-click PDF export.

## Editing content

Content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.js` | Name, role, tagline, intro, "Now" focus areas, email, and social links. |
| `work.js` | Case studies (`/work` and `/work/<slug>`) with architecture flows, trade-off comparisons, and code snippets. |
| `writing.js` | Published technical essays (`/writing` and `/writing/<slug>`). |
| `resume.js` | Career timeline, competencies, and printable resume content (`/resume`). |
| `about.js` | Experience timeline, core engineering principles, and technology toolbox. |

## Structure

```
src/
  content/     site, work, writing, resume, about
  components/  Layout, Header, Footer, Section, WorkGrid, Contact, LatencyCard,
               LLMSimulator, ArchitectureDiagram, TradeoffsTable, CodeBlock, CommandPalette, Icons
  pages/       Home, Work, CaseStudy, Writing, Essay, About, Resume, NotFound
```

## Deploying

`vercel.json` builds with `npm run build` and rewrites all routes to `index.html` for client-side routing.
