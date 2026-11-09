// Checks that a completed build actually contains everything the site
// references: a page for every route, a card for every Open Graph image and
// the three files the feed and the crawlers rely on.
//
// Run it after `npm run build`; it exits non-zero and lists what is missing.
import { existsSync, readFileSync } from "node:fs";
import { sortedArticles } from "../src/content/writing.js";
import { OG_DIR } from "../src/lib/og.js";

const dist = new URL("../dist/", import.meta.url);
const inDist = (path) => existsSync(new URL(path, dist));

const missing = [];
const routes = ["/", "/about", ...sortedArticles.map((a) => `/writing/${a.slug}`)];
for (const route of routes) {
  const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  if (!inDist(file)) missing.push(file);
}

for (const slug of ["site", ...sortedArticles.map((a) => a.slug)]) {
  if (!inDist(`${OG_DIR}/${slug}.png`)) missing.push(`${OG_DIR}/${slug}.png`);
}

for (const file of ["feed.xml", "sitemap.xml", "robots.txt", "favicon.svg"]) {
  if (!inDist(file)) missing.push(file);
}

// The prerendered pages have to carry their own metadata, not just be present.
for (const route of routes) {
  const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  if (!inDist(file)) continue; // Already reported as missing above.
  const html = readFileSync(new URL(file, dist), "utf8");
  if (!html.includes("<title>")) missing.push(`${file} (no <title>)`);
  if (!html.includes('rel="canonical"')) missing.push(`${file} (no canonical link)`);
}

if (missing.length) {
  console.error(`Build output is incomplete:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

console.log(
  `Build is complete: ${routes.length} routes, ${sortedArticles.length + 1} Open Graph cards, feed, sitemap and robots.txt.`,
);
