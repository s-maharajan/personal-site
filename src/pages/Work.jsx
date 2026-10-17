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
    <>
      <title>{`Case Studies & Work · ${site.name}`}</title>
      <p className="label">Work</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Systems Architecture Case Studies
      </h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
        Hard engineering challenges that didn't yield to the obvious fix. Each case study details
        the root cause investigation, system topology, trade-offs accepted, and production metrics.
      </p>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === "All" ? work.length : work.filter((w) => w.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "bg-accent font-semibold text-bg"
                  : "border border-line bg-surface text-muted hover:border-faint hover:text-text"
              }`}
            >
              {cat} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <WorkGrid items={filteredWork} featureFirst={filteredWork.length % 2 === 1} />
      </div>

      <Contact />
    </>
  );
}
