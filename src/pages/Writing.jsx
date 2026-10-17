import { Link } from "react-router-dom";
import { site } from "../content/site";
import { articles } from "../content/writing";
import Contact from "../components/Contact";

export default function Writing() {
  return (
    <>
      <title>{`Writing & Architecture Notes · ${site.fullName || site.name}`}</title>
      <div className="pb-8 border-b border-line">
        <p className="label">Essays & Field Notes</p>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl">
          Architecture Notes
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Deep dives into production systems, failure modes, retrieval optimization,
          and model serving at scale. No marketing fluff—just architecture decisions, trade-offs, and benchmarks.
        </p>
      </div>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {articles.map((article) => (
          <article key={article.slug} className="py-6 transition-colors hover:bg-raised/40 -mx-3 px-3 rounded">
            <Link to={`/writing/${article.slug}`} className="group block">
              <div className="flex items-center gap-2 font-mono text-xs text-faint mb-2">
                <time>{article.date}</time>
                <span>·</span>
                <span>{article.readTime}</span>
                <span>·</span>
                <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
              </div>

              <h2 className="font-serif text-2xl font-medium text-text group-hover:text-accent transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="mt-2 text-sm text-muted leading-relaxed font-sans max-w-2xl">
                {article.summary}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-mono font-medium text-accent">
                <span>Read essay</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <Contact />
    </>
  );
}
