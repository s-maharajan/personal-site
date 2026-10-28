import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

export function render(path) {
  const markup = renderToString(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  // React 19 hoists page metadata out of the app. Move it into the document head
  // while keeping the hydratable app markup inside #root.
  const metadata = /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/>|<link\b[^>]*rel="canonical"[^>]*\/>/g;
  return {
    head: (markup.match(metadata) || []).join("\n    "),
    body: markup.replace(metadata, ""),
  };
}
