import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Mail,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { site } from "../content/site";
import { work } from "../content/work";
import { articles } from "../content/writing";
import { tools } from "../content/tools";
import { banterPosts } from "../content/banter";
import { principles } from "../content/about";
import SystemVitals from "../components/SystemVitals";
import LLMSimulator from "../components/LLMSimulator";
import { GithubIcon, LinkedinIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [writingTab, setWritingTab] = useState("essays"); // "essays" | "banter"

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = async (cmd, id) => {
    await navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      <title>{`${site.fullName || site.name} · ${site.role}`}</title>

      {/* Hero Section */}
      <section className="pt-2">
        <div className="flex flex-col gap-5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-text font-medium">Principal Engineer</span>
            <span className="text-line">|</span>
            <span>Distributed Systems & AI Infra</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-sans text-3xl font-extrabold tracking-tight text-text sm:text-4xl md:text-5xl leading-[1.12]">
                Architecting distributed platforms & AI infrastructure that hold up at p99.
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-2xl font-sans">
                I'm <strong className="text-text font-semibold">Som Maharajan</strong>. Over the past decade, I've designed and scaled high-throughput systems: low-latency LLM serving runtimes, prefix-aware KV-cache routers, hybrid retrieval engines, and deterministic transactional CDC pipelines.
              </p>
            </div>

            {/* Custom Monogram Portrait Badge */}
            <div className="shrink-0 self-start md:self-auto">
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 border-line bg-gradient-to-br from-surface to-raised p-1 shadow-lg shadow-black/5 dark:shadow-white/5">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-line/60 bg-surface/80 text-center font-mono">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-accent">SM</span>
                  <span className="text-[10px] text-faint uppercase tracking-wider mt-0.5">Studio</span>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[9px] text-emerald-500 font-semibold shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </div>
              </div>
            </div>
          </div>

          {/* Key Production Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            {site.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface p-3 text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-bold text-accent">{s.value}</span>
                <p className="text-[11px] text-faint mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Action Cluster */}
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-primary"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Email" : "Copy Email"}</span>
            </button>

            <a
              href={`mailto:${site.email}`}
              className="btn-ghost"
            >
              <Mail className="h-3.5 w-3.5 text-faint" />
              <span>{site.email}</span>
            </a>

            <Link
              to="/resume"
              className="btn-ghost"
            >
              <FileText className="h-3.5 w-3.5 text-faint" />
              <span>Executive Resume</span>
            </Link>

            {site.links.github && (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <GithubIcon className="h-3.5 w-3.5 text-faint" />
                <span>GitHub</span>
              </a>
            )}

            {site.links.linkedin && (
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <LinkedinIcon className="h-3.5 w-3.5 text-faint" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Live System Vitals Panel */}
        <div className="mt-8">
          <SystemVitals />
        </div>
      </section>

      {/* Featured Architecture Dossiers */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <span className="label-mono">Flagship Engineering Work</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Architecture & Production Dossiers
            </h2>
          </div>
          <Link
            to="/work"
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>All {work.length} case studies</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {work.map((w, idx) => (
            <Link
              key={w.slug}
              to={`/work/${w.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-bold text-accent">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-accent transition-colors">
                    {w.title}
                  </h3>
                </div>
                <div className="font-mono text-xs font-bold text-accent shrink-0 sm:text-right">
                  {w.metric.label}: <span>{w.metric.value}</span>
                </div>
              </div>

              <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl font-sans">
                {w.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="tag-pill text-accent">{w.category}</span>
                  {w.stack.slice(0, 5).map((tech) => (
                    <span key={tech} className="tag-pill">{tech}</span>
                  ))}
                </div>

                <span className="font-mono text-xs text-accent inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Architecture</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Systems Studio */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="label-mono">Interactive Systems Studio</span>
            <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent font-semibold">Live Simulator</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
            P99 Latency & KV-Cache Sizing Workbench
          </h2>
          <p className="mt-1 text-sm text-muted">
            Experiment with continuous chunked prefill vs static batching, or calculate GPU memory headroom and maximum concurrency.
          </p>
        </div>
        <LLMSimulator />
      </section>

      {/* Tools & Open Source Blueprints Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <span className="label-mono">Open Source Blueprints</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Production Tools & Utilities
            </h2>
          </div>
          <Link
            to="/tools"
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>All {tools.length} tools</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.slice(0, 4).map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-accent" />
                    <span className="font-bold text-text">{tool.title}</span>
                  </div>
                  <span className="text-accent font-semibold">{tool.metrics.value}</span>
                </div>

                <p className="text-xs text-muted leading-relaxed font-sans line-clamp-2">
                  {tool.tagline}
                </p>

                {/* Copyable Quick Command */}
                <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-raised/70 px-3 py-1.5 font-mono text-[11px] text-text">
                  <div className="truncate mr-2">
                    <span className="text-accent mr-1">$</span>
                    <code>{tool.command}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(tool.command, tool.slug)}
                    className="shrink-0 text-faint hover:text-text"
                    title="Copy command"
                  >
                    {copiedCmd === tool.slug ? (
                      <Check className="h-3 w-3 text-accent" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-xs text-faint">
                <span className="tag-pill text-accent">{tool.language}</span>
                <Link
                  to="/tools"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  <span>Inspect Blueprint</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Writing & Byte-Sized Banter Stream */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-line pb-3 gap-3">
          <div>
            <span className="label-mono">Writing & Field Notes</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Technical Essays & Systems Truths
            </h2>
          </div>

          {/* Toggle between Long Reads and Banter */}
          <div className="inline-flex rounded-lg border border-line bg-surface p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setWritingTab("essays")}
              className={`rounded-md px-3 py-1 transition ${
                writingTab === "essays"
                  ? "bg-text text-bg font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Field Notes ({articles.length})
            </button>
            <button
              type="button"
              onClick={() => setWritingTab("banter")}
              className={`rounded-md px-3 py-1 transition ${
                writingTab === "banter"
                  ? "bg-text text-bg font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Byte-Sized Banter ({banterPosts.length})
            </button>
          </div>
        </div>

        {writingTab === "essays" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                to={`/writing/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-faint mb-2">
                    <span className="text-accent font-semibold">#{article.topic.toLowerCase()}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3 font-sans">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-[11px] text-faint">
                  <span>{article.date}</span>
                  <span className="text-accent group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Read Note <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-line/60 rounded-2xl border border-line bg-surface">
            {banterPosts.slice(0, 4).map((post) => (
              <article key={post.slug} className="p-5 transition-colors hover:bg-raised/30">
                <div className="flex items-center justify-between font-mono text-xs text-faint mb-1.5">
                  <span className="text-accent font-semibold">#{post.tag.toLowerCase()}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-text mb-1.5">
                  {post.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans line-clamp-3">
                  {post.take}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Link
            to={writingTab === "essays" ? "/writing" : "/banter"}
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>Browse all {writingTab === "essays" ? "field notes" : "byte-sized banter"}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Engineering Philosophy & Principles */}
      <section className="flex flex-col gap-6">
        <div className="border-b border-line pb-3">
          <span className="label-mono">Methodology & Ethos</span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
            Architectural Principles
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map(([title, detail], idx) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">0{idx + 1}.</span>
                <h3 className="text-sm font-bold text-text">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted font-sans">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Advisory & Reviews */}
      <section className="rounded-2xl border border-accent/40 bg-gradient-to-br from-surface to-raised p-6 sm:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-xl">
            <span className="label-mono text-accent">Advisory & High-concurrency Audits</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-text">
              {site.advisory.title}
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {site.advisory.description}
            </p>
            <p className="mt-3 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              ● {site.advisory.availability}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`mailto:${site.email}?subject=Architecture Review / Advisory Inquiry`}
              className="btn-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Directly</span>
            </a>
            <Link to="/about" className="btn-ghost">
              <span>About Som</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
