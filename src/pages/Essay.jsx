import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Share2, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "../content/site";
import { sortedArticles, findArticle, isoMonth } from "../content/writing";
import NotFound from "./NotFound";
import Prose from "../components/Prose";
import { sectionIds, readingProgress } from "../lib/essay";

export default function Essay() {
  const { slug } = useParams();
  const article = findArticle(slug);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!article) return;
    const update = () => {
      const rect = contentRef.current.getBoundingClientRect();
      progressRef.current.style.transform = `scaleX(${readingProgress(rect.top, rect.height, window.innerHeight)})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(contentRef.current);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [article]);

  if (!article) return <NotFound />;
  const ids = sectionIds(article.content);

  // Continue to the next-oldest essay, wrapping back to the newest.
  const currentIndex = sortedArticles.indexOf(article);
  const nextArticle = sortedArticles[(currentIndex + 1) % sortedArticles.length];

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

      <div className="reading-progress print-hidden" aria-hidden="true">
        <div ref={progressRef} className="reading-progress-fill" />
      </div>

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
          <time dateTime={isoMonth(article.date)}>{article.date}</time>
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

      {article.content.length >= 3 && (
        <nav aria-label="Contents" className="rounded-lg border border-line/70 px-4 py-3 font-sans text-sm">
          <p className="mb-2 font-mono text-xs text-faint">Contents</p>
          <ol className="space-y-1">
            {article.content.map((sec, idx) => (
              <li key={ids[idx]}>
                <a href={`#${ids[idx]}`} className="text-muted hover:text-accent hover:underline">{sec.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Main Content Sections */}
      <div ref={contentRef} className="flex flex-col gap-8 font-sans">
        {article.content.map((sec, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 id={ids[idx]} className="essay-heading font-serif text-xl sm:text-2xl font-normal tracking-tight text-text">
              {sec.heading}{" "}
              <a href={`#${ids[idx]}`} className="heading-anchor text-accent" aria-label={`Link to ${sec.heading}`}>#</a>
            </h2>
            <div className="text-sm sm:text-base leading-relaxed text-muted space-y-4">
              <Prose body={sec.body} />
            </div>
          </section>
        ))}
      </div>

      {/* Author note */}
      <div className="mt-8 rounded-xl border border-line/80 bg-raised/40 p-5 flex items-center justify-between gap-4 font-sans">
        <div>
          <p className="text-sm font-medium text-text">
            Written by {site.handle}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {site.role} · Focus on integration, AI and cloud.
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
