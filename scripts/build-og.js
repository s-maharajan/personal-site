// Writes the Open Graph images into dist/og/: site.png for the site and
// <slug>.png for every essay. Runs after `vite build`, because the build
// empties dist/ before it copies the public assets over.
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { articles } from "../src/content/writing.js";
import { site } from "../src/content/site.js";
import { OG_DIR, SITE_OG_SLUG, ogFileName } from "../src/lib/og.js";
import { essayCard, renderOgPng, siteCard } from "./og-image.js";

export const buildOgImages = async (outDir) => {
  // Accept a file URL or a plain path, so callers do not have to agree on one.
  const target = outDir instanceof URL
    ? outDir
    : pathToFileURL(outDir.endsWith("/") ? outDir : `${outDir}/`);

  mkdirSync(target, { recursive: true });
  const written = [];

  const write = (slug, png) => {
    writeFileSync(new URL(ogFileName(slug), target), png);
    written.push(ogFileName(slug));
  };

  write(SITE_OG_SLUG, await renderOgPng(siteCard()));

  for (const article of articles) {
    write(
      article.slug,
      await renderOgPng(
        essayCard({
          title: article.title,
          topic: article.topic,
          date: article.date,
          readTime: article.readTime,
          author: site.fullName || site.name,
        }),
      ),
    );
  }

  return written;
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const written = await buildOgImages(new URL(`../dist/${OG_DIR}/`, import.meta.url));
  console.log(`og: wrote ${written.length} images to dist/${OG_DIR}/`);
}
