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
      <div className="flex items-center justify-between border-b border-line/70 pb-4">
        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 font-sans text-xs text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>All case studies</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
          <span className="text-accent font-medium">{w.category}</span>
          <span>·</span>
          <span>{w.year}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-text leading-[1.2]">
          {w.title}
        </h1>
        <p className="mt-1 text-base sm:text-lg leading-relaxed text-muted max-w-prose font-sans">
          {w.summary}
        </p>
      </header>

      {/* Headline Metric Strip */}
      <dl className="grid divide-y divide-line/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 rounded-xl border border-line bg-surface shadow-sm">
        {w.results.map(([label, value]) => (
          <div key={label} className="p-5 font-mono">
            <dt className="text-[11px] uppercase tracking-wider text-faint">{label}</dt>
            <dd className="mt-1 text-2xl font-bold text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Scale Stats Ribbon */}
      {w.scaleStats && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-raised/50 p-4 font-mono text-xs">
          {w.scaleStats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-faint">{stat.label}</span>
              <span className="font-semibold text-text mt-0.5">{stat.value}</span>
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
      <div className="grid gap-10 lg:grid-cols-[1fr_14rem]">
        <div className="flex flex-col gap-10 font-sans">
          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">The Challenge</h2>
            <p className="mt-2.5 text-base leading-relaxed text-muted">{w.problem}</p>
          </section>

          {w.investigation && (
            <section className="rounded-xl border border-line bg-raised/50 p-5">
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
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">Engineering Methodology</h2>
            <ol className="mt-3 flex flex-col gap-2.5">
              {w.approach.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
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
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">Trade-offs & Alternatives</h2>
              <div className="mt-3">
                <TradeoffsTable tradeoffs={w.tradeoffs} />
              </div>
            </section>
          )}

          {/* Code Snippet */}
          {w.codeSnippet && (
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">Production Configuration</h2>
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
        <aside className="flex flex-col gap-6 text-xs font-mono">
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
            <p className="mt-1 text-xs font-medium text-text">{w.category}</p>
          </div>

          <div>
            <span className="label-mono">Timeline</span>
            <p className="mt-1 text-muted">{w.year}</p>
          </div>

          <div className="rounded-xl border border-line bg-raised/40 p-4 font-sans">
            <p className="text-xs text-muted leading-relaxed">
              Have questions regarding this architecture?
            </p>
            <a
              href={`mailto:${site.email}?subject=Architecture inquiry regarding ${w.title}`}
              className="mt-2 block font-sans text-xs font-medium text-accent hover:underline"
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
          <p className="mt-1 font-serif text-base sm:text-lg text-text group-hover:text-accent transition-colors">
            {next.title}
          </p>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
