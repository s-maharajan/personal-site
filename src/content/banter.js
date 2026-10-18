// Byte-sized banter, unvarnished systems truths, and lessons from production incidents.
export const banterPosts = [
  {
    slug: "the-microservices-on-day-1-tax",
    title: "The 'Microservices on Day 1' Tax",
    date: "October 16, 2026",
    readTime: "2 min read",
    tag: "Architecture",
    take:
      "If your 5-person engineering team is managing 28 microservices, Kubernetes Helm charts, Envoy sidecars, and Kafka schema registries for an app doing 80 QPS, you haven't built an architecture; you've built a full-time infrastructure maintenance team that writes business features on weekends.",
  },
  {
    slug: "stop-blaming-the-llm-for-chunking-sins",
    title: "Stop Blaming the LLM for Chunking Sins",
    date: "October 11, 2026",
    readTime: "2 min read",
    tag: "Retrieval",
    take:
      "If you take a 10-page credit agreement, slice it blindly every 512 tokens with a 50-token sliding window, and ask the model 'What are the default penalties?', the LLM will hallucinate because you literally sawed the penalty clause away from the definition of default. Embed document trees, not flat token strips.",
  },
  {
    slug: "kafka-is-not-a-database",
    title: "Kafka Is an Event Log, Not Your Analytical Database",
    date: "September 24, 2026",
    readTime: "2 min read",
    tag: "Distributed Systems",
    take:
      "The moment someone asks 'Can we query Kafka by user_id across the last 90 days?', the architectural answer is an immediate NO. Kafka is an immutable ordered log designed for high-throughput sequential reads and event replication. Stream it to ClickHouse or PostgreSQL for querying; do not build Frankenstein ksqlDB state stores that collapse on broker restarts.",
  },
  {
    slug: "observability-is-not-400-dashboards",
    title: "Observability Is Not Having 400 Unchecked Dashboards",
    date: "September 04, 2026",
    readTime: "2 min read",
    tag: "Observability",
    take:
      "Real observability is being able to ask a novel question during an ongoing production incident—one you never anticipated when writing the code—and get an answer in 60 seconds from distributed traces and high-cardinality span attributes without needing to redeploy with log.Printf statements.",
  },
  {
    slug: "gpu-utilization-lies",
    title: "Your GPU Utilization Metric Is Lying to You",
    date: "October 14, 2026",
    readTime: "2 min read",
    tag: "Inference",
    take:
      "When nvidia-smi shows '94% GPU Utilization', engineers celebrate that their cluster is fully loaded. It's almost always a delusion. nvidia-smi utilization only measures the fraction of time that *at least one kernel* was active on the GPU. During token decoding, your tensor cores are 90% idle, starved of compute while waiting on high-bandwidth memory (HBM) transfers. Look at SM active percentage and memory bandwidth saturation instead, or prepare for a nasty surprise when you try to scale batch concurrency.",
  },
  {
    slug: "stop-putting-2k-system-prompts-on-every-turn",
    title: "Stop Putting 2,000-Token System Prompts on Every Single Turn",
    date: "October 03, 2026",
    readTime: "3 min read",
    tag: "Architecture",
    take:
      "I see agent frameworks pass a 2,500-token system prompt containing entire JSON schemas, company policies, and five-shot exemplars on every tool execution step in a 12-turn loop. That's 30,000 prefill tokens for a 400-token conversation. If you aren't using Radix-tree prefix cache reuse with strict prompt alignment, you are literally burning cash and locking up your decode queues with redundant prefill computation.",
  },
  {
    slug: "postgres-until-10m",
    title: "Use PostgreSQL with pgvector Until You Hit 10M Vectors",
    date: "September 18, 2026",
    readTime: "2 min read",
    tag: "Storage",
    take:
      "Before you provision an expensive dedicated vector database cluster with its own authentication, backup routines, and consistency lag, ask yourself: how many rows do you actually have? With pgvector's HNSW index, PostgreSQL handles 2 million 1536-dimensional vectors with sub-15ms p95 query times right alongside your relational metadata in ACID transactions. Don't pay the multi-database consistency tax until scale forces your hand.",
  },
  {
    slug: "if-no-idempotency-key-not-distributed",
    title: "If It Doesn't Have an Idempotency Key, It Isn't Distributed",
    date: "August 29, 2026",
    readTime: "3 min read",
    tag: "Reliability",
    take:
      "Networks fail, TCP sockets drop, and downstream proxies retry. If your POST endpoint or asynchronous message consumer doesn't require a unique idempotency key with a deterministic atomic check-and-set in Redis or Postgres, your 'at-least-once' messaging guarantee is just a polite euphemism for 'duplicate charges waiting to happen on Black Friday'.",
  },
  {
    slug: "the-microservices-tax-at-5k-qps",
    title: "The Microservices Tax at 5,000 QPS",
    date: "August 11, 2026",
    readTime: "3 min read",
    tag: "Systems",
    take:
      "A monolithic in-memory function call takes 12 nanoseconds. A single gRPC round-trip across Kubernetes pods over Envoy with TLS termination and deserialization takes 2.8 milliseconds. When a single checkout request fans out into 14 microservices in a DAG, you didn't build high availability; you built an un-debuggable distributed tail latency generator.",
  },
  {
    slug: "static-micro-batching-is-dead",
    title: "Static Micro-Batching Is Dead: Why Iteration Scheduling Won",
    date: "July 24, 2026",
    readTime: "2 min read",
    tag: "Inference",
    take:
      "In traditional deep learning inference, you waited for batch size N to arrive, ran the forward pass together, and returned the results. In generative LLMs, one request emits 12 tokens while another emits 1,800 tokens. Static batching forces the 12-token user to sit idle for 4 seconds waiting for the 1,800-token generation to finish. Continuous batching with iteration-level prefill chunking is the only architecture that holds up under asymmetric request lengths.",
  },
  {
    slug: "the-cheapest-model-isnt-cheap",
    title: "The Cheapest Model Isn't Cheap If It Takes Four Turns",
    date: "June 30, 2026",
    readTime: "2 min read",
    tag: "AI Agents",
    take:
      "Engineers obsess over input token pricing: '$0.15 per million vs $3.00 per million'. But when the cheap model hallucinates tool arguments, misses JSON formatting, and requires four round trips plus error correction prompts to complete a task that a flagship model nails on turn one, you paid more in total latency, token volume, and engineering triage than the premium model would have cost in the first place.",
  },
  {
    slug: "write-evals-before-tuning-prompts",
    title: "Write Evals Before You Touch the Temperature Slider",
    date: "June 12, 2026",
    readTime: "2 min read",
    tag: "Evaluation",
    take:
      "Tuning an LLM prompt by manually testing three inputs in a playground and saying 'looks better' is the 2026 equivalent of debugging distributed concurrency bugs with sleep(5). Without an automated regression harness testing 200 edge cases on every commit, every prompt optimization you make is just reshuffling where the failure modes occur.",
  },
];
