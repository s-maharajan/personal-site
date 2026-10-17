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
    <article className="max-w-4xl">
      <title>{`${w.title} · ${site.name}`}</title>

      <div className="flex items-center justify-between">
        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          All case studies
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted transition hover:border-faint hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-xs text-accent">
            {w.category || w.tags[0]}
          </span>
          <span className="font-mono text-xs text-faint">·</span>
          <span className="font-mono text-xs text-faint">{w.year}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          {w.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">{w.summary}</p>
      </header>

      {/* Headline Metric Card Grid */}
      <dl className="card mt-8 grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {w.results.map(([label, value]) => (
          <div key={label} className="p-6">
            <dt className="text-sm text-faint">{label}</dt>
            <dd className="mt-2 font-mono text-2xl tabular-nums tracking-tight text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Scale Stats Ribbon */}
      {w.scaleStats && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface/60 px-6 py-4">
          {w.scaleStats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-wider text-faint">{stat.label}</span>
              <span className="font-mono text-sm font-semibold text-text">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Architecture Diagram */}
      {w.architecture && (
        <div className="mt-12">
          <ArchitectureDiagram architecture={w.architecture} title={`${w.title} – Topology`} />
        </div>
      )}

      {/* Problem & Investigation */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-xl font-semibold text-text">The Problem</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{w.problem}</p>
          </section>

          {w.investigation && (
            <section className="rounded-xl border border-line bg-raised/40 p-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent">Root Cause Investigation</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{w.investigation}</p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold text-text">The Engineering Approach</h2>
            <ol className="mt-5 flex flex-col gap-4">
              {w.approach.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-accent bg-surface">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Architecture Tradeoffs */}
          {w.tradeoffs && (
            <section>
              <h2 className="text-xl font-semibold text-text">Architectural Trade-offs & Decisions</h2>
              <p className="mt-2 text-sm text-muted">
                Every distributed system is a compromise. Here are the alternatives evaluated and the trade-offs accepted.
              </p>
              <div className="mt-5">
                <TradeoffsTable tradeoffs={w.tradeoffs} />
              </div>
            </section>
          )}

          {/* Code Snippet */}
          {w.codeSnippet && (
            <section>
              <h2 className="text-xl font-semibold text-text">Implementation Artifact</h2>
              <div className="mt-4">
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
        <aside className="flex flex-col gap-8 lg:pt-1">
          <div>
            <p className="label">Tech Stack</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {w.stack.map((s) => (
                <li key={s} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label">Domain</p>
            <p className="mt-2 text-sm font-medium text-text">{w.category || "AI & Systems"}</p>
          </div>

          <div>
            <p className="label">Timeline</p>
            <p className="mt-2 font-mono text-sm text-muted">{w.year}</p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs text-muted">
              Have questions about this architecture or facing similar scale challenges?
            </p>
            <a
              href={`mailto:${site.email}?subject=Architecture inquiry regarding ${w.title}`}
              className="mt-3 block text-xs font-semibold text-accent hover:underline"
            >
              Discuss this design with Som →
            </a>
          </div>
        </aside>
      </div>

      {/* Next Case Study */}
      <Link
        to={`/work/${next.slug}`}
        className="card group mt-20 flex items-center justify-between gap-6 p-6 hover:border-faint sm:p-8"
      >
        <div>
          <p className="label">Next case study</p>
          <p className="mt-2 text-lg font-medium text-text sm:text-xl">{next.title}</p>
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
