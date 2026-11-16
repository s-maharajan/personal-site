import { useState } from "react";
import { sortedArticles } from "../content/writing";
import PostList from "../components/PostList";

const topics = ["All", ...new Set(sortedArticles.map((a) => a.topic))];

export default function Writing() {
  const [topic, setTopic] = useState("All");
  const posts = topic === "All" ? sortedArticles : sortedArticles.filter((a) => a.topic === topic);

  return (
    <div className="flex flex-col gap-8 pt-6">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Writing</p>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text">Essays</h1>
        <p className="max-w-prose text-base leading-relaxed text-muted">
          Longer pieces on integration, cloud and AI, newest first.
        </p>
      </header>

      <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2 font-mono text-xs">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            aria-pressed={topic === t}
            className={`rounded-full border px-3 py-1 transition-colors ${
              topic === t ? "border-accent bg-accent text-bg" : "border-line text-muted hover:border-accent hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <PostList posts={posts} />
    </div>
  );
}
