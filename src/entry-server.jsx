import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import Essay from "./pages/Essay";
import About from "./pages/About";
import Writing from "./pages/Writing";
import Learning from "./pages/Learning";
import LearningSection from "./pages/LearningSection";
import { sortedArticles } from "./content/writing";
import { learningSections } from "./content/learning";

const pages = { Essay, About, Writing, Learning, LearningSection };

// Every path the build writes to dist/, plus the 404 page.
export const routes = [
  "/",
  "/writing",
  "/learning",
  "/about",
  ...learningSections.map((s) => `/learning/${s.slug}`),
  ...sortedArticles.map((a) => `/writing/${a.slug}`),
];

export function render(path) {
  const markup = renderToString(<MemoryRouter initialEntries={[path]}><App {...pages} /></MemoryRouter>);
  // React 19 hoists page metadata out of the app. Move it into the document head
  // while keeping the hydratable app markup inside #root.
  const metadata = /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/>|<link\b[^>]*rel="canonical"[^>]*\/>/g;
  return {
    head: (markup.match(metadata) || []).join("\n    "),
    body: markup.replace(metadata, ""),
  };
}
