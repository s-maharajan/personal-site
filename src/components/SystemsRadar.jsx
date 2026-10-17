import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Layers, GitFork, Search } from "lucide-react";

const domains = [
  {
    id: "inference",
    title: "LLM Inference Scheduling",
    icon: Cpu,
    metric: "p99 Latency: 4.2s → 680ms",
    bottleneck: "Head-of-line blocking when long 4k-token prefill iterations monopolize tensor cores, freezing ongoing conversational decodes.",
    trap: "Static micro-batching causes execution bubbles on GPUs while waiting for the single slowest generation in the batch to emit <eos>.",
    solution: "Continuous iteration-level scheduling with chunked prefill (capped at 2,048 tokens/step) and Radix-tree prefix cache reuse.",
    link: "/writing/head-of-line-blocking-llm-batching",
    action: "Read Head-of-Line Deep Dive",
  },
  {
    id: "quantization",
    title: "Precision & Quantization",
    icon: Layers,
    metric: "Sustained Throughput: +2.8×",
    bottleneck: "Memory bandwidth saturation on 70B parameter models requiring multi-node tensor parallelism over NVLink.",
    trap: "Weight-only INT4 (AWQ) must unpack weights back to FP16 before ALU matrix multiplications on modern Hopper/Blackwell cards.",
    solution: "Native FP8 Tensor Core compute for high-concurrency production endpoints; AWQ INT4 reserved for single-GPU offload budgets.",
    link: "/writing/quantization-without-tears",
    action: "Read Quantization Analysis",
  },
  {
    id: "replication",
    title: "State Replication & CDC",
    icon: GitFork,
    metric: "Duplicate Events: Exactly 0",
    bottleneck: "Dual-writes to databases and message queues guarantee silent state corruption during network timeouts and aborts.",
    trap: "Polling queries (SELECT * FROM outbox WHERE sent = false) cause index bloat, table locks, and replication lag spikes.",
    solution: "Transactional Outbox table committed in local ACID tx, streamed asynchronously from the PostgreSQL WAL via pgoutput logical decoding.",
    link: "/writing/deterministic-outbox-kafka-cdc",
    action: "Inspect Outbox Architecture",
  },
  {
    id: "retrieval",
    title: "Enterprise Hybrid Retrieval",
    icon: Search,
    metric: "Relevance Lift: +34% nDCG@10",
    bottleneck: "Dense embedding vectors fail on exact alphanumeric SKUs, error codes, and severed document clauses.",
    trap: "Naive 512-token sliding window chunkers slice contractual caveats away from their governing subjects.",
    solution: "Three-stage pipeline: Parallel BM25 + FAISS HNSW fanout, Reciprocal Rank Fusion (RRF k=60), and cross-encoder attention reranking.",
    link: "/writing/why-rag-hallucinates-chunking",
    action: "Read RAG Hallucination Essay",
  },
];

export default function SystemsRadar() {
  const [activeTab, setActiveTab] = useState(domains[0].id);
  const active = domains.find((d) => d.id === activeTab) || domains[0];

  return (
    <section className="rounded-xl border border-line bg-raised/30 p-6 sm:p-7 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-line/70 pb-4 gap-2">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
            Interactive Architecture Matrix
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-text mt-1">
            Production Trade-Offs & Failure Modes
          </h2>
        </div>
        <span className="font-mono text-xs text-faint">
          Empirical Systems Data
        </span>
      </div>

      {/* Domain Selection Tabs */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {domains.map((d) => {
          const isSelected = activeTab === d.id;
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveTab(d.id)}
              className={`flex items-center gap-2 rounded-lg p-2.5 text-left transition-all ${
                isSelected
                  ? "bg-text text-bg shadow-sm"
                  : "bg-surface border border-line text-muted hover:border-text hover:text-text"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-accent" : "text-muted"}`} />
              <span className="text-xs font-medium font-sans truncate">{d.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Matrix Content Card */}
      <div className="mt-5 rounded-lg border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <h3 className="font-serif text-lg sm:text-xl font-normal text-text">
              {active.title}
            </h3>
          </div>
          <span className="font-mono text-xs font-semibold text-accent">
            {active.metric}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs leading-relaxed">
          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-raised/50 border border-line/60">
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint font-semibold">
              The Production Bottleneck
            </span>
            <p className="text-muted font-sans">{active.bottleneck}</p>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-raised/50 border border-line/60">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D97757] font-semibold">
              The Common Trap
            </span>
            <p className="text-muted font-sans">{active.trap}</p>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-raised/50 border border-line/60">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#788C5D] font-semibold">
              Battle-Tested Solution
            </span>
            <p className="text-text font-sans font-medium">{active.solution}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
          <span className="font-mono text-[11px] text-faint">
            Tested across production clusters
          </span>
          <Link
            to={active.link}
            className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>{active.action}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
