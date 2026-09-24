import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Real figures from the LLM tail-latency case study, drawn to one linear scale.
const MAX_MS = 4200;
const rows = [
  { label: "p50", ms: 280, tone: "bg-faint" },
  { label: "p99 before", ms: 4200, tone: "bg-muted" },
  { label: "p99 after", ms: 680, tone: "bg-accent" },
];
const ticks = [0, 1000, 2000, 3000, 4000];

const fmt = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

export default function LatencyCard() {
  return (
    <Link to="/work/llm-tail-latency" className="card group block p-6 hover:border-faint">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Field notes</p>
          <p className="mt-2 font-medium text-text">LLM endpoint latency</p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <dl className="mt-6 flex flex-col gap-4">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between text-xs">
              <dt className="text-muted">{r.label}</dt>
              <dd className={`font-mono tabular-nums ${r.tone === "bg-accent" ? "text-accent" : "text-text"}`}>
                {fmt(r.ms)}
              </dd>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-raised">
              <div
                className={`bar h-2 rounded-full ${r.tone}`}
                style={{ width: `${(r.ms / MAX_MS) * 100}%`, animationDelay: `${0.15 + i * 0.12}s` }}
              />
            </div>
          </div>
        ))}
      </dl>

      <div className="relative mt-2 h-4 font-mono text-[10px] text-faint" aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2 first:translate-x-0"
            style={{ left: `${(t / MAX_MS) * 100}%` }}
          >
            {t === 0 ? "0" : `${t / 1000}s`}
          </span>
        ))}
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        Continuous batching and KV-cache reuse cut tail latency <span className="text-accent">6×</span>.
      </p>
    </Link>
  );
}
