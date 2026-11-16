import { describe, expect, it } from "vitest";
import { render } from "./entry-server";
import { sortedArticles } from "./content/writing";
import { sectionIds } from "./lib/essay";
import { site } from "./content/site";
import { OG_HEIGHT, OG_WIDTH, SITE_OG_SLUG } from "./lib/og";

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("prerendered routes", () => {
  it.each(sortedArticles)("renders $slug with its own metadata and full essay", (article) => {
    const path = `/writing/${article.slug}`;
    const { head, body } = render(path);
    expect(head).toContain(`<title>${escape(`${article.title} · ${site.handle}`)}</title>`);
    expect(head).toContain(`<meta name="description" content="${escape(article.summary)}"/>`);
    expect(head).toContain(`<meta property="og:title" content="${escape(`${article.title} · ${site.handle}`)}"/>`);
    expect(head).toContain(`<meta property="og:description" content="${escape(article.summary)}"/>`);
    expect(head).toContain(`<meta property="og:url" content="${site.url}${path}"/>`);
    expect(head).toContain(`<link rel="canonical" href="${site.url}${path}"/>`);
    expect(head.match(/<title>/g)).toHaveLength(1);
    expect(body).toContain(escape(article.title));
    for (const section of article.content) expect(body).toContain(escape(section.heading));
    expect(body.includes('aria-label="Contents"')).toBe(article.content.length >= 3);
    for (const id of sectionIds(article.content)) {
      expect(body).toContain(`id="${id}"`);
      expect(body).toContain(`href="#${id}"`);
    }
    expect(body).toContain('class="reading-progress print-hidden" aria-hidden="true"');
    expect(body).not.toMatch(/<title>|<meta|rel="canonical"/);
    expect(body).toContain('href="/writing"');
    expect(body).toContain('aria-label="Switch between light and dark theme"');
  });

  it.each(sortedArticles)("points $slug at its own Open Graph image", (article) => {
    const { head } = render(`/writing/${article.slug}`);
    const image = `${site.url}/og/${article.slug}.png`;
    expect(head).toContain(`<meta property="og:image" content="${image}"/>`);
    expect(head).toContain(`<meta property="og:image:width" content="${OG_WIDTH}"/>`);
    expect(head).toContain(`<meta property="og:image:height" content="${OG_HEIGHT}"/>`);
    expect(head).toContain(`<meta name="twitter:card" content="summary_large_image"/>`);
    expect(head).toContain(`<meta name="twitter:image" content="${image}"/>`);
    expect(head).not.toContain(`/og/${SITE_OG_SLUG}.png`);
    expect(head.match(/<meta name="twitter:card"/g)).toHaveLength(1);
  });

  it("renders home and about with distinct metadata and content", () => {
    const home = render("/");
    const about = render("/about");
    expect(home.head).toContain(escape(`${site.handle} · ${site.role}`));
    expect(home.head).toContain(`href="${site.url}/"`);
    expect(home.body).toContain(escape(site.headline));
    expect(home.body).toContain('href="/learning"');
    expect(about.head).toContain(`<title>About · ${site.handle}</title>`);
    expect(about.head).toContain(`href="${site.url}/about"`);
    expect(about.head).not.toBe(home.head);
    expect(about.body).toContain(`I'm`.replace("'", "&#x27;"));
  });

  it("exposes filter selection and a first-stop skip link to focusable main content", () => {
    const { body } = render("/writing");
    expect(body).toContain('role="group" aria-label="Filter by topic"');
    const filters = body.match(/<button[^>]*aria-pressed="(true|false)"[^>]*>[^<]+<\/button>/g);
    expect(filters.length).toBeGreaterThan(1);
    expect(filters.filter((button) => button.includes('aria-pressed="true"'))).toHaveLength(1);
    expect(filters[0]).toMatch(/aria-pressed="true"[^>]*>All<\/button>/);
    for (const article of sortedArticles) expect(body).toContain(`href="/writing/${article.slug}"`);
    expect(body.match(/<(?:a|button)\b[^>]*>/)[0]).toContain('href="#main-content"');
    expect(body).toMatch(/<main id="main-content" tabindex="-1"/);
    expect(body).not.toMatch(/tabindex="[1-9]/);
  });

  it("renders the theme toggle without depending on the stored theme", () => {
    // The server cannot know the visitor's theme, so the markup must be the same
    // either way; CSS shows the right icon once the pre-paint script runs.
    const { body } = render("/");
    const toggle = body.match(/<button[^>]*aria-label="Switch between light and dark theme"[^>]*>[\s\S]*?<\/button>/)[0];
    expect(toggle).toContain("theme-icon-dark");
    expect(toggle).toContain("theme-icon-light");
    expect(toggle).not.toContain("aria-pressed");
  });

  it("shares the site Open Graph image on the home and about pages", () => {
    const image = `${site.url}/og/${SITE_OG_SLUG}.png`;
    for (const path of ["/", "/about"]) {
      const { head } = render(path);
      expect(head).toContain(`<meta property="og:image" content="${image}"/>`);
      expect(head).toContain(`<meta property="og:image:width" content="${OG_WIDTH}"/>`);
      expect(head).toContain(`<meta property="og:image:height" content="${OG_HEIGHT}"/>`);
      expect(head).toContain(`<meta name="twitter:card" content="summary_large_image"/>`);
      expect(head).toContain(`<meta name="twitter:image" content="${image}"/>`);
      expect(head.match(/<meta name="twitter:card"/g)).toHaveLength(1);
    }
  });

  it("preserves the unknown-route fallback and noindex metadata", () => {
    const { head, body } = render("/writing/missing");
    expect(head).toContain("Page not found");
    expect(head).toContain('<meta name="robots" content="noindex"/>');
    expect(body).toContain("Page not found");
    expect(head).not.toContain('rel="canonical"');
  });

  it("renders the 404 page used for unknown paths", () => {
    const { head, body } = render("/404");
    expect(head).toContain("Page not found");
    expect(body).toContain('href="/learning"');
  });
});
