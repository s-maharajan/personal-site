import { Link } from "react-router-dom";
import { ArrowRight, FileText, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { site } from "../content/site";
import { work } from "../content/work";
import { articles } from "../content/writing";
import { principles } from "../content/about";
import SystemVitals from "../components/SystemVitals";
import LLMSimulator from "../components/LLMSimulator";
import { GithubIcon, LinkedinIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <title>{`${site.fullName || site.name} · ${site.role}`}</title>

      {/* Hero Section */}
      <section className="pt-2">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{site.role}</span>
          </div>

          <h1 className="font-sans text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl leading-[1.15]">
            Architecting distributed platforms & AI infrastructure that hold up at p99.
          </h1>

          <p className="mt-1 text-base sm:text-lg leading-relaxed text-muted max-w-2xl font-sans">
            I'm Som Maharajan. Over the past decade, I've designed and scaled high-throughput platform
            infrastructure: low-latency LLM serving runtimes, Radix-tree prefix cache reuse, hybrid retrieval engines,
            and deterministic event pipelines across millions of daily transactions.
          </p>

          {/* Quick Action Cluster */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
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
              <span>View Dossier</span>
            </Link>

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
          </div>
        </div>

        {/* Bespoke System Vitals Panel */}
        <div className="mt-8">
          <SystemVitals />
        </div>
      </section>

      {/* Featured Architecture Dossiers */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <span className="label-mono">Selected Case Studies</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Architecture & Production Dossiers
            </h2>
          </div>
          <Link
            to="/work"
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>All {work.length} dossiers</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {work.slice(0, 4).map((w, idx) => (
            <Link
              key={w.slug}
              to={`/work/${w.slug}`}
              className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-semibold text-faint">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-accent transition-colors">
                    {w.title}
                  </h3>
                </div>
                <div className="font-mono text-xs font-semibold text-accent shrink-0 sm:text-right">
                  {w.metric.label}: <span className="font-bold">{w.metric.value}</span>
                </div>
              </div>

              <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
                {w.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/50 pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="tag-pill text-accent">{w.category}</span>
                  {w.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tag-pill">{tech}</span>
                  ))}
                </div>

                <span className="font-mono text-xs text-accent inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Architecture</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Systems Lab */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line pb-3">
          <span className="label-mono">Simulation Sandbox</span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
            P99 Latency & Concurrency Workbench
          </h2>
          <p className="mt-1 text-sm text-muted">
            Experiment with prompt batching, concurrency load, and prefix KV-cache reuse.
          </p>
        </div>
        <LLMSimulator />
      </section>

      {/* Field Notes & Technical Writing */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <span className="label-mono">Technical Writing</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
              Engineering Field Notes
            </h2>
          </div>
          <Link
            to="/writing"
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>All write-ups</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/writing/${article.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-faint mb-2">
                  <span className="text-accent font-medium">#{article.topic.toLowerCase()}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">
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
      </section>

      {/* Engineering Philosophy */}
      <section className="flex flex-col gap-6">
        <div className="border-b border-line pb-3">
          <span className="label-mono">Principles</span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
            Architectural Ethos
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map(([title, detail], idx) => (
            <div key={title} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">0{idx + 1}.</span>
                <h3 className="text-sm font-semibold text-text">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
