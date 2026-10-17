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
    <article className="max-w-2xl mx-auto flex flex-col gap-8">
      <title>{`${article.title} · ${site.fullName || site.name}`}</title>

      <div className="flex items-center justify-between pb-4 border-b border-line">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>Back to Field Notes</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition hover:border-text hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header>
        <div className="flex items-center gap-2 font-mono text-xs text-faint mb-2">
          <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
          <span>·</span>
          <time>{article.date}</time>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-text">
          {article.title}
        </h1>

        <p className="mt-4 border-l-2 border-accent pl-4 text-sm sm:text-base italic leading-relaxed text-muted font-sans">
          {article.excerpt}
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="flex flex-col gap-8 font-sans">
        {article.content.map((sec, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight text-text">
              {sec.heading}
            </h2>
            <div className="text-sm sm:text-base leading-relaxed text-muted space-y-4">
              {sec.body.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/```python|```/g, "").trim();
                  return (
                    <pre
                      key={pIdx}
                      className="my-3 overflow-x-auto rounded-lg border border-line bg-surface p-4 font-mono text-xs text-text leading-relaxed"
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
      <div className="mt-8 rounded-xl border border-line bg-surface p-5 flex items-center justify-between gap-4 font-sans">
        <div>
          <p className="text-sm font-semibold text-text">
            Authored by {site.fullName || site.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {site.role} · Focus on distributed state, model serving, and latency reduction.
          </p>
        </div>
        <Link to="/about" className="font-mono text-xs text-accent hover:underline shrink-0">
          About Som →
        </Link>
      </div>

      {/* Next Article link */}
      <Link
        to={`/writing/${nextArticle.slug}`}
        className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
      >
        <div>
          <span className="label-mono">Next Field Note</span>
          <p className="mt-1 text-base font-semibold text-text group-hover:text-accent transition-colors">
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
