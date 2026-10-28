import { useLocation } from "react-router-dom";
import { site } from "../content/site";
import { findArticle } from "../content/writing";
import { OG_HEIGHT, OG_WIDTH, SITE_OG_SLUG, ogImageUrl } from "../lib/og";

export default function PageMeta() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const author = site.fullName || site.name;
  const article = path.startsWith("/writing/") ? findArticle(path.slice(9)) : null;
  const title = article ? `${article.title} · ${author}`
    : path === "/about" ? `About · ${author}`
      : path === "/" ? `${author} · ${site.role}` : `Page not found · ${author}`;
  const description = article ? article.summary
    : path === "/about" ? `About ${author}. ${site.role}. ${site.tagline}` : site.tagline;
  const url = `${site.url.replace(/\/$/, "")}${path}`;
  // Every route points at a card that the build renders into dist/og/: essays
  // get their own, the rest share the site card.
  const ogImage = ogImageUrl(article ? article.slug : SITE_OG_SLUG, site.url);
  const ogAlt = article
    ? `${article.title} — an essay on ${article.topic} by ${author}`
    : `${author} — ${site.role}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(OG_WIDTH)} />
      <meta property="og:image:height" content={String(OG_HEIGHT)} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={ogAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogAlt} />
      <link rel="canonical" href={url} />
    </>
  );
}
