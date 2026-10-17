import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Clock } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import Contact from "../components/Contact";

export default function Writing() {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  const topics = ["All", ...new Set(articles.map((a) => a.topic))];

  const filteredArticles = articles.filter((a) => {
    const matchesTopic = selectedTopic === "All" || a.topic === selectedTopic;
    const q = query.toLowerCase();
    const matchesQuery =
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.topic.toLowerCase().includes(q);
    return matchesTopic && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-10">
      <title>{`Field Notes & Technical Writing · ${site.fullName || site.name}`}</title>

      <div className="border-b border-line pb-6">
        <span className="label-mono">Technical Writing & Research</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Engineering Field Notes
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Deep dives into real production systems, failure modes, retrieval optimization,
          and model serving at scale.
        </p>

        {/* Search & Topic Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTopic(t)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  selectedTopic === t
                    ? "bg-text text-bg font-semibold"
                    : "bg-surface border border-line text-muted hover:border-text hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-faint" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter notes..."
              className="w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-3 font-sans text-xs text-text placeholder-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface p-12 text-center text-sm text-muted">
          No articles found matching your filter criteria.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/writing/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all hover:border-accent hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-faint mb-3">
                  <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-text group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h2>

                <p className="mt-2.5 text-xs leading-relaxed text-muted font-sans line-clamp-3">
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
      )}

      <Contact />
    </div>
  );
}
