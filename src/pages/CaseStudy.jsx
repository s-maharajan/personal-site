import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Share2, Check } from "lucide-react";
import { useState } from "react";
import { site } from "../content/site";
import { work, findWork } from "../content/work";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import TradeoffsTable from "../components/TradeoffsTable";
import CodeBlock from "../components/CodeBlock";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug } = useParams();
  const w = findWork(slug);
  const [copied, setCopied] = useState(false);

  if (!w) return <NotFound />;

  const next = work[(work.indexOf(w) + 1) % work.length];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: w.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <article className="flex flex-col gap-10">
      <title>{`${w.title} · ${site.fullName || site.name}`}</title>

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>Back to Case Studies</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition hover:border-text hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
          <span className="text-accent font-semibold">{w.category}</span>
          <span>·</span>
          <span>{w.year}</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl leading-tight">
          {w.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted max-w-2xl font-sans">
          {w.summary}
        </p>
      </header>

      {/* Headline Metric Strip */}
      <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 rounded-xl border border-line bg-surface">
        {w.results.map(([label, value]) => (
          <div key={label} className="p-5 font-mono">
            <dt className="text-[11px] uppercase tracking-wider text-faint">{label}</dt>
            <dd className="mt-1 text-2xl font-bold text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Scale Stats Ribbon */}
      {w.scaleStats && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-raised/50 p-4 font-mono">
          {w.scaleStats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-faint">{stat.label}</span>
              <span className="text-xs font-bold text-text mt-0.5">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Architecture Diagram */}
      {w.architecture && (
        <div>
          <ArchitectureDiagram architecture={w.architecture} title={`${w.title} – Topology`} />
        </div>
      )}

      {/* Problem & Investigation */}
      <div className="grid gap-10 lg:grid-cols-[1fr_15rem]">
        <div className="flex flex-col gap-10 font-sans">
          <section>
            <span className="label-mono">Background</span>
            <h2 className="mt-1 text-xl font-bold text-text">The Challenge</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{w.problem}</p>
          </section>

          {w.investigation && (
            <section className="rounded-xl border border-line bg-raised/40 p-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Root Cause Investigation & Traces
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.investigation}</p>
            </section>
          )}

          <section>
            <span className="label-mono">Execution</span>
            <h2 className="mt-1 text-xl font-bold text-text">Engineering Methodology</h2>
            <ol className="mt-4 flex flex-col gap-3 font-mono text-xs">
              {w.approach.map((step, i) => (
                <li key={i} className="flex gap-3 text-xs leading-relaxed text-muted font-sans">
                  <span className="font-mono text-xs font-bold text-accent shrink-0 pt-0.5">
                    0{i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Architecture Tradeoffs */}
          {w.tradeoffs && (
            <section>
              <span className="label-mono">Architecture Decision Records</span>
              <h2 className="mt-1 text-xl font-bold text-text">Trade-offs & Alternatives</h2>
              <div className="mt-4">
                <TradeoffsTable tradeoffs={w.tradeoffs} />
              </div>
            </section>
          )}

          {/* Code Snippet */}
          {w.codeSnippet && (
            <section>
              <span className="label-mono">Configuration & Source</span>
              <h2 className="mt-1 text-xl font-bold text-text">Production Artifact</h2>
              <div className="mt-3">
                <CodeBlock
                  title={w.codeSnippet.title}
                  language={w.codeSnippet.language}
                  code={w.codeSnippet.code}
                />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="flex flex-col gap-6 lg:pt-1 text-xs font-mono">
          <div>
            <span className="label-mono">Tech Stack</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {w.stack.map((s) => (
                <span key={s} className="tag-pill">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="label-mono">Domain</span>
            <p className="mt-1 text-xs font-semibold text-text">{w.category}</p>
          </div>

          <div>
            <span className="label-mono">Timeline</span>
            <p className="mt-1 text-muted">{w.year}</p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-4 font-sans">
            <p className="text-xs text-muted leading-relaxed">
              Have questions regarding this architecture?
            </p>
            <a
              href={`mailto:${site.email}?subject=Architecture inquiry regarding ${w.title}`}
              className="mt-2 block font-mono text-xs font-semibold text-accent hover:underline"
            >
              Contact Som →
            </a>
          </div>
        </aside>
      </div>

      {/* Next Case Study */}
      <Link
        to={`/work/${next.slug}`}
        className="group flex items-center justify-between rounded-xl border border-line bg-surface p-6 transition-all hover:border-accent hover:shadow-sm"
      >
        <div>
          <span className="label-mono">Next Case Study</span>
          <p className="mt-1 text-base font-semibold text-text group-hover:text-accent transition-colors">
            {next.title}
          </p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
