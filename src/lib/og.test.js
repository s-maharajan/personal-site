import { describe, expect, it } from "vitest";
import { OG_HEIGHT, OG_WIDTH, SITE_OG_SLUG, ogFileName, ogImagePath, ogImageUrl } from "./og";

describe("Open Graph image paths", () => {
  it("keeps the Open Graph card size at 1200x630", () => {
    expect(OG_WIDTH).toBe(1200);
    expect(OG_HEIGHT).toBe(630);
  });

  it("names the site card site.png", () => {
    expect(SITE_OG_SLUG).toBe("site");
    expect(ogFileName(SITE_OG_SLUG)).toBe("site.png");
    expect(ogFileName("why-rag-hallucinates-chunking")).toBe("why-rag-hallucinates-chunking.png");
  });

  it("builds a public path and an absolute url", () => {
    expect(ogImagePath("site")).toBe("/og/site.png");
    expect(ogImageUrl("site", "https://example.com")).toBe("https://example.com/og/site.png");
    expect(ogImageUrl("site", "https://example.com/")).toBe("https://example.com/og/site.png");
  });
});
