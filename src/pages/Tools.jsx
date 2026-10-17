import { useState } from "react";
import { Terminal, Copy, Check, ExternalLink } from "lucide-react";
import { site } from "../content/site";
import { tools } from "../content/tools";
import Contact from "../components/Contact";

export default function Tools() {
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(tools.map((t) => t.category))];

  const filteredTools = selectedCategory === "All"
    ? tools
    : tools.filter((t) => t.category === selectedCategory);

  const handleCopy = async (cmd, slug) => {
    await navigator.clipboard.writeText(cmd);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <title>{`Tools & Open Source Blueprints · ${site.fullName || site.name}`}</title>

      {/* Header */}
      <div className="border-b border-line pb-6">
        <span className="label-mono">Open Source & Blueprints</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Systems Tools & Utilities
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Production-grade CLI utilities, reverse proxies, and evaluation harnesses built to solve
          real bottlenecks in distributed systems and LLM inference.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-1.5 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 transition ${
                selectedCategory === cat
                  ? "bg-text text-bg font-semibold"
                  : "bg-surface border border-line text-muted hover:border-text hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.slug}
            className="rounded-2xl border border-line bg-surface p-6 transition-all hover:border-accent hover:shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-line/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-raised font-mono text-xs font-bold text-accent">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-lg font-bold text-text">
                      {tool.title}
                    </h2>
                    <span className="inline-flex items-center rounded-md border border-line bg-raised px-2 py-0.5 font-mono text-[10px] text-accent">
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted font-sans mt-0.5">
                    {tool.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                <span className="rounded-md border border-line bg-raised px-2.5 py-1 text-muted">
                  {tool.language}
                </span>
                <span className="rounded-md border border-line bg-raised px-2.5 py-1 text-accent font-semibold">
                  {tool.metrics.label}: {tool.metrics.value}
                </span>
              </div>
            </div>

            {/* Quick Run Command */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-raised/70 px-4 py-2.5 font-mono text-xs text-text">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-accent select-none">$</span>
                <code className="text-text whitespace-nowrap">{tool.command}</code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(tool.command, tool.slug)}
                className="ml-3 shrink-0 rounded p-1 text-faint hover:text-text transition"
                title="Copy command"
              >
                {copiedSlug === tool.slug ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Summary */}
            <p className="mt-4 text-sm leading-relaxed text-muted font-sans">
              {tool.summary}
            </p>

            {/* Highlights */}
            <div className="mt-4 space-y-1.5 font-sans text-xs text-muted">
              {tool.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Footer tags */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="tag-pill text-accent">{tool.category}</span>
                {tool.stack.map((s) => (
                  <span key={s} className="tag-pill">{s}</span>
                ))}
              </div>

              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
              >
                <span>Inspect GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <Contact />
    </div>
  );
}
