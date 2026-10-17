import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import Contact from "../components/Contact";

export default function Writing() {
  return (
    <div className="flex flex-col gap-10">
      <title>{`Field Notes & Technical Writing · ${site.fullName || site.name}`}</title>

      <div className="border-b border-line pb-6">
        <span className="label-mono">Technical Writing</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Engineering Field Notes
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Deep dives into real production systems, failure modes, retrieval optimization,
          and model serving at scale.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/writing/${article.slug}`}
            className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-6 transition-all hover:border-accent hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[11px] text-faint mb-3">
                <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="text-lg font-bold text-text group-hover:text-accent transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-muted font-sans line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-xs text-faint">
              <span>{article.date}</span>
              <span className="text-accent group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                <span>Read Note</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Contact />
    </div>
  );
}
