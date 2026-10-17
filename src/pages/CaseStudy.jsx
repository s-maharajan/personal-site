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
    <article>
      <title>{`${w.title} · ${site.fullName || site.name}`}</title>

      <div className="flex items-center justify-between pb-6 border-b border-line">
        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Back to all case studies
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-2.5 py-1 text-xs font-mono text-muted transition hover:border-text hover:text-text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      </div>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
          <span className="text-accent font-semibold">{w.category}</span>
          <span>·</span>
          <span>{w.year}</span>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-text sm:text-4xl">
          {w.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-2xl font-sans">
          {w.summary}
        </p>
      </header>

      {/* Headline Metric Card Grid */}
      <dl className="mt-8 grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 border-y border-line py-2">
        {w.results.map(([label, value]) => (
          <div key={label} className="p-4 sm:p-5">
            <dt className="text-xs font-mono uppercase tracking-wider text-faint">{label}</dt>
            <dd className="mt-1 font-mono text-xl sm:text-2xl tabular-nums font-semibold text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Scale Stats Ribbon */}
      {w.scaleStats && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded border border-line bg-raised/40 px-5 py-3 font-mono">
          {w.scaleStats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-faint">{stat.label}</span>
              <span className="text-xs font-semibold text-text">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Architecture Diagram */}
      {w.architecture && (
        <div className="mt-10">
          <ArchitectureDiagram architecture={w.architecture} title={`${w.title} – Topology`} />
        </div>
      )}

      {/* Problem & Investigation */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_14rem]">
        <div className="flex flex-col gap-10 font-sans">
          <section>
            <h2 className="font-serif text-2xl font-medium text-text">The Problem</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{w.problem}</p>
          </section>

          {w.investigation && (
            <section className="rounded border-l-2 border-accent bg-raised/50 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Root Cause Investigation & Traces
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.investigation}</p>
            </section>
          )}

          <section>
            <h2 className="font-serif text-2xl font-medium text-text">The Engineering Approach</h2>
            <ol className="mt-4 flex flex-col gap-3.5">
              {w.approach.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="font-mono text-xs font-semibold text-accent shrink-0 pt-0.5">
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
              <h2 className="font-serif text-2xl font-medium text-text">Architectural Trade-offs & Decisions</h2>
              <p className="mt-2 text-sm text-muted">
                Every distributed system is a compromise. Here are the alternatives evaluated and the trade-offs accepted.
              </p>
              <div className="mt-4">
                <TradeoffsTable tradeoffs={w.tradeoffs} />
              </div>
            </section>
          )}

          {/* Code Snippet */}
          {w.codeSnippet && (
            <section>
              <h2 className="font-serif text-2xl font-medium text-text">Implementation Artifact</h2>
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
            <p className="label">Tech Stack</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {w.stack.map((s) => (
                <span key={s} className="rounded border border-line bg-surface px-2 py-0.5 text-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="label">Domain</p>
            <p className="mt-1 text-sm font-medium text-text font-serif">{w.category}</p>
          </div>

          <div>
            <p className="label">Timeline</p>
            <p className="mt-1 text-muted">{w.year}</p>
          </div>

          <div className="rounded border border-line bg-surface p-4 font-sans">
            <p className="text-xs text-muted leading-relaxed">
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
        className="group mt-16 flex items-center justify-between gap-6 border-t border-line pt-8 hover:bg-raised/30 -mx-3 px-3 rounded"
      >
        <div>
          <p className="label">Next case study</p>
          <p className="mt-1 font-serif text-xl font-medium text-text group-hover:text-accent transition-colors">
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
