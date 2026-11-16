import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildOgImages } from "./build-og.js";
import { learningSections } from "../src/content/learning.js";
import { essayCard, loadFonts, palette, siteCard } from "./og-image.js";
import { articles } from "../src/content/writing.js";
import { site } from "../src/content/site.js";
import { OG_HEIGHT, OG_WIDTH } from "../src/lib/og.js";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Every string the card tree draws with.
const textsOf = (node) => {
  if (typeof node === "string") return [node];
  if (Array.isArray(node)) return node.flatMap(textsOf);
  if (!node || typeof node !== "object") return [];
  const children = node.props?.children;
  if (children === undefined) return [];
  return textsOf(children);
};

const dimensions = (png) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

describe("Open Graph images", () => {
  const dir = mkdtempSync(join(tmpdir(), "personal-site-og-"));

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes a 1200x630 PNG for the site, every essay and every learning section", async () => {
    const written = await buildOgImages(join(dir, "og"));

    expect(written).toEqual([
      "site.png",
      ...articles.map((article) => `${article.slug}.png`),
      ...learningSections.map((section) => `learning-${section.slug}.png`),
    ]);

    for (const name of written) {
      const file = join(dir, "og", name);
      expect(existsSync(file)).toBe(true);
      const png = readFileSync(file);
      expect(png.subarray(0, 8)).toEqual(PNG_SIGNATURE);
      expect(dimensions(png)).toEqual({ width: OG_WIDTH, height: OG_HEIGHT });
    }
  });

  it("shows the title, topic and author on an essay card", () => {
    for (const article of articles) {
      const texts = textsOf(
        essayCard({
          title: article.title,
          topic: article.topic,
          date: article.date,
          readTime: article.readTime,
          author: site.handle,
        }),
      );
      expect(texts).toContain(article.title);
      expect(texts).toContain(article.topic);
      expect(texts).toContain(site.handle);
    }
  });

  it("shows the name, role and tagline on the site card", () => {
    const texts = textsOf(siteCard());
    expect(texts).toContain(site.handle);
    expect(texts).toContain(site.role);
    expect(texts).toContain(site.tagline);
  });

  it("draws the cards with the site palette", () => {
    const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
    const variable = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];

    expect(palette.paper).toBe(variable("bg"));
    expect(palette.surface).toBe(variable("surface"));
    expect(palette.raised).toBe(variable("raised"));
    expect(palette.text).toBe(variable("text"));
    expect(palette.muted).toBe(variable("muted"));
    expect(palette.faint).toBe(variable("faint"));
    expect(palette.line).toBe(variable("line"));
    expect(palette.pine).toBe(variable("accent"));
    expect(palette.pineDeep).toBe(variable("accent-hover"));
    expect(palette.clay).toBe(variable("accent-secondary"));
    expect(palette.plum).toBe(variable("accent-tertiary"));
  });

  it("bundles the Fraunces faces locally instead of fetching them", () => {
    const fonts = loadFonts();
    expect(fonts.length).toBeGreaterThan(0);
    for (const font of fonts) {
      expect(font.name).toMatch(/^Fraunces/);
      expect(font.data.byteLength).toBeGreaterThan(1000);
      expect(existsSync(new URL(`../fonts/${font.file}`, import.meta.url))).toBe(true);
    }
  });
});
