import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "vite";
import { sortedArticles } from "../src/content/writing.js";

const out = new URL("../dist/", import.meta.url);
const template = readFileSync(new URL("index.html", out), "utf8");
const server = await createServer({
  server: { middlewareMode: true, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  const routes = ["/", "/about", ...sortedArticles.map((a) => `/writing/${a.slug}`)];
  for (const path of routes) {
    const { head, body } = render(path);
    const directory = new URL(`.${path === "/" ? "/" : `${path}/`}`, out);
    mkdirSync(directory, { recursive: true });
    writeFileSync(new URL("index.html", directory), template
      .replace("</head>", () => `${head}\n  </head>`)
      .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`));
  }
  console.log(`prerender: wrote ${routes.length} routes to dist/`);
} finally {
  await server.close();
}
