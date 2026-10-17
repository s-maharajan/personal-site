import { Link } from "react-router-dom";
import { FileText, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { site } from "../content/site";
import { work } from "../content/work";
import { articles } from "../content/writing";
import { principles } from "../content/about";
import LLMSimulator from "../components/LLMSimulator";
import { GithubIcon, LinkedinIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const featuredArticle = articles[0];

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <title>{`${site.fullName || site.name} · ${site.role}`}</title>

      {/* Intro Header (Inspired by Charly Webster & Steven Gonsalvez) */}
      <section className="pb-8 border-b border-line">
        <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
          {site.role}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl leading-tight">
          Systems that hold up at p99.
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-2xl font-sans">
          I build distributed platforms and production AI infrastructure. Over the past decade, that has
          meant designing high-throughput model serving runtimes, prefix-cache reuse, hybrid retrieval engines,
          and deterministic event pipelines—and making sure they stay dependable when traffic spikes.
        </p>

        {/* Quick Social & Contact Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 font-mono text-text hover:border-text transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5 text-faint" />}
            <span>{copied ? "Email Copied!" : site.email}</span>
          </button>

          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 text-muted hover:text-text hover:border-text transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-faint" />
            <span>Send Email</span>
          </a>

          <Link
            to="/resume"
            className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 text-muted hover:text-text hover:border-text transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-faint" />
            <span>Resume</span>
          </Link>

          {site.links.linkedin && (
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 text-muted hover:text-text hover:border-text transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5 text-faint" />
              <span>LinkedIn</span>
            </a>
          )}

          {site.links.github && (
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1.5 text-muted hover:text-text hover:border-text transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5 text-faint" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </section>

      {/* Featured Deep Dive / Long Read (Steven Gonsalvez Featured Story Style) */}
      {featuredArticle && (
        <section className="py-8 border-b-2 border-text">
          <Link to={`/writing/${featuredArticle.slug}`} className="group block cursor-pointer">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 bg-text text-bg font-semibold rounded-sm">
                Long read
              </span>
              <span className="font-mono text-xs text-faint">{featuredArticle.date}</span>
              <span className="text-line">|</span>
              <span className="font-mono text-xs text-faint">{featuredArticle.readTime}</span>
              <span className="text-line">|</span>
              <span className="font-mono text-xs text-accent">#{featuredArticle.topic.toLowerCase()}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-text group-hover:text-accent transition-colors leading-snug">
              {featuredArticle.title}
            </h2>

            <p className="mt-3 text-base text-muted leading-relaxed max-w-2xl">
              {featuredArticle.summary}
            </p>

            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent group-hover:underline">
              <span>Read complete architecture write-up</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        </section>
      )}

      {/* Selected Systems Work (Clean Editorial Row List) */}
      <section className="py-10 border-b border-line">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="label">Selected Architecture</p>
            <h2 className="mt-1 font-serif text-2xl font-medium text-text">
              Production Case Studies
            </h2>
          </div>
          <Link to="/work" className="text-xs font-mono text-muted hover:text-accent underline underline-offset-2">
            All {work.length} studies →
          </Link>
        </div>

        <div className="divide-y divide-line">
          {work.slice(0, 4).map((w) => (
            <Link
              key={w.slug}
              to={`/work/${w.slug}`}
              className="group block py-5 transition-colors hover:bg-raised/50 -mx-3 px-3 rounded"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1 sm:mt-0" />
                  <h3 className="font-serif text-lg font-medium text-text group-hover:text-accent transition-colors">
                    {w.title}
                  </h3>
                </div>
                <div className="font-mono text-xs font-semibold text-accent shrink-0 sm:text-right">
                  {w.metric.label}: {w.metric.value}
                </div>
              </div>

              <p className="mt-1.5 text-sm text-muted leading-relaxed pl-4 max-w-2xl">
                {w.summary}
              </p>

              <div className="mt-2 pl-4 flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint">
                <span>{w.year}</span>
                <span>·</span>
                <span>{w.category}</span>
                <span>·</span>
                <span className="text-muted">{w.stack.slice(0, 4).join(", ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Systems Lab (Linear Precision Instrument) */}
      <section className="py-10 border-b border-line">
        <div className="mb-6">
          <p className="label">Interactive Systems Lab</p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-text">
            Simulate P99 Tail Latency & Memory Contention
          </h2>
          <p className="mt-2 text-sm text-muted">
            Test how prompt sizes, concurrency, and prefix KV-cache reuse impact tail latency and GPU cost.
          </p>
        </div>
        <LLMSimulator />
      </section>

      {/* Latest Technical Writing (Charly Webster Post List Style) */}
      <section className="py-10 border-b border-line">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="label">Writing</p>
            <h2 className="mt-1 font-serif text-2xl font-medium text-text">
              Architecture Notes & Essays
            </h2>
          </div>
          <Link to="/writing" className="text-xs font-mono text-muted hover:text-accent underline underline-offset-2">
            All essays →
          </Link>
        </div>

        <ol className="divide-y divide-line">
          {articles.map((article) => (
            <li key={article.slug} className="py-5">
              <article>
                <div className="flex items-center gap-2 font-mono text-xs text-faint mb-1.5">
                  <time>{article.date}</time>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-text">
                  <Link
                    to={`/writing/${article.slug}`}
                    className="hover:text-accent transition-colors hover:underline underline-offset-2"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="font-mono text-[11px] text-accent">
                    #{article.topic.toLowerCase()}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    #systems
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    #production
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* A Bit About Me & Engineering Philosophy (Charly Webster Style) */}
      <section className="py-10">
        <p className="label">Philosophy</p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-text">
          A Bit About How I Work
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted max-w-2xl font-sans">
          <p>
            I care about building dependable software and healthy platform foundations: clear architectural direction,
            profiling before arguing, keeping the hot path boring, and designing systems that survive the requirement nobody has written yet.
          </p>
          <p>
            This site is where I share field notes from production: what worked, what failed under load, and the trade-offs worth remembering.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {principles.map(([title, detail]) => (
            <div key={title} className="border-l-2 border-line pl-4 py-1">
              <h3 className="font-serif text-base font-medium text-text">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
