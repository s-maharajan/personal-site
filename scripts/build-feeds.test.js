import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFeeds, escapeXml, feedXml, robotsTxt, sitemapXml } from "./build-feeds.js";
import { site } from "../src/content/site.js";
import { sortedArticles } from "../src/content/writing.js";

const base = site.url.replace(/\/$/, "");

// An ampersand that is not part of an entity means the document is not
// well-formed XML.
const bareAmpersand = /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/;

describe("XML escaping", () => {
  it("escapes the characters that would break XML text content", () => {
    expect(escapeXml(`Tom & Jerry's <b>"bold"</b>`)).toBe(
      "Tom &amp; Jerry's &lt;b&gt;&quot;bold&quot;&lt;/b&gt;",
    );
  });

  it("escapes the ampersand before the other characters, so escapes are not double escaped", () => {
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
    expect(escapeXml("a & b")).toBe("a &amp; b");
  });
});

describe("feed.xml", () => {
  it("carries one item per published essay, newest first", () => {
    const feed = feedXml();
    const items = feed.match(/<item>/g) ?? [];
    expect(items).toHaveLength(sortedArticles.length);
    const titles = feed.match(/<title>([^<]*)<\/title>/g).slice(1);
    for (const article of sortedArticles) {
      expect(feed).toContain(`<link>${base}/writing/${article.slug}</link>`);
      expect(feed).toContain(`<guid>${base}/writing/${article.slug}</guid>`);
      expect(feed).toContain(`<description>${escapeXml(article.summary)}</description>`);
    }
    // The first item is the newest essay, matching the order the site renders.
    expect(titles[0]).toContain(escapeXml(sortedArticles[0].title));
  });

  it("gives every item a real RFC 822 publication date", () => {
    const dates = feedXml().match(/<pubDate>([^<]*)<\/pubDate>/g)
      .map((tag) => tag.replace(/<\/?pubDate>/g, ""));
    expect(dates).toHaveLength(sortedArticles.length);
    for (const date of dates) {
      expect(date).not.toContain("Invalid");
      expect(Number.isNaN(Date.parse(date))).toBe(false);
    }
  });

  it("declares the channel, the self link and the site description", () => {
    const feed = feedXml();
    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feed).toContain(`<title>${escapeXml(site.fullName)}</title>`);
    expect(feed).toContain(`<link>${base}/</link>`);
    expect(feed).toContain(`<atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />`);
    expect(feed).toContain(`<description>${escapeXml(site.tagline)}</description>`);
    expect(feed).not.toMatch(bareAmpersand);
  });
});

describe("sitemap.xml", () => {
  it("lists the home page, the about page and every essay", () => {
    const sitemap = sitemapXml();
    const locs = sitemap.match(/<loc>([^<]*)<\/loc>/g).map((tag) => tag.replace(/<\/?loc>/g, ""));
    expect(locs).toHaveLength(sortedArticles.length + 2);
    expect(locs).toContain(`${base}/`);
    expect(locs).toContain(`${base}/about`);
    for (const article of sortedArticles) {
      expect(locs).toContain(`${base}/writing/${article.slug}`);
    }
    expect(sitemap).not.toMatch(bareAmpersand);
  });
});

describe("robots.txt", () => {
  it("allows crawling and points at the sitemap", () => {
    const robots = robotsTxt();
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`Sitemap: ${base}/sitemap.xml`);
  });
});

describe("buildFeeds", () => {
  it("writes the three files and returns what it wrote", () => {
    const dir = mkdtempSync(join(tmpdir(), "feeds-"));
    const written = buildFeeds(dir);
    expect(readFileSync(join(dir, "feed.xml"), "utf8")).toBe(written.feed);
    expect(readFileSync(join(dir, "sitemap.xml"), "utf8")).toBe(written.sitemap);
    expect(readFileSync(join(dir, "robots.txt"), "utf8")).toBe(written.robots);
    expect(written.feed).toBe(feedXml());
    expect(written.sitemap).toBe(sitemapXml());
    expect(written.robots).toBe(robotsTxt());
  });
});
