// The Open Graph image contract, shared by the page metadata and the build
// script that renders the images. Both sides read these, so a page can never
// point at a file the build does not produce.
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_DIR = "og";
export const SITE_OG_SLUG = "site";

export const ogFileName = (slug) => `${slug}.png`;
export const ogImagePath = (slug) => `/${OG_DIR}/${ogFileName(slug)}`;
export const ogImageUrl = (slug, base) =>
  `${String(base).replace(/\/+$/, "")}${ogImagePath(slug)}`;
export const learningOgSlug = (sectionSlug) => `learning-${sectionSlug}`;
