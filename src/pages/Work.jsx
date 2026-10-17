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
      <title>{`Case Studies & Work · ${site.fullName || site.name}`}</title>
      <div className="pb-8 border-b border-line">
        <p className="label">Architecture & Production</p>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl">
          Systems Case Studies
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Engineering investigations and system architectures that resolved deep tail-latency spikes,
          distributed data anomalies, and scaling bottlenecks in production.
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
                className={`rounded px-3 py-1 font-mono text-xs transition ${
                  isSelected
                    ? "bg-text font-semibold text-bg"
                    : "border border-line bg-surface text-muted hover:border-text hover:text-text"
                }`}
              >
                {cat} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <WorkGrid items={filteredWork} />
      </div>

      <Contact />
    </>
  );
}
