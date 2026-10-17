// Case studies, newest first. The home page and /work both read from this list.
export const work = [
  {
    slug: "llm-tail-latency",
    category: "AI & LLM Serving",
    metric: { value: "6×", label: "faster p99" },
    year: "2025",
    title: "Cutting LLM tail latency 6×",
    summary: "p99 went from 4.2s to 680ms on a production LLM endpoint serving 850 QPS.",
    tags: ["Inference", "Latency", "vLLM", "Optimization"],
    scaleStats: [
      { label: "Peak Ingress", value: "850 QPS" },
      { label: "Throughput", value: "62k tokens/s" },
      { label: "Hardware", value: "32× H100 (8 nodes)" },
      { label: "p99 Latency", value: "4.2s → 680ms" },
    ],
    problem:
      "A production LLM endpoint serving customer-facing agentic features had an acceptable p50 of 280ms but an intolerable p99 of 4.2s. SLO breaches paged the on-call engineer multiple times a week, and the true cause was masked behind three layers of autoscaling and reverse proxies.",
    investigation:
      "Our initial assumption was GPU memory bandwidth saturation during token decode. However, distributed OpenTelemetry traces across Envoy, the tokenizer worker, and model runtime revealed that 82% of the tail latency originated from head-of-line blocking inside the token scheduler: a single 3,800-token summarization request was monopolizing attention compute, forcing forty 35-token conversational turns into an idle FIFO queue.",
    architecture: {
      diagramType: "llm-serving",
      steps: [
        { title: "Client Stream Ingress", detail: "gRPC streaming via Envoy Gateway with connection pooling" },
        { title: "Prefix Hash Router", detail: "Routes matching system prompt prefixes to warm GPU workers" },
        { title: "Length-Aware Bucketing", detail: "Isolates short interactive turns (<128 tokens) from bulk prompts (>2k tokens)" },
        { title: "Continuous Batching", detail: "Interleaves prefill and decode iterations every step instead of static batching" },
        { title: "vLLM PagedAttention", detail: "Eliminates KV-cache memory fragmentation and enables dynamic page swapping" },
      ],
    },
    approach: [
      "Instrumented every hop with OpenTelemetry span propagation: gateway router, model server, and tokenizers.",
      "Identified that raw GPU compute was not the bottleneck; short requests were stuck behind massive prefill prompts.",
      "Introduced prefix-aware request bucketing and Radix-tree KV-cache reuse for repeated system prompts.",
      "Replaced fixed static batching with continuous iteration-level scheduling tuned to a target queue depth.",
      "Implemented chunked prefill so massive input prompts yield attention compute to ongoing token decodes.",
    ],
    results: [
      ["p99 latency", "4.2s → 680ms"],
      ["GPU utilisation", "38% → 71%"],
      ["Night pages", "0 for 6 months"],
    ],
    tradeoffs: [
      {
        alternative: "Static micro-batching (batch size 16)",
        rejectedBecause: "Caused execution bubbles on GPUs while waiting for the single slowest generation in the batch to emit <eos>.",
        acceptedTradeoff: "Continuous chunked prefill added ~3% scheduler CPU overhead but collapsed tail latency by 84%.",
      },
      {
        alternative: "Separate GPU clusters for short vs long prompts",
        rejectedBecause: "Dramatically underutilized long-prompt instances during off-peak hours and doubled standby hardware spend.",
        acceptedTradeoff: "Length-aware priority queues on shared nodes with preemption thresholds.",
      },
    ],
    codeSnippet: {
      title: "vLLM Engine Configuration & Prefix Caching",
      language: "python",
      code: `engine_args = AsyncEngineArgs(
    model="meta-llama/Llama-3.1-70B-Instruct",
    tensor_parallel_size=4,
    pipeline_parallel_size=1,
    max_num_batched_tokens=4096,
    max_num_seqs=256,
    enable_chunked_prefill=True,
    enable_prefix_caching=True,
    gpu_memory_utilization=0.92,
    block_size=16,
    swap_space=4, # 4GB CPU swap space for evicted KV blocks
)
# Radix-tree prefix cache reuse: hashes system prompt tokens
# Eliminates redundant prefill compute across conversational agents`,
    },
    stack: ["vLLM", "Triton", "Envoy", "Prometheus", "OpenTelemetry", "PyTorch"],
  },
  {
    slug: "hybrid-retrieval",
    category: "Search & Retrieval",
    metric: { value: "+34%", label: "nDCG@10" },
    year: "2025",
    title: "Hybrid retrieval beating pure vector search by 34%",
    summary: "BM25, dense vector retrieval, and a learned cross-encoder reranker tested against 12k labelled pairs.",
    tags: ["Search", "Evaluation", "FAISS", "Embeddings"],
    scaleStats: [
      { label: "Corpus Size", value: "14M documents" },
      { label: "Eval Dataset", value: "12,400 labeled pairs" },
      { label: "p95 Query Time", value: "42ms" },
      { label: "nDCG@10 Lift", value: "+34%" },
    ],
    problem:
      "A semantic search rollout across 14M enterprise documents performed worse than the legacy BM25 index on short keyword queries and exact part numbers. Users reported relevant documents missing on queries where keyword match was obvious, while embedding vectors collapsed distinct terms into identical centroids.",
    investigation:
      "We built an evaluation harness over 12,400 query-document pairs with relevance labels. The audit showed that 1536-dimensional dense embeddings excelled at conversational queries ('how do I reconfigure payment webhooks?') but severely underperformed on rare tokens, SKU numbers, and error codes where exact token overlap was critical.",
    architecture: {
      diagramType: "hybrid-retrieval",
      steps: [
        { title: "Query Ingress", detail: "Query normalization and lightweight intent classification" },
        { title: "Parallel Fanout", detail: "Dual retrieval: BM25 on Elasticsearch (top 100) + FAISS HNSW (top 100)" },
        { title: "Reciprocal Rank Fusion", detail: "Combines candidate lists with query-intent-weighted scoring" },
        { title: "Cross-Encoder Reranker", detail: "BGE-Reranker-Large scores top 50 candidates before final output" },
        { title: "Context Assembly", detail: "Top 8 chunks formatted with provenance metadata for model prompt" },
      ],
    },
    approach: [
      "Constructed an automated offline evaluation pipeline measuring MRR@10 and nDCG@10 against a golden ground truth.",
      "Quantified the failure modes: dense retrieval failed on rare vocabulary; BM25 failed on synonyms and natural questions.",
      "Combined lexical and dense retrieval using reciprocal rank fusion (RRF) with an adaptive weighting classifier.",
      "Implemented a two-stage retrieval pipeline: retrieve 100 candidates from each system, deduplicate, and rerank the top 50 with a fine-tuned cross-encoder.",
      "Optimized the cross-encoder using TensorRT-LLM with INT8 quantization to keep rerank latency under 20ms.",
    ],
    results: [
      ["nDCG@10 vs. vector only", "+34%"],
      ["nDCG@10 vs. BM25 only", "+21%"],
      ["Tail-query satisfaction", "+47% in A/B"],
    ],
    tradeoffs: [
      {
        alternative: "Fine-tuning embedding models for domain vocabulary",
        rejectedBecause: "Retraining 14M document vectors took 18 hours per release and still missed zero-shot part numbers.",
        acceptedTradeoff: "Hybrid BM25 + Dense dual indexing required 22% higher disk footprint but guaranteed 100% precision on exact keywords.",
      },
      {
        alternative: "Cross-encoder scoring directly over 500 candidates",
        rejectedBecause: "Cross-encoder inference took 190ms, violating the strict 50ms user-facing search SLO.",
        acceptedTradeoff: "Rerank only the top 50 candidates: captured 97.4% of the recall ceiling while meeting latency budgets.",
      },
    ],
    codeSnippet: {
      title: "Reciprocal Rank Fusion with Dynamic Intent Weighting",
      language: "python",
      code: `def reciprocal_rank_fusion(
    bm25_hits: list[str],
    vector_hits: list[str],
    k: int = 60,
    bm25_weight: float = 0.5
) -> list[tuple[str, float]]:
    """Combines BM25 and dense retrieval ranks with weighted RRF."""
    scores = defaultdict(float)
    vector_weight = 1.0 - bm25_weight

    for rank, doc_id in enumerate(bm25_hits):
        scores[doc_id] += bm25_weight / (k + rank + 1)

    for rank, doc_id in enumerate(vector_hits):
        scores[doc_id] += vector_weight / (k + rank + 1)

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)`,
    },
    stack: ["FAISS", "Elasticsearch", "FastAPI", "PyTorch", "HuggingFace", "Redis"],
  },
  {
    slug: "exactly-once-pipeline",
    category: "Distributed Systems",
    metric: { value: "0", label: "duplicates in 18 months" },
    year: "2024",
    title: "Zero duplicate-event incidents in 18 months",
    summary: "Exactly-once semantics across Kafka, PostgreSQL, and Redis processing 3.2M daily financial events.",
    tags: ["Streaming", "Consistency", "Kafka", "PostgreSQL"],
    scaleStats: [
      { label: "Daily Event Volume", value: "3.2M events" },
      { label: "Incident Rate", value: "0 duplicates" },
      { label: "End-to-End Latency", value: "115ms (p95)" },
      { label: "Synthetic Test Replays", value: "3,000,000" },
    ],
    problem:
      "Order and financial fulfillment events flowing from Kafka into downstream services caused duplicate side effects whenever consumer groups rebalanced or network partitions occurred. Distributed locking via Redis suffered from split-brain lock timeouts, costing real dollars in duplicate billing.",
    investigation:
      "We traced rebalance storms during Kubernetes node rolling upgrades: consumers crashed mid-batch, causing offset rollbacks. The application was performing non-atomic multi-resource writes: writing to Postgres first, and then failing to publish to Redis or webhooks, leading to inconsistent distributed state.",
    architecture: {
      diagramType: "outbox-cdc",
      steps: [
        { title: "Kafka Partition Consumer", detail: "Extracts message with source partition and monotonic offset" },
        { title: "PostgreSQL ACID TX", detail: "Atomic commit of business state + transactional outbox entry" },
        { title: "Debezium CDC", detail: "Tails PostgreSQL Write-Ahead Log (WAL) with zero locking overhead" },
        { title: "Fanout Dispatcher", detail: "Asynchronously broadcasts state changes to Redis projections and webhooks" },
        { title: "Deterministic Deduplication", detail: "Source-derived idempotency keys guarantee zero phantom side effects" },
      ],
    },
    approach: [
      "Replaced distributed Redis locks with a deterministic idempotency key derived from source Kafka topic, partition, and offset.",
      "Implemented the Transactional Outbox pattern: all state mutations and outbound event records committed in a single ACID PostgreSQL transaction.",
      "Used Debezium Change Data Capture (CDC) to stream commits from the PostgreSQL WAL log directly to downstream fan-out queues.",
      "Treated Redis and webhook dispatchers as derived projections of PostgreSQL rather than primary sources of truth.",
      "Validated the architecture under chaos testing: injected 3M synthetic events with random consumer kills, network splits, and broker restarts.",
    ],
    results: [
      ["Duplicate-event incidents", "0 in 18 months"],
      ["Reconciliation runs", "Nightly → weekly"],
      ["Data inconsistency alerts", "Dropped to 0"],
    ],
    tradeoffs: [
      {
        alternative: "Two-Phase Commit (2PC) or XA transactions",
        rejectedBecause: "Coordinator crashes during Phase 2 left transaction locks indefinitely hanging across nodes.",
        acceptedTradeoff: "Transactional Outbox with Debezium CDC introduced ~60ms eventual consistency latency but guaranteed 100% data durability.",
      },
      {
        alternative: "Downstream client-generated UUID idempotency keys",
        rejectedBecause: "Flaky mobile clients generated fresh UUIDs on each retry, completely invalidating the deduplication check.",
        acceptedTradeoff: "Derive idempotency keys deterministically from immutable source partition offsets.",
      },
    ],
    codeSnippet: {
      title: "Postgres Outbox & Idempotency Table Transaction",
      language: "sql",
      code: `-- Single atomic transaction ensures zero orphaned side-effects
BEGIN;

INSERT INTO idempotency_log (idempotency_key, processed_at, partition_offset)
VALUES ($1, NOW(), $2)
ON CONFLICT (idempotency_key) DO NOTHING;

-- If idempotency insertion was successful, execute state update:
UPDATE accounts SET balance = balance - $3 WHERE account_id = $4;

-- Write outbox message for Debezium CDC tailing:
INSERT INTO transactional_outbox (event_id, event_type, payload, created_at)
VALUES (gen_random_uuid(), 'ACCOUNT_DEBITED', $5, NOW());

COMMIT;`,
    },
    stack: ["Kafka", "PostgreSQL", "Debezium", "Go", "Docker", "Prometheus"],
  },
  {
    slug: "monolith-decomposition",
    category: "Distributed Systems",
    metric: { value: "11", label: "services extracted" },
    year: "2023–24",
    title: "Splitting a 400k-line monolith with zero downtime",
    summary: "11 microservices extracted in 9 months without a single customer-facing outage. Deploy cadence up 4×.",
    tags: ["Architecture", "Migration", "Go", "Java"],
    scaleStats: [
      { label: "Monolith Size", value: "420,000 LOC" },
      { label: "Services Split", value: "11 microservices" },
      { label: "Customer Outages", value: "0 minutes" },
      { label: "Deploy Frequency", value: "4× acceleration" },
    ],
    problem:
      "A ten-year-old monolith owned the primary revenue write path. Six engineering teams were blocked every sprint on monolithic deploy queues, regression testing took 4 days, and previous extraction attempts had stalled due to tangled database dependencies.",
    investigation:
      "Static analysis showed over 40 cross-module cyclic dependencies. We instrumented runtime call-graph tracing in production for two weeks to identify true runtime domain boundaries rather than theoretical organizational boundaries.",
    architecture: {
      diagramType: "strangler-fig",
      steps: [
        { title: "Envoy Ingress Gateway", detail: "Dynamic route splitting and header-based traffic steering" },
        { title: "Shadow Traffic Mirroring", detail: "100% live request replication to new services without impacting production" },
        { title: "Response Diff Engine", detail: "Asynchronously verifies identical JSON responses, status codes, and headers" },
        { title: "CDC Data Sync", detail: "Debezium streams data bidirectional until legacy tables are deprecated" },
        { title: "Gradual Canary Cutover", detail: "Progressive rollouts (1% → 10% → 100%) with automated rollbacks" },
      ],
    },
    approach: [
      "Mapped bounded contexts using actual runtime call-graphs and SQL query logs rather than outdated wiki docs.",
      "Employed the Strangler Fig pattern behind an Envoy ingress gateway with runtime path routing.",
      "Implemented automated shadow traffic mirroring and response diffing to verify zero behavioral deviations between old and new services.",
      "Synchronized database state with CDC event streaming, completely avoiding high-risk dual writes.",
      "Executed cutovers using progressive canaries with automated circuit breakers.",
    ],
    results: [
      ["Services extracted", "11 in 9 months"],
      ["Deploy frequency", "4× increase"],
      ["Customer-visible incidents", "0"],
    ],
    tradeoffs: [
      {
        alternative: "Dual-writing from application code during transition",
        rejectedBecause: "Partial network failures during dual-writes created silent data drift that required manual database patching.",
        acceptedTradeoff: "Database-level CDC streaming: required temporary replica infrastructure but guaranteed zero data loss.",
      },
      {
        alternative: "Big-bang release over a scheduled maintenance weekend",
        rejectedBecause: "High blast radius: a single undetected bug would force a painful rollback and downtime.",
        acceptedTradeoff: "Shadow mirroring and incremental canary routing: extended the migration timeline by 6 weeks but had zero downtime.",
      },
    ],
    codeSnippet: {
      title: "Envoy Shadow Mirroring & Dynamic Canary Route",
      language: "yaml",
      code: `routes:
  - match: { prefix: "/api/v2/orders" }
    route:
      cluster: legacy_monolith_cluster
      # Shadow mirror copies 100% of live traffic for asynchronous diffing
      request_mirror_policies:
        - cluster: new_go_orders_cluster
          runtime_fraction:
            default_value:
              numerator: 100
              denominator: HUNDRED`,
    },
    stack: ["Java", "Spring", "Go", "AWS", "Terraform", "Envoy", "PostgreSQL"],
  },
  {
    slug: "cloud-cost",
    category: "Cloud & Cost",
    metric: { value: "−42%", label: "cloud spend" },
    year: "2023",
    title: "Cutting cloud spend 42% without slowing delivery",
    summary: "Granular cost attribution uncovered that three workloads consumed 60% of compute capacity.",
    tags: ["Cost", "Infrastructure", "Kubernetes", "AWS"],
    scaleStats: [
      { label: "Spend Reduction", value: "42% ($640k/yr)" },
      { label: "p95 Latency", value: "Unchanged" },
      { label: "Spot Adoption", value: "70% of batch compute" },
      { label: "Target Workloads", value: "3 primary services" },
    ],
    problem:
      "Cloud infrastructure bills were outpacing revenue growth. Leadership mandated a 30% reduction within two quarters, but platform engineers feared aggressive downscaling would trigger SLO regressions and slow product velocity.",
    investigation:
      "We built an automated cost-attribution pipeline combining Kubernetes metrics, AWS Cost and Usage Reports (CUR), and OpenTelemetry traces. The audit revealed that 60% of compute was eaten by just three workloads with bloated CPU/memory reservations that rarely exceeded 12% actual utilization.",
    architecture: {
      diagramType: "cost-pipeline",
      steps: [
        { title: "Metric Ingestion", detail: "Prometheus scrapes per-pod resource utilization and node allocations" },
        { title: "Cost Attribution Engine", detail: "Correlates AWS CUR line items with Kubernetes namespaces and team tags" },
        { title: "VPA Recommendation Mode", detail: "Computes 14-day rolling p95 CPU and memory utilization limits" },
        { title: "Automated GitOps PRs", detail: "Proposes right-sized resource requests directly in Helm repositories" },
        { title: "Spot Fleet Migration", detail: "Moves batch ML inference and ETL jobs to spot instances with checkpointing" },
      ],
    },
    approach: [
      "Deployed an attribution pipeline that tagged every workload by team, feature, and environment in Athena.",
      "Identified that three background ETL and model preparation pipelines were provisioned for unneeded peak headroom.",
      "Ran Vertical Pod Autoscaler (VPA) in recommendation mode for 14 days to calculate safe resource boundaries.",
      "Migrated batch training and asynchronous inference to EC2 Spot instances with automatic checkpointing and graceful drain handlers.",
      "Right-sized overprovisioned RDS instances using read replicas with auto-scaling connection pools.",
    ],
    results: [
      ["Total cloud spend", "−42% ($640k/year)"],
      ["p95 latency", "Unchanged across all tiers"],
      ["Spot recovery time", "<45s on termination"],
    ],
    tradeoffs: [
      {
        alternative: "VPA Auto mode with live pod evictions",
        rejectedBecause: "Mid-day pod evictions caused dropped client WebSocket connections and transient latency spikes.",
        acceptedTradeoff: "VPA Recommendation Mode with automated weekly GitOps PRs: preserved developer ownership while achieving targets.",
      },
      {
        alternative: "Enforcing aggressive downscaling across all 50+ microservices",
        rejectedBecause: "High developer friction and marginal ROI on small long-tail microservices.",
        acceptedTradeoff: "80/20 rule: focused 90% of effort on the 3 elephant workloads responsible for 60% of the bill.",
      },
    ],
    codeSnippet: {
      title: "VerticalPodAutoscaler Recommendation Policy",
      language: "yaml",
      code: `apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: order-processor-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: order-processor
  updatePolicy:
    updateMode: "Off" # Recommendation-only mode to prevent disruptive pod evictions
  resourcePolicy:
    containerPolicies:
      - containerName: '*'
        minAllowed:
          cpu: "250m"
          memory: "512Mi"
        maxAllowed:
          cpu: "4000m"
          memory: "8Gi"
        controlledResources: ["cpu", "memory"]`,
    },
    stack: ["Kubernetes", "AWS", "Athena", "Terraform", "Prometheus", "Helm"],
  },
];

export const findWork = (slug) => work.find((w) => w.slug === slug);
