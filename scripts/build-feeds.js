// Writes feed.xml, sitemap.xml and robots.txt into dist/ after `vite build`,
// using the same content modules the app renders.
import { writeFileSync } from "node:fs";
import { site } from "../src/content/site.js";
import { sortedArticles, isoMonth } from "../src/content/writing.js";

const out = new URL("../dist/", import.meta.url);
const base = site.url.replace(/\/$/, "");
const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pubDate = (date) => new Date(`${isoMonth(date)}-01T00:00:00Z`).toUTCString();

const items = sortedArticles
  .map(
    (a) => `    <item>
      <title>${escape(a.title)}</title>
      <link>${base}/writing/${a.slug}</link>
      <guid>${base}/writing/${a.slug}</guid>
      <pubDate>${pubDate(a.date)}</pubDate>
      <category>${escape(a.topic)}</category>
      <description>${escape(a.summary)}</description>
    </item>`,
  )
  .join("\n");

writeFileSync(
  new URL("feed.xml", out),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.fullName)}</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site.tagline)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`,
);

const urls = ["/", "/about", ...sortedArticles.map((a) => `/writing/${a.slug}`)];
writeFileSync(
  new URL("sitemap.xml", out),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join("\n")}
</urlset>
`,
);

writeFileSync(new URL("robots.txt", out), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
