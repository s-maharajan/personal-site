import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Check } from "lucide-react";
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
      // User cancelled or clipboard denied
    }
  };

  return (
    <article className="max-w-3xl">
      <title>{`${article.title} · ${site.name}`}</title>

      <div className="flex items-center justify-between">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          All articles & notes
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted transition hover:border-faint hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-xs text-accent">
            {article.topic}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-faint">
            <Calendar className="h-3.5 w-3.5" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-faint">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.readTime}</span>
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 border-l-2 border-accent pl-4 text-lg italic leading-relaxed text-muted">
          {article.excerpt}
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="mt-12 flex flex-col gap-10">
        {article.content.map((sec, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-text">
              {sec.heading}
            </h2>
            <div className="prose prose-invert max-w-none text-base leading-relaxed text-muted">
              {sec.body.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/```python|```/g, "").trim();
                  return (
                    <pre
                      key={pIdx}
                      className="my-4 overflow-x-auto rounded-xl border border-line bg-surface p-4 font-mono text-xs text-text/90"
                    >
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                if (para.startsWith("1.") || para.startsWith("-")) {
                  return (
                    <div key={pIdx} className="my-2 space-y-1.5 pl-4">
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
      <div className="card mt-16 flex items-center justify-between gap-6 p-6 sm:p-8">
        <div>
          <span className="label">Written by {site.fullName || site.name}</span>
          <p className="mt-1 text-sm text-muted">
            {site.role} specializing in distributed state, high-throughput model serving, and p99 performance.
          </p>
        </div>
        <Link to="/about" className="btn-ghost shrink-0 text-xs">
          About Som
        </Link>
      </div>

      {/* Next Article link */}
      <Link
        to={`/writing/${nextArticle.slug}`}
        className="card group mt-8 flex items-center justify-between gap-6 p-6 hover:border-faint sm:p-8"
      >
        <div>
          <p className="label">Next article</p>
          <p className="mt-2 text-lg font-medium text-text sm:text-xl">{nextArticle.title}</p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
