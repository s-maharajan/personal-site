import { describe, expect, it } from "vitest";
import { render, routes } from "./entry-server";
import { learningSections } from "./content/learning";
import { allEntries, entryCount, formatDay, findSection, sourceHost } from "./lib/learning";
import { sortedArticles } from "./content/writing";
import { site } from "./content/site";

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("learning content", () => {
  it("has sections with unique slugs and complete entries", () => {
    expect(learningSections.length).toBeGreaterThanOrEqual(4);
    const sectionSlugs = learningSections.map((s) => s.slug);
    expect(new Set(sectionSlugs).size).toBe(sectionSlugs.length);
    for (const section of learningSections) {
      expect(section.title).toBeTruthy();
      expect(section.description.length).toBeGreaterThan(40);
      expect(section.entries.length).toBeGreaterThan(0);
      const slugs = section.entries.map((e) => e.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const entry of section.entries) {
        expect(entry.title).toBeTruthy();
        expect(entry.takeaway).toBeTruthy();
        expect(entry.summary).toBeTruthy();
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(entry.url).toMatch(/^https:\/\//);
        expect(Array.isArray(entry.points)).toBe(true);
      }
    }
  });

  it("keeps no redaction markers, placeholders or work-internal phrasing", () => {
    const text = JSON.stringify(learningSections);
    expect(text).not.toMatch(/\[removed\]|undefined|TODO|lnkd\.in/);
    expect(text).not.toMatch(/\bour (agent stack|workstream|team|repos)\b/i);
  });

  it("does not list the same source twice", () => {
    const urls = allEntries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("sorts entries newest first and counts them", () => {
    expect(entryCount).toBe(learningSections.reduce((n, s) => n + s.entries.length, 0));
    const dates = allEntries.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("formats dates and hosts without time zone surprises", () => {
    expect(formatDay("2026-11-06")).toBe("6 Nov 2026");
    expect(formatDay("2026-01-31")).toBe("31 Jan 2026");
    expect(sourceHost("https://www.github.blog/x")).toBe("github.blog");
    expect(findSection("nope")).toBeUndefined();
  });
});

describe("learning routes", () => {
  it("prerenders every section and every essay, plus the index pages", () => {
    for (const s of learningSections) expect(routes).toContain(`/learning/${s.slug}`);
    for (const a of sortedArticles) expect(routes).toContain(`/writing/${a.slug}`);
    for (const p of ["/", "/writing", "/learning", "/about"]) expect(routes).toContain(p);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it.each(learningSections)("renders the $slug section with every entry and anchor", (section) => {
    const { head, body } = render(`/learning/${section.slug}`);
    expect(head).toContain(`<link rel="canonical" href="${site.url}/learning/${section.slug}"/>`);
    expect(head).toContain(`content="${site.url}/og/learning-${section.slug}.png"`);
    expect(head).toContain(escape(section.description));
    expect(body).toContain(escape(section.title));
    for (const entry of section.entries) {
      expect(body).toContain(`id="${entry.slug}"`);
      expect(body).toContain(`href="#${entry.slug}"`);
      expect(body).toContain(escape(entry.takeaway));
      expect(body).toContain(`href="${escape(entry.url)}"`);
    }
    expect(body).toContain('rel="noreferrer"');
  });

  it("links the learning index to every section", () => {
    const { head, body } = render("/learning");
    expect(head).toContain("Learning log");
    for (const s of learningSections) expect(body).toContain(`href="/learning/${s.slug}"`);
  });

  it("shows an unknown section as not found", () => {
    const { head, body } = render("/learning/missing");
    expect(head).toContain("Page not found");
    expect(body).toContain("Page not found");
  });
});

describe("privacy", () => {
  it.each(routes)("publishes no email address on %s", (path) => {
    const { head, body } = render(path);
    expect(head + body).not.toMatch(/mailto:|@gmail\.com/i);
  });
});
