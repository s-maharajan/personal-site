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
      // User cancelled or clipboard denied
    }
  };

  return (
    <article className="max-w-2xl mx-auto">
      <title>{`${article.title} · ${site.fullName || site.name}`}</title>

      <div className="flex items-center justify-between pb-6 border-b border-line">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Back to all essays
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-2.5 py-1 text-xs font-mono text-muted transition hover:border-text hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header className="mt-8">
        <div className="flex items-center gap-2 font-mono text-xs text-faint mb-3">
          <time>{article.date}</time>
          <span>·</span>
          <span>{article.readTime}</span>
          <span>·</span>
          <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium leading-tight tracking-tight text-text">
          {article.title}
        </h1>

        <p className="mt-4 border-l-2 border-accent pl-4 text-base italic leading-relaxed text-muted">
          {article.excerpt}
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="mt-10 flex flex-col gap-8 font-sans">
        {article.content.map((sec, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-text">
              {sec.heading}
            </h2>
            <div className="text-base leading-relaxed text-muted space-y-4">
              {sec.body.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/```python|```/g, "").trim();
                  return (
                    <pre
                      key={pIdx}
                      className="my-3 overflow-x-auto rounded border border-line bg-surface p-4 font-mono text-xs text-text leading-relaxed"
                    >
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                if (para.startsWith("1.") || para.startsWith("-")) {
                  return (
                    <div key={pIdx} className="my-2 space-y-1.5 pl-4 border-l border-line">
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
      <div className="mt-14 border-t border-b border-line py-6 flex items-center justify-between gap-6">
        <div>
          <p className="font-serif text-base font-medium text-text">
            Written by {site.fullName || site.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {site.role} specializing in distributed state and sub-second model serving.
          </p>
        </div>
        <Link to="/about" className="text-xs font-mono text-accent hover:underline shrink-0">
          About Som →
        </Link>
      </div>

      {/* Next Article link */}
      <Link
        to={`/writing/${nextArticle.slug}`}
        className="group mt-6 flex items-center justify-between gap-6 p-4 rounded hover:bg-raised/40 transition-colors"
      >
        <div>
          <p className="label">Next essay</p>
          <p className="mt-1 font-serif text-lg font-medium text-text group-hover:text-accent transition-colors">
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
