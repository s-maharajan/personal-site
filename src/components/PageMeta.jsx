import { useLocation } from "react-router-dom";
import { site } from "../content/site";
import { findArticle } from "../content/writing";
import { findSection } from "../lib/learning";
import { OG_HEIGHT, OG_WIDTH, SITE_OG_SLUG, learningOgSlug, ogImageUrl } from "../lib/og";

// Title, description and social card for a path. Unknown paths get the 404 copy.
// eslint-disable-next-line react-refresh/only-export-components
export function pageMeta(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const author = site.fullName || site.name;
  const article = path.startsWith("/writing/") ? findArticle(path.slice(9)) : null;
  const section = path.startsWith("/learning/") ? findSection(path.slice(10)) : null;
  const base = { path, ogSlug: SITE_OG_SLUG, ogAlt: `${author} — ${site.role}`, description: site.tagline };

  if (article) {
    return {
      ...base,
      title: `${article.title} · ${author}`,
      description: article.summary,
      ogSlug: article.slug,
      ogAlt: `${article.title} — an essay on ${article.topic} by ${author}`,
    };
  }
  if (section) {
    return {
      ...base,
      title: `${section.title}: ${section.kicker} · ${author}`,
      description: section.description,
      ogSlug: learningOgSlug(section.slug),
      ogAlt: `${section.title} — learning notes by ${author}`,
    };
  }
  const fixed = {
    "/": { title: `${author} · ${site.role}` },
    "/about": { title: `About · ${author}`, description: `About ${author}. ${site.role}. ${site.tagline}` },
    "/writing": { title: `Writing · ${author}`, description: `Essays by ${author} on distributed systems and AI infrastructure.` },
    "/learning": {
      title: `Learning log · ${author}`,
      description: `A curated, section-by-section log of what ${author} learned about agents, AI engineering and developer tooling.`,
    },
  }[path];
  return fixed ? { ...base, ...fixed } : { ...base, title: `Page not found · ${author}`, notFound: true };
}

export default function PageMeta() {
  const { pathname } = useLocation();
  const meta = pageMeta(pathname);
  const url = `${site.url.replace(/\/$/, "")}${meta.path}`;
  const ogImage = ogImageUrl(meta.ogSlug, site.url);

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(OG_WIDTH)} />
      <meta property="og:image:height" content={String(OG_HEIGHT)} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={meta.ogAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={meta.ogAlt} />
      {!meta.notFound && <link rel="canonical" href={url} />}
    </>
  );
}
