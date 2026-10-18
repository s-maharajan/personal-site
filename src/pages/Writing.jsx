import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
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
      <title>{`Writing & Field Notes · ${site.fullName || site.name}`}</title>

      <div className="border-b border-line/70 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text">
          Writing & Field Notes
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted font-sans">
          Deep dives into production systems, model serving at scale, retrieval architectures,
          and engineering trade-offs.
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTopic(t)}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  selectedTopic === t
                    ? "bg-accent text-white font-medium"
                    : "border border-line bg-surface text-muted hover:border-text hover:text-text"
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
              placeholder="Search essays..."
              className="w-full rounded-md border border-line bg-surface py-1.5 pl-8 pr-3 font-sans text-xs text-text placeholder-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Articles Feed */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface p-12 text-center text-sm text-muted">
          No essays found matching your filter criteria.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line/60">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/writing/${article.slug}`}
              className="group py-5 transition-colors block"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <div className="flex items-baseline gap-2.5">
                  <h2 className="font-serif text-lg sm:text-xl text-text group-hover:text-accent transition-colors leading-snug">
                    {article.title}
                  </h2>
                </div>
                <div className="font-mono text-xs text-faint shrink-0 sm:text-right">
                  <span className="text-accent font-medium">#{article.topic.toLowerCase()}</span>
                  <span className="mx-1.5">·</span>
                  <span>{article.date}</span>
                  <span className="mx-1.5">·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed font-sans max-w-prose">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Contact />
    </div>
  );
}
