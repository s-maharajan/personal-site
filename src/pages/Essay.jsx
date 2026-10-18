import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Share2, Check } from "lucide-react";
import { useState } from "react";
import { site } from "../content/site";
import { articles, findArticle } from "../content/writing";
import NotFound from "./NotFound";

export default function Essay() {
  const { slug } = useParams();
  const article = findArticle(slug);
  const [copied, setCopied] = useState(false);

  if (!article) return <NotFound />;

  const currentIndex = articles.indexOf(article);
  const nextArticle = articles[(currentIndex + 1) % articles.length];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <article className="max-w-prose mx-auto flex flex-col gap-8">
      <title>{`${article.title} · ${site.fullName || site.name}`}</title>

      <div className="flex items-center justify-between pb-4 border-b border-line/70">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1.5 font-sans text-xs text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>All writing</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-faint">
          <span className="text-accent font-medium">#{article.topic.toLowerCase()}</span>
          <span>·</span>
          <time>{article.date}</time>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] font-normal leading-[1.2] tracking-tight text-text">
          {article.title}
        </h1>

        <p className="mt-2 border-l-2 border-accent/70 pl-4 font-serif italic text-base sm:text-lg leading-relaxed text-muted">
          {article.excerpt}
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="flex flex-col gap-8 font-sans">
        {article.content.map((sec, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-text">
              {sec.heading}
            </h2>
            <div className="text-sm sm:text-base leading-relaxed text-muted space-y-4">
              {sec.body.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/^```[a-zA-Z0-9_-]*\n?|```$/g, "").trim();
                  return (
                    <pre
                      key={pIdx}
                      className="my-3 overflow-x-auto rounded-lg border border-line bg-raised/70 p-4 font-mono text-xs text-text leading-relaxed"
                    >
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                if (para.startsWith("1.") || para.startsWith("-")) {
                  return (
                    <div key={pIdx} className="my-2 space-y-1.5 pl-4 border-l border-line text-xs sm:text-sm">
                      {para.split("\n").map((item, itemIdx) => (
                        <p key={itemIdx} className="text-muted">
                          {item}
                        </p>
                      ))}
                    </div>
                  );
                }
                return <p key={pIdx}>{para}</p>;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Author note */}
      <div className="mt-8 rounded-xl border border-line/80 bg-raised/40 p-5 flex items-center justify-between gap-4 font-sans">
        <div>
          <p className="text-sm font-medium text-text">
            Written by {site.fullName || site.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {site.role} · Focus on distributed systems and AI platforms.
          </p>
        </div>
        <Link to="/about" className="text-xs text-accent hover:underline shrink-0 font-medium">
          About the Author →
        </Link>
      </div>

      {/* Next Article link */}
      <Link
        to={`/writing/${nextArticle.slug}`}
        className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
      >
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Next Essay</span>
          <p className="mt-1 font-serif text-base sm:text-lg text-text group-hover:text-accent transition-colors">
            {nextArticle.title}
          </p>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
