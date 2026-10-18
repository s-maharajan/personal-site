import { useState } from "react";
import { site } from "../content/site";
import { work } from "../content/work";
import WorkGrid from "../components/WorkGrid";
import Contact from "../components/Contact";

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "AI & LLM Serving", "Distributed Systems", "Search & Retrieval", "Cloud & Cost"];

  const filteredWork = selectedCategory === "All"
    ? work
    : work.filter((w) => w.category === selectedCategory);

  return (
    <div className="flex flex-col gap-10">
      <title>{`Case Studies & Work · ${site.fullName || site.name}`}</title>
      <div className="border-b border-line/70 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text">
          Selected Architecture & Systems
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted font-sans">
          Deep architectural breakdowns of production challenges: p99 tail latency collapses,
          deterministic streaming pipelines, monolith migrations, and infrastructure efficiency.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All" ? work.length : work.filter((w) => w.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  isSelected
                    ? "bg-accent text-white font-medium"
                    : "border border-line bg-surface text-muted hover:border-text hover:text-text"
                }`}
              >
                {cat} <span className="opacity-70 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <WorkGrid items={filteredWork} />

      <Contact />
    </div>
  );
}
