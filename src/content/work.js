// Case studies, newest first. The home page and /work both read from this list.
export const work = [
  {
    slug: "llm-tail-latency",
    metric: { value: "6×", label: "faster p99" },
    year: "2025",
    title: "Cutting LLM tail latency 6×",
    summary: "p99 went from 4.2s to 680ms on a production LLM endpoint.",
    tags: ["Inference", "Latency"],
    problem:
      "A production LLM endpoint had a p50 of 280ms but a p99 of 4.2s. SLO breaches paged the on-call engineer most nights, and the cause was hidden under three layers of autoscaling.",
    approach: [
      "Instrumented every hop with OpenTelemetry: router, model server, and tokenizer.",
      "Found that GPU compute wasn't the bottleneck. Small requests were stuck behind large prompts.",
      "Added length-aware request bucketing and KV-cache reuse for repeated system prompts.",
      "Replaced fixed batches with continuous batching tuned to a target queue depth.",
    ],
    results: [
      ["p99 latency", "4.2s → 680ms"],
      ["GPU utilisation", "38% → 71%"],
      ["Night pages", "Stopped"],
    ],
    stack: ["vLLM", "Triton", "Envoy", "Prometheus"],
  },
  {
    slug: "hybrid-retrieval",
    metric: { value: "+34%", label: "nDCG@10" },
    year: "2025",
    title: "Hybrid retrieval that beat pure vector search by 34%",
    summary: "BM25, dense retrieval, and a reranker, measured against 12k labelled pairs.",
    tags: ["Search", "Evaluation"],
    problem:
      "A semantic search rollout did worse than the old BM25 index on short keyword queries. Users noticed before the dashboards did.",
    approach: [
      "Built an offline evaluation harness over 12k labelled query and document pairs.",
      "Confirmed that dense retrieval lost on rare terms and BM25 lost on paraphrases.",
      "Combined both with reciprocal-rank fusion, weighted per query by a small classifier.",
      "Added a learned reranker over the top 50 results.",
    ],
    results: [
      ["nDCG@10 vs. vector only", "+34%"],
      ["nDCG@10 vs. BM25 only", "+21%"],
      ["Tail-query satisfaction", "Up in A/B"],
    ],
    stack: ["FAISS", "Elasticsearch", "FastAPI", "PyTorch"],
  },
  {
    slug: "exactly-once-pipeline",
    metric: { value: "0", label: "duplicates in 18 months" },
    year: "2024",
    title: "Exactly-once delivery across three datastores",
    summary: "No duplicate-event incidents in 18 months on a Kafka → Postgres → Redis pipeline.",
    tags: ["Streaming", "Consistency"],
    problem:
      "Order events flowed from Kafka through a service into Postgres, Redis, and a downstream webhook. Replays caused duplicate side effects, and at-least-once delivery was costing real money.",
    approach: [
      "Bound idempotency keys to the source offset instead of generating them downstream.",
      "Wrote each event's changes in a single Postgres transaction, with an outbox and CDC for fan-out.",
      "Treated Redis as a projection derived from Postgres, never as a source of truth.",
      "Proved zero duplicates across 3M synthetic events with a deterministic replay harness.",
    ],
    results: [
      ["Duplicate-event incidents", "0 in 18 months"],
      ["Reconciliation", "Nightly → weekly"],
    ],
    stack: ["Kafka", "PostgreSQL", "Debezium", "Go"],
  },
  {
    slug: "monolith-decomposition",
    metric: { value: "11", label: "services extracted" },
    year: "2023–24",
    title: "Splitting up a 400k-line monolith with no downtime",
    summary: "11 services extracted in 9 months. Deploys went up 4×.",
    tags: ["Architecture", "Migration"],
    problem:
      "A ten-year-old monolith owned the most critical write path. Six teams were blocked on it every week, and earlier attempts to break it up had stalled.",
    approach: [
      "Mapped bounded contexts from real call graphs rather than the org chart.",
      "Used the strangler-fig pattern behind a feature router.",
      "Fed new services through CDC so dual writes were never needed.",
      "Checked every endpoint with shadow traffic and response diffing before cutover.",
    ],
    results: [
      ["Services extracted", "11 in 9 months"],
      ["Deploy frequency", "4×"],
      ["Customer-visible incidents", "0"],
    ],
    stack: ["Java", "Spring", "AWS", "Terraform"],
  },
  {
    slug: "cloud-cost",
    metric: { value: "−42%", label: "cloud spend" },
    year: "2023",
    title: "Cutting cloud spend 42% without slowing teams down",
    summary: "Cost attribution found three workloads using 60% of compute.",
    tags: ["Cost", "Infrastructure"],
    problem:
      "The cloud bill was growing faster than revenue. The easy savings were already taken, and slowing down delivery was not an option.",
    approach: [
      "Built a cost-attribution pipeline that tagged every workload by team and feature.",
      "Found three workloads using 60% of compute, none of them on leadership's radar.",
      "Right-sized them with the Vertical Pod Autoscaler in recommendation mode for two weeks before enforcing it.",
      "Moved batch ML training to spot capacity with checkpointing, cutting that line by 70%.",
    ],
    results: [
      ["Total spend", "−42%"],
      ["p95 latency", "Unchanged"],
    ],
    stack: ["Kubernetes", "VPA", "Athena", "Terraform"],
  },
];

export const findWork = (slug) => work.find((w) => w.slug === slug);
