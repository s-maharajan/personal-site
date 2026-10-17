import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Mail } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import { work } from "../content/work";
import { banterPosts } from "../content/banter";
import { GithubIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "essays" | "work" | "notes"

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lead featured story (Steven Gonsalvez / Anthropic Research style)
  const leadStory = articles[0]; // "Why your RAG is hallucinating: it's the chunker"
  const secondaryStory = work[0]; // "Cutting LLM tail latency 6×"

  // Unified chronological feed of all content
  const unifiedFeed = [
    ...articles.slice(1).map((a) => ({
      type: "essay",
      typeLabel: "Essay",
      slug: `/writing/${a.slug}`,
      title: a.title,
      summary: a.summary,
      date: a.date,
      readTime: a.readTime,
      tag: a.topic,
      dotColor: "bg-accent", // Anthropic Terracotta
    })),
    ...work.slice(1).map((w) => ({
      type: "work",
      typeLabel: "Architecture",
      slug: `/work/${w.slug}`,
      title: w.title,
      summary: w.summary,
      date: w.year,
      readTime: `${w.metric.label}: ${w.metric.value}`,
      tag: w.category,
      dotColor: "bg-[#6A9BCC]", // Anthropic Sky Blue
    })),
    ...banterPosts.map((b) => ({
      type: "note",
      typeLabel: "Note",
      slug: "#",
      title: b.title,
      summary: b.take,
      date: b.date,
      readTime: b.readTime,
      tag: b.tag,
      dotColor: "bg-[#788C5D]", // Anthropic Cactus Green
    })),
  ];

  const filteredFeed = activeFilter === "all"
    ? unifiedFeed
    : unifiedFeed.filter((item) => {
        if (activeFilter === "essays") return item.type === "essay";
        if (activeFilter === "work") return item.type === "work";
        if (activeFilter === "notes") return item.type === "note";
        return true;
      });

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pt-2">
      <title>{`${site.fullName || site.name} · Principal Engineer`}</title>

      {/* 1. Prominent Featured Lead Article (Magazine Anchor) */}
      <section className="border-b-2 border-line/90 pb-10">
        <Link
          to={`/writing/${leadStory.slug}`}
          className="group block cursor-pointer"
        >
          {/* Top metadata badge row */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs mb-3.5">
            <span className="inline-flex items-center rounded px-2 py-0.5 bg-accent text-white font-semibold text-[11px] uppercase tracking-wider">
              Lead Essay
            </span>
            <span className="text-faint">{leadStory.date}</span>
            <span className="text-line">|</span>
            <span className="text-faint">{leadStory.readTime}</span>
            <span className="text-line">|</span>
            <span className="text-accent font-medium">#{leadStory.topic.toLowerCase()}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-normal tracking-tight text-text group-hover:text-accent transition-colors leading-[1.18] mb-3.5">
            {leadStory.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-muted leading-relaxed font-sans max-w-prose">
            {leadStory.summary}
          </p>

          <div className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-accent font-medium group-hover:translate-x-1 transition-transform">
            <span>Read full essay</span>
            <span>→</span>
          </div>
        </Link>
      </section>

      {/* 2. Secondary Spotlight: Flagship Production Architecture */}
      <section className="border-b border-line pb-8">
        <Link
          to={`/work/${secondaryStory.slug}`}
          className="group block cursor-pointer rounded-xl border border-line bg-raised/40 p-6 sm:p-7 transition-colors hover:border-accent/80 hover:bg-raised/70"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded px-2 py-0.5 bg-text text-bg font-semibold text-[10px] uppercase tracking-wider">
                Production Dossier
              </span>
              <span className="text-faint">{secondaryStory.year}</span>
              <span className="text-line">|</span>
              <span className="text-accent font-medium">{secondaryStory.category}</span>
            </div>

            <div className="font-mono text-xs font-semibold text-accent">
              {secondaryStory.metric.label}: {secondaryStory.metric.value}
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text group-hover:text-accent transition-colors leading-snug mb-2">
            {secondaryStory.title}
          </h2>

          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans max-w-prose">
            {secondaryStory.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-line/60 font-mono text-xs text-faint">
            <span>Stack: {secondaryStory.stack.slice(0, 4).join(", ")}</span>
            <span className="text-accent font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect architecture</span>
              <span>→</span>
            </span>
          </div>
        </Link>
      </section>

      {/* 3. Unified Dated Feed (Chronological Editorial Stream) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-line/80 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
              Chronological Index
            </h2>
            <span className="font-mono text-xs text-faint">
              ({filteredFeed.length} entries)
            </span>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1 font-mono text-xs">
            {[
              { id: "all", label: "All" },
              { id: "essays", label: "Essays" },
              { id: "work", label: "Architecture" },
              { id: "notes", label: "Notes" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  activeFilter === tab.id
                    ? "bg-text text-bg font-medium"
                    : "text-muted hover:text-text hover:bg-raised"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Stream */}
        <div className="flex flex-col divide-y divide-line/60">
          {filteredFeed.map((item, idx) => {
            const isClickable = item.slug !== "#";
            const Content = (
              <div className="flex items-start gap-3.5 sm:gap-4">
                {/* Dot indicator */}
                <div className="flex-shrink-0 pt-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${item.dotColor}`} />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[11px] text-faint mb-1">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-wider font-medium text-text">
                        {item.typeLabel}
                      </span>
                      <span>·</span>
                      <span className="text-accent">#{item.tag.toLowerCase()}</span>
                    </div>
                    <span>{item.date} · {item.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl text-text group-hover:text-accent transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed font-sans line-clamp-2 max-w-prose">
                    {item.summary}
                  </p>
                </div>
              </div>
            );

            return isClickable ? (
              <Link
                key={idx}
                to={item.slug}
                className="group py-4 sm:py-5 first:pt-1 transition-colors block cursor-pointer"
              >
                {Content}
              </Link>
            ) : (
              <div key={idx} className="py-4 sm:py-5 first:pt-1">
                {Content}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Direct Line & Advisory Strip */}
      <section className="rounded-xl border border-line bg-raised/50 p-6 sm:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
              Direct Line & Advisory
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              I collaborate with engineering teams on low-latency inference runtimes, distributed consensus, and p99 performance audits.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
              <a
                href={`mailto:${site.email}`}
                className="text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                <span>{site.email}</span>
              </a>
              <span>·</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="hover:text-text transition-colors inline-flex items-center gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Email"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {site.links.github && (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
