import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "vite";

const out = new URL("../dist/", import.meta.url);
const template = readFileSync(new URL("index.html", out), "utf8");
const server = await createServer({
  server: { middlewareMode: true, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
});
try {
  const { render, routes } = await server.ssrLoadModule("/src/entry-server.jsx");
  const page = (path) => {
    const { head, body } = render(path);
    return template
      .replace("</head>", () => `${head}\n  </head>`)
      .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  };
  for (const path of routes) {
    const directory = new URL(`.${path === "/" ? "/" : `${path}/`}`, out);
    mkdirSync(directory, { recursive: true });
    writeFileSync(new URL("index.html", directory), page(path));
  }
  // Vercel serves dist/404.html, with a 404 status, for any path not built above.
  writeFileSync(new URL("404.html", out), page("/404"));
} finally {
  await server.close();
}
