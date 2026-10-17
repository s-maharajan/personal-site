import { useState, useMemo } from "react";
import { SlidersHorizontal, Info } from "lucide-react";

export default function LLMSimulator() {
  const [concurrency, setConcurrency] = useState(160);
  const [promptTokens, setPromptTokens] = useState(1400);
  const [kvHitRate, setKvHitRate] = useState(60);
  const [scheduler, setScheduler] = useState("continuous"); // "continuous" | "static"

  const metrics = useMemo(() => {
    const isContinuous = scheduler === "continuous";
    const cacheFactor = 1 - (kvHitRate / 100) * 0.75;

    // Prefill compute time in ms
    const prefillMs = (promptTokens * 0.12 * cacheFactor);

    // Queue contention multiplier based on concurrency & batching strategy
    let p50Ms, p99Ms, gpuUtil;

    if (isContinuous) {
      // Continuous chunked scheduling: smooth execution, low tail jitter
      const queueJitter = (concurrency / 400) * 120;
      p50Ms = Math.round(180 + prefillMs * 0.45 + queueJitter * 0.2);
      p99Ms = Math.round(p50Ms * (1.65 + (concurrency / 450) * 0.35 * cacheFactor));
      gpuUtil = Math.min(94, Math.round(42 + (concurrency / 500) * 44 + (promptTokens / 4096) * 12));
    } else {
      // Static micro-batching: head-of-line blocking explodes p99
      const holBlocking = (concurrency / 120) * (promptTokens / 600) * 380;
      p50Ms = Math.round(290 + prefillMs * 0.9 + (concurrency / 200) * 150);
      p99Ms = Math.round(p50Ms * 2.2 + holBlocking);
      gpuUtil = Math.min(78, Math.round(30 + (concurrency / 500) * 35));
    }

    // Monthly hardware cost estimate (H100 8-GPU nodes @ $2.40/GPU/hr)
    const effectiveTokensPerSec = Math.round(concurrency * (promptTokens * 0.15 + 65));
    const gpusNeeded = Math.max(8, Math.ceil(effectiveTokensPerSec / (isContinuous ? 1900 : 950)));
    const monthlyCost = Math.round(gpusNeeded * 2.4 * 730);

    return {
      p50Ms,
      p99Ms,
      gpuUtil,
      gpusNeeded,
      monthlyCost,
      effectiveTokensPerSec,
    };
  }, [concurrency, promptTokens, kvHitRate, scheduler]);

  const maxScaleMs = 4500;
  const p50Width = Math.min(100, (metrics.p50Ms / maxScaleMs) * 100);
  const p99Width = Math.min(100, (metrics.p99Ms / maxScaleMs) * 100);

  return (
    <div className="card overflow-hidden border-line p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text">
              Interactive Systems Lab: LLM Tail-Latency Simulator
            </h3>
            <p className="text-xs text-muted">
              Model the impact of request concurrency, prompt lengths, and KV-cache reuse on p99 tail latency.
            </p>
          </div>
        </div>

        {/* Scheduler Switcher */}
        <div className="inline-flex rounded-lg border border-line bg-surface p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setScheduler("continuous")}
            className={`rounded-md px-3 py-1.5 transition ${
              scheduler === "continuous"
                ? "bg-accent font-semibold text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            Continuous Chunked (vLLM)
          </button>
          <button
            type="button"
            onClick={() => setScheduler("static")}
            className={`rounded-md px-3 py-1.5 transition ${
              scheduler === "static"
                ? "bg-rose-500 font-semibold text-white"
                : "text-muted hover:text-text"
            }`}
          >
            Static Micro-Batching
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Concurrency slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="concurrency" className="font-mono text-muted">
                Ingress Concurrency: <span className="font-semibold text-text">{concurrency} QPS</span>
              </label>
              <span className="font-mono text-faint">Peak: 500 QPS</span>
            </div>
            <input
              id="concurrency"
              type="range"
              min="20"
              max="500"
              step="10"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-line accent-accent"
            />
          </div>

          {/* Prompt length slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="prompt-tokens" className="font-mono text-muted">
                Mean Prompt Size: <span className="font-semibold text-text">{promptTokens.toLocaleString()} tokens</span>
              </label>
              <span className="font-mono text-faint">Max: 4,096</span>
            </div>
            <input
              id="prompt-tokens"
              type="range"
              min="256"
              max="4096"
              step="128"
              value={promptTokens}
              onChange={(e) => setPromptTokens(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-line accent-accent"
            />
          </div>

          {/* KV cache hit rate slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="kv-rate" className="font-mono text-muted">
                Prefix KV-Cache Reuse Rate: <span className="font-semibold text-accent">{kvHitRate}%</span>
              </label>
              <span className="font-mono text-faint">Radix-Tree Hashing</span>
            </div>
            <input
              id="kv-rate"
              type="range"
              min="0"
              max="90"
              step="5"
              value={kvHitRate}
              onChange={(e) => setKvHitRate(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-line accent-accent"
            />
          </div>

          {/* Latency Comparison Bars */}
          <div className="mt-2 rounded-xl border border-line bg-raised/40 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>Latency Distribution (ms)</span>
              <span className="text-faint">0 to 4,500ms Scale</span>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-faint">p50 Latency</span>
                  <span className="font-mono font-medium text-text">{metrics.p50Ms}ms</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-surface">
                  <div
                    className="h-2 rounded-full bg-muted transition-all duration-300"
                    style={{ width: `${p50Width}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-faint">p99 Tail Latency</span>
                  <span
                    className={`font-mono font-semibold ${
                      metrics.p99Ms > 1800 ? "text-rose-400" : "text-accent"
                    }`}
                  >
                    {metrics.p99Ms}ms {metrics.p99Ms > 1800 ? "(SLO Breach)" : "(Within SLO)"}
                  </span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-surface">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      metrics.p99Ms > 1800 ? "bg-rose-500" : "bg-accent"
                    }`}
                    style={{ width: `${p99Width}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Output Cards */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-line bg-surface p-5">
          <div>
            <span className="label">Telemetry Projections</span>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-faint">p99 Tail</span>
                <p className={`mt-1 font-mono text-2xl font-semibold ${metrics.p99Ms > 1800 ? "text-rose-400" : "text-accent"}`}>
                  {metrics.p99Ms >= 1000 ? `${(metrics.p99Ms / 1000).toFixed(2)}s` : `${metrics.p99Ms}ms`}
                </p>
              </div>

              <div>
                <span className="text-xs text-faint">GPU Utilization</span>
                <p className="mt-1 font-mono text-2xl font-semibold text-text">
                  {metrics.gpuUtil}%
                </p>
              </div>

              <div>
                <span className="text-xs text-faint">Cluster Fleet</span>
                <p className="mt-1 font-mono text-xl font-medium text-text">
                  {metrics.gpusNeeded}× H100
                </p>
              </div>

              <div>
                <span className="text-xs text-faint">Est. Spend / mo</span>
                <p className="mt-1 font-mono text-xl font-medium text-text">
                  ${(metrics.monthlyCost / 1000).toFixed(1)}k
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-4 text-xs leading-relaxed text-muted">
            <div className="flex items-start gap-1.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                {scheduler === "continuous" ? (
                  <>
                    <strong className="text-text">Continuous chunking</strong> yields attention compute every step, preventing large prompts from delaying concurrent token emissions.
                  </>
                ) : (
                  <>
                    <strong className="text-rose-400">Static batching</strong> causes head-of-line blocking; single large prompts freeze memory access across the entire worker thread.
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
