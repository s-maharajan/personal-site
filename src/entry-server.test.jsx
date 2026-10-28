import { describe, expect, it } from "vitest";
import { render } from "./entry-server";
import { sortedArticles } from "./content/writing";
import { site } from "./content/site";

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("prerendered routes", () => {
  it.each(sortedArticles)("renders $slug with its own metadata and full essay", (article) => {
    const path = `/writing/${article.slug}`;
    const { head, body } = render(path);
    expect(head).toContain(`<title>${escape(`${article.title} · ${site.fullName}`)}</title>`);
    expect(head).toContain(`<meta name="description" content="${escape(article.summary)}"/>`);
    expect(head).toContain(`<meta property="og:title" content="${escape(`${article.title} · ${site.fullName}`)}"/>`);
    expect(head).toContain(`<meta property="og:description" content="${escape(article.summary)}"/>`);
    expect(head).toContain(`<meta property="og:url" content="${site.url}${path}"/>`);
    expect(head).toContain(`<link rel="canonical" href="${site.url}${path}"/>`);
    expect(head.match(/<title>/g)).toHaveLength(1);
    expect(body).toContain(escape(article.title));
    for (const section of article.content) expect(body).toContain(escape(section.heading));
    expect(body).not.toMatch(/<title>|<meta|rel="canonical"/);
    expect(body).toContain('href="/"');
    expect(body).toContain('Theme: System. Switch to Light');
  });

  it("renders home and about with distinct metadata and content", () => {
    const home = render("/");
    const about = render("/about");
    expect(home.head).toContain(escape(`${site.fullName} · ${site.role}`));
    expect(home.head).toContain(`href="${site.url}/"`);
    expect(home.body).toContain('aria-label="Filter by topic"');
    expect(about.head).toContain(`<title>About · ${site.fullName}</title>`);
    expect(about.head).toContain(`href="${site.url}/about"`);
    expect(about.head).not.toBe(home.head);
    expect(about.body).toContain(`I'm`.replace("'", "&#x27;"));
  });

  it("preserves the unknown-route fallback and noindex metadata", () => {
    const { head, body } = render("/writing/missing");
    expect(head).toContain("Page not found");
    expect(head).toContain('<meta name="robots" content="noindex"/>');
    expect(body).toContain("Page Not Found");
  });
});
