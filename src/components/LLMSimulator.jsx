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
    const prefillMs = promptTokens * 0.12 * cacheFactor;

    // Queue contention multiplier based on concurrency & batching strategy
    let p50Ms, p99Ms, gpuUtil;

    if (isContinuous) {
      const queueJitter = (concurrency / 400) * 120;
      p50Ms = Math.round(180 + prefillMs * 0.45 + queueJitter * 0.2);
      p99Ms = Math.round(p50Ms * (1.65 + (concurrency / 450) * 0.35 * cacheFactor));
      gpuUtil = Math.min(94, Math.round(42 + (concurrency / 500) * 44 + (promptTokens / 4096) * 12));
    } else {
      const holBlocking = (concurrency / 120) * (promptTokens / 600) * 380;
      p50Ms = Math.round(290 + prefillMs * 0.9 + (concurrency / 200) * 150);
      p99Ms = Math.round(p50Ms * 2.2 + holBlocking);
      gpuUtil = Math.min(78, Math.round(30 + (concurrency / 500) * 35));
    }

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
    <div className="rounded border border-line bg-surface p-5 sm:p-6 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs uppercase tracking-wider text-text font-semibold">
            Inference Telemetry Workbench
          </span>
        </div>

        {/* Scheduler Switcher */}
        <div className="inline-flex rounded border border-line bg-raised p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setScheduler("continuous")}
            className={`rounded px-2.5 py-1 transition ${
              scheduler === "continuous"
                ? "bg-text font-semibold text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            Continuous Chunked (vLLM)
          </button>
          <button
            type="button"
            onClick={() => setScheduler("static")}
            className={`rounded px-2.5 py-1 transition ${
              scheduler === "static"
                ? "bg-accent font-semibold text-white"
                : "text-muted hover:text-text"
            }`}
          >
            Static Batching (Legacy)
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_18rem]">
        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="concurrency" className="text-muted">
                Ingress Concurrency: <strong className="text-text">{concurrency} QPS</strong>
              </label>
              <span className="text-faint">Max: 500 QPS</span>
            </div>
            <input
              id="concurrency"
              type="range"
              min="20"
              max="500"
              step="10"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-line accent-accent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="prompt-tokens" className="text-muted">
                Mean Prompt Size: <strong className="text-text">{promptTokens.toLocaleString()} tokens</strong>
              </label>
              <span className="text-faint">Max: 4,096</span>
            </div>
            <input
              id="prompt-tokens"
              type="range"
              min="256"
              max="4096"
              step="128"
              value={promptTokens}
              onChange={(e) => setPromptTokens(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-line accent-accent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="kv-rate" className="text-muted">
                Prefix KV-Cache Reuse: <strong className="text-accent">{kvHitRate}%</strong>
              </label>
              <span className="text-faint">Radix-Tree Hits</span>
            </div>
            <input
              id="kv-rate"
              type="range"
              min="0"
              max="90"
              step="5"
              value={kvHitRate}
              onChange={(e) => setKvHitRate(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-line accent-accent"
            />
          </div>

          {/* Latency Comparison Bars */}
          <div className="mt-1 rounded border border-line bg-raised/40 p-3.5 font-mono">
            <div className="flex items-center justify-between text-[11px] text-faint">
              <span>LATENCY DYNAMICS</span>
              <span>0 to 4,500ms Scale</span>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-faint">p50 Latency</span>
                  <span className="text-text font-medium">{metrics.p50Ms}ms</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-line/60">
                  <div
                    className="h-1.5 rounded bg-muted transition-all duration-200"
                    style={{ width: `${p50Width}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-faint">p99 Tail Latency</span>
                  <span className={`font-semibold ${metrics.p99Ms > 1800 ? "text-accent" : "text-text"}`}>
                    {metrics.p99Ms}ms {metrics.p99Ms > 1800 ? "(SLO Breach)" : ""}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded bg-line/60">
                  <div
                    className={`h-2 rounded transition-all duration-200 ${
                      metrics.p99Ms > 1800 ? "bg-accent" : "bg-text"
                    }`}
                    style={{ width: `${p99Width}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Output Cards */}
        <div className="flex flex-col justify-between rounded border border-line bg-raised/60 p-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Simulated Scale</span>
            <div className="mt-3 grid grid-cols-2 gap-3 font-mono">
              <div>
                <span className="text-[11px] text-faint">p99 Tail</span>
                <p className={`mt-0.5 text-xl font-semibold ${metrics.p99Ms > 1800 ? "text-accent" : "text-text"}`}>
                  {metrics.p99Ms >= 1000 ? `${(metrics.p99Ms / 1000).toFixed(2)}s` : `${metrics.p99Ms}ms`}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-faint">GPU Util</span>
                <p className="mt-0.5 text-xl font-semibold text-text">
                  {metrics.gpuUtil}%
                </p>
              </div>

              <div>
                <span className="text-[11px] text-faint">Hardware</span>
                <p className="mt-0.5 text-sm font-medium text-text">
                  {metrics.gpusNeeded}× H100
                </p>
              </div>

              <div>
                <span className="text-[11px] text-faint">Est. Spend</span>
                <p className="mt-0.5 text-sm font-medium text-text">
                  ${(metrics.monthlyCost / 1000).toFixed(1)}k/mo
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted font-sans">
            <div className="flex items-start gap-1.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                {scheduler === "continuous" ? (
                  <>
                    <strong className="text-text">Continuous chunking</strong> yields attention compute every step, preventing large prompts from delaying concurrent token decodes.
                  </>
                ) : (
                  <>
                    <strong className="text-accent">Static batching</strong> causes head-of-line blocking; large prompts freeze memory access across the worker thread.
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
