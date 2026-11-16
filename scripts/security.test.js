import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = read("index.html");
const config = JSON.parse(read("vercel.json"));
const headers = Object.fromEntries(config.headers.find(({ source }) => source === "/(.*)")
  .headers.map(({ key, value }) => [key, value]));
const policy = Object.fromEntries(headers["Content-Security-Policy"].split(";")
  .map((directive) => directive.trim().split(/\s+/)).map(([name, ...values]) => [name, values]));

describe("static site security and caching", () => {
  it("allows the exact pre-paint theme script by hash without allowing arbitrary inline scripts", () => {
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attributes]) => !/\bsrc=/.test(attributes));
    expect(scripts).toHaveLength(1);
    const hash = createHash("sha256").update(scripts[0][2]).digest("base64");
    expect(policy["script-src"]).toContain(`'sha256-${hash}'`);
    expect(policy["script-src"]).toContain("'self'");
    expect(policy["script-src"]).not.toContain("'unsafe-inline'");
    expect(policy["script-src"]).not.toContain("'unsafe-eval'");
  });

  it("permits local resources and denies framing, plugins and form submissions", () => {
    for (const directive of ["default-src", "style-src", "font-src", "img-src", "connect-src"]) {
      expect(policy[directive]).toEqual(["'self'"]);
    }
    for (const directive of ["frame-ancestors", "object-src", "base-uri", "form-action"]) {
      expect(policy[directive]).toEqual(["'none'"]);
    }
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=(), payment=()");
  });

  it("caches fingerprinted assets immutably without giving HTML the same lifetime", () => {
    const cacheRules = config.headers.filter(({ headers }) => headers.some(({ key }) => key === "Cache-Control"));
    expect(cacheRules).toHaveLength(1);
    expect(cacheRules[0].source).toBe("/assets/(.*)");
    expect(cacheRules[0].headers).toContainEqual({
      key: "Cache-Control", value: "public, max-age=31536000, immutable",
    });
  });

  it("preloads a local WOFF2 face used by CSS and has no external font requests", () => {
    const font = html.match(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin/)[1];
    const css = read("src/index.css");
    expect(font).toMatch(/^\/src\/assets\/.*\.woff2$/);
    expect(css).toContain(font.replace("/src/", "./"));
    for (const style of ["normal", "italic"]) {
      const bytes = readFileSync(new URL(`../src/assets/fraunces-latin-${style}.woff2`, import.meta.url));
      expect(bytes.toString("ascii", 0, 4)).toBe("wOF2");
      expect(bytes.length % 4).toBe(0);
      expect(bytes.readUInt32BE(8)).toBe(bytes.length);
    }
    expect(html + css).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });
});

describe("redirects for removed essays", () => {
  it("sends old essay URLs to the writing index without shadowing current essays", async () => {
    const { articles } = await import("../src/content/writing.js");
    const essays = config.redirects.filter(({ destination }) => destination === "/writing");
    expect(essays).toHaveLength(1);
    const [{ source, destination, permanent }] = essays;
    expect(destination).toBe("/writing");
    expect(permanent).toBe(true);
    const slugs = source.match(/^\/writing\/:slug\(([^)]+)\)$/)[1].split("|");
    expect(slugs).toContain("why-rag-hallucinates-chunking");
    for (const { slug } of articles) expect(slugs).not.toContain(slug);
  });
});

describe("old addresses", () => {
  it("sends the previous project address to the current site, keeping the path", async () => {
    const { site } = await import("../src/content/site.js");
    const old = config.redirects.find(({ has }) => has?.some(({ type }) => type === "host"));
    expect(old.has).toEqual([{ type: "host", value: "personal-site-six-lovat-75.vercel.app" }]);
    expect(old.source).toBe("/:path*");
    expect(old.destination).toBe(`${site.url}/:path*`);
    expect(old.permanent).toBe(true);
  });
});

describe("browser theme colour", () => {
  it("matches the page background of each theme in index.css and index.html", async () => {
    const { THEME_COLORS } = await import("../src/components/Header.jsx");
    const css = read("src/index.css");
    const bg = (selector) => css.slice(css.indexOf(`${selector} {`)).match(/--bg:\s*(#[0-9A-F]{6})/i)[1];
    expect(THEME_COLORS.light).toBe(bg(":root"));
    expect(THEME_COLORS.dark).toBe(bg(".dark"));
    expect(html).toContain(`<meta name="theme-color" content="${THEME_COLORS.light}" media="(prefers-color-scheme: light)" />`);
    expect(html).toContain(`<meta name="theme-color" content="${THEME_COLORS.dark}" media="(prefers-color-scheme: dark)" />`);
  });
});
