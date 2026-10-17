import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Mail } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import { work } from "../content/work";
import { tools } from "../content/tools";
import { banterPosts } from "../content/banter";
import { GithubIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lead featured story (Anthropic Research editorial style)
  const leadStory = articles[0]; // "Why your RAG is hallucinating: it's the chunker"

  // Unified chronological archive
  const archiveItems = [
    ...articles.slice(1).map((a) => ({
      type: "essay",
      typeLabel: "Essay",
      slug: `/writing/${a.slug}`,
      title: a.title,
      summary: a.summary,
      date: a.date,
      readTime: a.readTime,
      tag: a.topic,
    })),
    ...work.map((w) => ({
      type: "work",
      typeLabel: "Architecture",
      slug: `/work/${w.slug}`,
      title: w.title,
      summary: w.summary,
      date: w.year,
      readTime: `${w.metric.label}: ${w.metric.value}`,
      tag: w.category,
    })),
    ...tools.map((t) => ({
      type: "tool",
      typeLabel: "Blueprint",
      slug: "/tools",
      title: `${t.title} — ${t.tagline}`,
      summary: t.summary,
      date: t.status,
      readTime: `${t.language} · ${t.metrics.label}: ${t.metrics.value}`,
      tag: t.category,
    })),
    ...banterPosts.map((b) => ({
      type: "note",
      typeLabel: "Banter",
      slug: `/banter#${b.slug}`,
      title: b.title,
      summary: b.take,
      date: b.date,
      readTime: b.readTime,
      tag: b.tag,
    })),
  ];

  const filteredArchive = activeFilter === "all"
    ? archiveItems
    : archiveItems.filter((item) => {
        if (activeFilter === "essays") return item.type === "essay";
        if (activeFilter === "work") return item.type === "work";
        if (activeFilter === "tools") return item.type === "tool";
        if (activeFilter === "notes") return item.type === "note";
        return true;
      });

  return (
    <div className="flex flex-col gap-12 sm:gap-14 pt-2">
      <title>{`${site.fullName || site.name} · Principal Systems & AI Infrastructure Engineer`}</title>

      {/* 1. Commanding Featured Lead Essay */}
      <section className="border-b border-line/70 pb-10 sm:pb-12">
        <Link
          to={`/writing/${leadStory.slug}`}
          className="group block cursor-pointer"
        >
          {/* Metadata Byline */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint mb-3">
            <span className="text-accent font-semibold uppercase tracking-wider text-[11px]">
              Featured Essay
            </span>
            <span>·</span>
            <span>{leadStory.date}</span>
            <span>·</span>
            <span>{leadStory.readTime}</span>
            <span>·</span>
            <span className="text-accent">#{leadStory.topic.toLowerCase()}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-normal tracking-tight text-text group-hover:text-accent transition-colors leading-[1.18] mb-4">
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

      {/* 2. Pure Editorial Chronological Archive */}
      <section className="flex flex-col gap-6">
        {/* Archive Header & Filter Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-line/70 pb-3 gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-2xl font-normal text-text">
              Archive
            </h2>
            <span className="font-mono text-xs text-faint">
              ({filteredArchive.length} publications)
            </span>
          </div>

          {/* Filter Tabs - Clean, Typographical, No Chunky Buttons */}
          <nav className="flex flex-wrap items-center gap-4 font-mono text-xs" aria-label="Archive filter">
            {[
              { id: "all", label: "All" },
              { id: "essays", label: "Writing" },
              { id: "work", label: "Architecture" },
              { id: "tools", label: "Blueprints" },
              { id: "notes", label: "Banter" },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`transition-colors py-0.5 ${
                    isActive
                      ? "text-accent font-semibold border-b border-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clean Editorial Stream */}
        <div className="flex flex-col divide-y divide-line/50">
          {filteredArchive.map((item, idx) => (
            <Link
              key={idx}
              to={item.slug}
              className="group py-6 first:pt-2 transition-colors block cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-xs text-faint mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text">
                    {item.typeLabel}
                  </span>
                  <span>·</span>
                  <span className="text-accent">#{item.tag.toLowerCase()}</span>
                </div>
                <span>{item.date} · {item.readTime}</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-text group-hover:text-accent transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="mt-1.5 text-sm text-muted leading-relaxed font-sans line-clamp-2 max-w-prose">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Quiet Editorial Direct Line */}
      <section className="border-t border-line/70 pt-8 pb-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div className="max-w-prose">
            <h3 className="font-serif text-lg font-normal text-text">
              Direct Line
            </h3>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Available for architecture reviews, low-latency inference audits, and distributed consensus challenges.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted shrink-0">
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
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            {site.links.github && (
              <>
                <span>·</span>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  <GithubIcon className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
