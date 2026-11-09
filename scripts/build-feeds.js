// Writes feed.xml, sitemap.xml and robots.txt into dist/ after `vite build`,
// using the same content modules the app renders.
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { site } from "../src/content/site.js";
import { sortedArticles, isoMonth } from "../src/content/writing.js";

const base = site.url.replace(/\/$/, "");

// XML text content only needs these five characters escaped. The ampersand
// has to go first, otherwise the escapes it introduces are escaped again.
export const escapeXml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pubDate = (date) => new Date(`${isoMonth(date)}-01T00:00:00Z`).toUTCString();

export const feedXml = () => {
  const items = sortedArticles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/writing/${a.slug}</link>
      <guid>${base}/writing/${a.slug}</guid>
      <pubDate>${pubDate(a.date)}</pubDate>
      <category>${escapeXml(a.topic)}</category>
      <description>${escapeXml(a.summary)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.fullName)}</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(site.tagline)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
};

export const sitemapXml = () => {
  const urls = ["/", "/about", ...sortedArticles.map((a) => `/writing/${a.slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join("\n")}
</urlset>
`;
};

export const robotsTxt = () =>
  `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

// Writes the three files and returns their contents, so callers and tests see
// exactly what landed on disk.
export const buildFeeds = (outDir) => {
  const target = outDir instanceof URL
    ? outDir
    : pathToFileURL(outDir.endsWith("/") ? outDir : `${outDir}/`);
  const feed = feedXml();
  const sitemap = sitemapXml();
  const robots = robotsTxt();
  writeFileSync(new URL("feed.xml", target), feed);
  writeFileSync(new URL("sitemap.xml", target), sitemap);
  writeFileSync(new URL("robots.txt", target), robots);
  return { feed, sitemap, robots };
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  buildFeeds(new URL("../dist/", import.meta.url));
  console.log("feeds: wrote feed.xml, sitemap.xml and robots.txt to dist/");
}
