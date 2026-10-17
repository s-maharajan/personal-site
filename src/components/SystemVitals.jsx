import { Activity, ShieldCheck, Terminal } from "lucide-react";

export default function SystemVitals() {
  const telemetry = [
    { label: "Active Platform", value: "vLLM Multi-GPU Serving", detail: "Radix-tree KV-cache reuse & chunked prefill" },
    { label: "SLO Envelope", value: "p99 < 700ms", detail: "Continuous batching vs head-of-line blocking" },
    { label: "Data Pipeline", value: "Transactional Outbox + CDC", detail: "Postgres WAL → Debezium → Kafka stream" },
    { label: "Engineering Scope", value: "Distributed State & Inference", detail: "Architecture reviews, latency debugging, scale" },
  ];

  return (
    <div className="rounded-xl border border-line bg-surface p-5 transition-colors">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs uppercase tracking-wider text-text font-semibold">
            System Spec & Focus Areas
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-muted">Production Grade</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {telemetry.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-line/70 bg-raised/50 p-3 font-mono">
            <div className="text-[10px] uppercase tracking-wider text-faint flex items-center justify-between">
              <span>{item.label}</span>
              <span className="text-[9px] text-faint/60">0{idx + 1}</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-text">{item.value}</div>
            <div className="mt-0.5 text-[11px] text-muted font-sans leading-tight">{item.detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3 text-[11px] font-mono text-faint">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-accent" />
          <span>Distributed consensus & zero-downtime cutovers</span>
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>Zero duplicates in 18 mos</span>
        </span>
      </div>
    </div>
  );
}
