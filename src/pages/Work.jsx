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
      <div className="border-b border-line pb-6">
        <span className="label-mono">Systems Architecture</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Production Case Studies
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted font-sans">
          In-depth architectural breakdowns of production challenges: p99 tail latency collapses,
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
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition ${
                  isSelected
                    ? "bg-text font-semibold text-bg shadow-sm"
                    : "border border-line bg-surface text-muted hover:border-text hover:text-text"
                }`}
              >
                {cat} <span className="opacity-60 font-normal">({count})</span>
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
