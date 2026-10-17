import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import Contact from "../components/Contact";

export default function Writing() {
  return (
    <>
      <title>{`Writing & Notes · ${site.name}`}</title>
      <div className="max-w-3xl">
        <p className="label">Engineering Notes</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Writing & Architecture Notes
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Deep dives into real production systems, failure modes, retrieval optimization,
          and model serving at scale. No marketing fluff—just architecture decisions, trade-offs, and benchmarks.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-6">
        {articles.map((article) => (
          <article key={article.slug} className="card group p-6 transition-all hover:border-faint sm:p-8">
            <Link to={`/writing/${article.slug}`} className="block">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
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
                <ArrowUpRight
                  className="h-5 w-5 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-text group-hover:text-accent transition-colors sm:text-2xl">
                {article.title}
              </h2>

              <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
                {article.summary}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                <span>Read technical write-up</span>
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
