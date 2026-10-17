import { useState, useMemo } from "react";
import { SlidersHorizontal, Info, Cpu, HardDrive } from "lucide-react";

export default function LLMSimulator() {
  const [activeTab, setActiveTab] = useState("scheduler"); // "scheduler" | "kvcool"

  // Scheduler tab state
  const [concurrency, setConcurrency] = useState(160);
  const [promptTokens, setPromptTokens] = useState(1400);
  const [kvHitRate, setKvHitRate] = useState(60);
  const [scheduler, setScheduler] = useState("continuous"); // "continuous" | "static"

  // KV Sizing tab state
  const [modelType, setModelType] = useState("70b"); // "8b" | "70b" | "deepseek"
  const [precision, setPrecision] = useState("fp8"); // "fp16" | "fp8" | "int4"
  const [contextLength, setContextLength] = useState(8192);
  const [gpuCount, setGpuCount] = useState(4); // 1, 2, 4, 8

  // Scheduler metrics calculation
  const schedulerMetrics = useMemo(() => {
    const isContinuous = scheduler === "continuous";
    const cacheFactor = 1 - (kvHitRate / 100) * 0.75;
    const prefillMs = promptTokens * 0.12 * cacheFactor;

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

  // VRAM Sizing metrics
  const sizingMetrics = useMemo(() => {
    // Model base weight in GB (fp16)
    const baseWeights = { "8b": 16, "70b": 140, "deepseek": 670 };
    const numLayers = { "8b": 32, "70b": 80, "deepseek": 60 };
    const numKvHeads = { "8b": 8, "70b": 8, "deepseek": 128 }; // GQA
    const headDim = { "8b": 128, "70b": 128, "deepseek": 64 };

    const multiplier = precision === "fp16" ? 1.0 : precision === "fp8" ? 0.5 : 0.25;
    const weightVramGb = Math.round(baseWeights[modelType] * multiplier);

    // KV Cache per token in bytes = 2 * num_layers * num_kv_heads * head_dim * precision_bytes
    const precisionBytes = precision === "fp16" ? 2 : 1; // FP8 KV cache support
    const bytesPerToken = 2 * numLayers[modelType] * numKvHeads[modelType] * headDim[modelType] * precisionBytes;
    const mbPerToken = bytesPerToken / (1024 * 1024);
    const mbPerSequence = Math.round(mbPerToken * contextLength);

    const totalVramAvailableGb = gpuCount * 80; // 80GB H100s
    const weightPerGpuGb = weightVramGb / gpuCount;
    const vramRemainingGb = Math.max(0, totalVramAvailableGb - weightVramGb);
    const maxSafeConcurrentReqs = mbPerSequence > 0 ? Math.floor((vramRemainingGb * 1024 * 0.85) / mbPerSequence) : 0;
    const isOom = weightVramGb > totalVramAvailableGb;

    return {
      weightVramGb,
      weightPerGpuGb: weightPerGpuGb.toFixed(1),
      totalVramAvailableGb,
      vramRemainingGb,
      mbPerSequence,
      maxSafeConcurrentReqs,
      isOom,
    };
  }, [modelType, precision, contextLength, gpuCount]);

  const maxScaleMs = 4500;
  const p50Width = Math.min(100, (schedulerMetrics.p50Ms / maxScaleMs) * 100);
  const p99Width = Math.min(100, (schedulerMetrics.p99Ms / maxScaleMs) * 100);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 transition-colors shadow-sm">
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("scheduler")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition ${
              activeTab === "scheduler"
                ? "bg-text text-bg font-semibold"
                : "text-muted hover:text-text hover:bg-raised"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>1. Tail Latency & Chunked Prefill</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kvcool")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition ${
              activeTab === "kvcool"
                ? "bg-text text-bg font-semibold"
                : "text-muted hover:text-text hover:bg-raised"
            }`}
          >
            <HardDrive className="h-3.5 w-3.5" />
            <span>2. GPU VRAM & KV-Cache Sizer</span>
          </button>
        </div>

        <span className="font-mono text-[11px] text-faint">
          Interactive Architecture Sandbox
        </span>
      </div>

      {activeTab === "scheduler" ? (
        <div className="mt-5">
          {/* Scheduler Switcher */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-line/50">
            <span className="text-xs font-mono text-muted">Scheduling Algorithm:</span>
            <div className="inline-flex rounded-lg border border-line bg-raised p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setScheduler("continuous")}
                className={`rounded-md px-2.5 py-1 transition ${
                  scheduler === "continuous"
                    ? "bg-text font-semibold text-bg"
                    : "text-muted hover:text-text"
                }`}
              >
                Continuous Chunking (vLLM)
              </button>
              <button
                type="button"
                onClick={() => setScheduler("static")}
                className={`rounded-md px-2.5 py-1 transition ${
                  scheduler === "static"
                    ? "bg-rose-600 font-semibold text-white"
                    : "text-muted hover:text-text"
                }`}
              >
                Static Batching (Legacy)
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
            {/* Controls */}
            <div className="flex flex-col gap-4">
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
                    Radix Prefix Cache Hit Rate: <strong className="text-accent">{kvHitRate}%</strong>
                  </label>
                  <span className="text-faint">Prefix Token Hits</span>
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
              <div className="mt-1 rounded-xl border border-line bg-raised/40 p-3.5 font-mono">
                <div className="flex items-center justify-between text-[11px] text-faint">
                  <span>LATENCY DYNAMICS</span>
                  <span>0 to 4,500ms Scale</span>
                </div>

                <div className="mt-3 flex flex-col gap-2.5">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-faint">p50 Latency</span>
                      <span className="text-text font-medium">{schedulerMetrics.p50Ms}ms</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-line/60 overflow-hidden">
                      <div
                        className="h-1.5 rounded bg-muted transition-all duration-200"
                        style={{ width: `${p50Width}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-faint">p99 Tail Latency</span>
                      <span className={`font-semibold ${schedulerMetrics.p99Ms > 1800 ? "text-rose-500 font-bold" : "text-text"}`}>
                        {schedulerMetrics.p99Ms}ms {schedulerMetrics.p99Ms > 1800 ? "(SLO Breach)" : ""}
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded bg-line/60 overflow-hidden">
                      <div
                        className={`h-2 rounded transition-all duration-200 ${
                          schedulerMetrics.p99Ms > 1800 ? "bg-rose-500" : "bg-text"
                        }`}
                        style={{ width: `${p99Width}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Output Cards */}
            <div className="flex flex-col justify-between rounded-xl border border-line bg-raised/60 p-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Calculated Telemetry</span>
                <div className="mt-3 grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <span className="text-[11px] text-faint">p99 Latency</span>
                    <p className={`mt-0.5 text-xl font-bold ${schedulerMetrics.p99Ms > 1800 ? "text-rose-500" : "text-text"}`}>
                      {schedulerMetrics.p99Ms >= 1000 ? `${(schedulerMetrics.p99Ms / 1000).toFixed(2)}s` : `${schedulerMetrics.p99Ms}ms`}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-faint">GPU Util</span>
                    <p className="mt-0.5 text-xl font-bold text-text">
                      {schedulerMetrics.gpuUtil}%
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-faint">Hardware</span>
                    <p className="mt-0.5 text-sm font-semibold text-text">
                      {schedulerMetrics.gpusNeeded}× H100 (80GB)
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-faint">Est. Spend</span>
                    <p className="mt-0.5 text-sm font-semibold text-text">
                      ${(schedulerMetrics.monthlyCost / 1000).toFixed(1)}k/mo
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
                        <strong className="text-text">Continuous chunking</strong> slices massive prefill prompts into 512-token increments, preserving sub-second p99 tail times.
                      </>
                    ) : (
                      <>
                        <strong className="text-rose-500">Static batching</strong> causes head-of-line blocking: one 4k token summarization pauses all interactive chat streams.
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* KV Cache Sizing Tab */
        <div className="mt-5">
          <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-mono text-muted">Target Architecture:</span>
                <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-xs">
                  {[
                    { id: "8b", label: "Llama-3-8B" },
                    { id: "70b", label: "Llama-3.1-70B" },
                    { id: "deepseek", label: "DeepSeek-V3" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModelType(m.id)}
                      className={`rounded-lg border p-2 text-center transition ${
                        modelType === m.id
                          ? "border-accent bg-accent/10 font-bold text-accent"
                          : "border-line bg-raised/50 text-muted hover:border-text hover:text-text"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precision-select" className="text-xs font-mono text-muted">Weight Precision:</label>
                  <select
                    id="precision-select"
                    value={precision}
                    onChange={(e) => setPrecision(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-raised px-3 py-1.5 font-mono text-xs text-text focus:border-accent focus:outline-none"
                  >
                    <option value="fp16">FP16 / BF16 (16-bit)</option>
                    <option value="fp8">FP8 (Hopper Native)</option>
                    <option value="int4">AWQ / INT4 (4-bit)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="gpus-select" className="text-xs font-mono text-muted">Cluster Hardware:</label>
                  <select
                    id="gpus-select"
                    value={gpuCount}
                    onChange={(e) => setGpuCount(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-line bg-raised px-3 py-1.5 font-mono text-xs text-text focus:border-accent focus:outline-none"
                  >
                    <option value={1}>1× H100 (80GB VRAM)</option>
                    <option value={2}>2× H100 (160GB VRAM)</option>
                    <option value={4}>4× H100 (320GB VRAM)</option>
                    <option value={8}>8× H100 (640GB VRAM)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor="ctx-length" className="text-muted">
                    Active Context Window: <strong className="text-text">{contextLength.toLocaleString()} tokens</strong>
                  </label>
                  <span className="text-faint">Max 64k</span>
                </div>
                <input
                  id="ctx-length"
                  type="range"
                  min="2048"
                  max="65536"
                  step="2048"
                  value={contextLength}
                  onChange={(e) => setContextLength(Number(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-line accent-accent"
                />
              </div>

              {/* Memory Allocation Breakdown */}
              <div className="rounded-xl border border-line bg-raised/40 p-3.5 font-mono text-xs">
                <div className="flex items-center justify-between text-faint mb-2">
                  <span>MEMORY FOOTPRINT BREAKDOWN</span>
                  <span>{sizingMetrics.totalVramAvailableGb} GB VRAM TOTAL</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Model Weights ({precision.toUpperCase()}):</span>
                    <span className="font-semibold text-text">{sizingMetrics.weightVramGb} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">KV Cache per Sequence:</span>
                    <span className="font-semibold text-text">{sizingMetrics.mbPerSequence} MB</span>
                  </div>
                  <div className="flex justify-between border-t border-line/60 pt-1.5">
                    <span className="text-muted">Available KV Headroom:</span>
                    <span className={`font-semibold ${sizingMetrics.isOom ? "text-rose-500" : "text-emerald-500"}`}>
                      {sizingMetrics.isOom ? "OOM (Cannot load model)" : `${sizingMetrics.vramRemainingGb} GB`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-between rounded-xl border border-line bg-raised/60 p-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Concurrency Capacity</span>
                <div className="mt-3 font-mono">
                  <span className="text-[11px] text-faint">Max Safe Concurrency</span>
                  <p className={`mt-0.5 text-2xl font-bold ${sizingMetrics.isOom ? "text-rose-500" : "text-text"}`}>
                    {sizingMetrics.isOom ? "0 (OOM)" : `${sizingMetrics.maxSafeConcurrentReqs} concurrent streams`}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Before PagedAttention triggers CPU KV-swap evictions.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-line/60 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-faint">Per-GPU Weight:</span>
                    <span className="text-text font-medium">{sizingMetrics.weightPerGpuGb} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-faint">Attention Architecture:</span>
                    <span className="text-accent font-medium">Grouped-Query (GQA)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted font-sans flex items-start gap-1.5">
                <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <span>
                  Using <strong className="text-text">FP8 native quantization</strong> cuts weight memory in half, leaving massive VRAM space for larger concurrent KV-caches.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
