import { useLocation } from "react-router-dom";
import { site } from "../content/site";
import { findArticle } from "../content/writing";

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

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </>
  );
}
