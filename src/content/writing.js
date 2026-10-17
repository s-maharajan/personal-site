// Published technical essays, architecture reviews, and production deep-dives.
export const articles = [
  {
    slug: "why-rag-hallucinates-chunking",
    title: "Why your RAG is hallucinating: it's the chunker",
    topic: "Retrieval",
    date: "October 2025",
    readTime: "6 min read",
    summary:
      "Vector embeddings cannot rescue semantically broken context windows. Why boundary-aware hierarchical chunking beats naive token-window splitting every single time.",
    excerpt:
      "When a retrieval-augmented generation (RAG) system hallucinates, teams almost universally blame either the embedding model or the LLM. In 80% of production audits, the culprit is neither: it's the dumb 512-token sliding window that sliced a critical conditional clause in half.",
    content: [
      {
        heading: "The Sliding Window Illusion",
        body: `Most early RAG pipelines start with a default RecursiveCharacterTextSplitter: chunk size 512 tokens, overlap 50 tokens. It looks clean, requires zero domain knowledge, and embeds quickly.

In production, however, documents are not uniform streams of tokens. They are structured trees of meaning: headings, caveats, exceptions, tables, and conditional logic. When a sliding window splits a contract between 'The licensee shall not owe royalties' and 'if the gross revenue fails to meet Section 4 thresholds', the embedding model encodes a flat untruth. The vector index happily returns that fragment to the LLM, and the LLM faithfully hallucinates a false answer.`,
      },
      {
        heading: "Semantic Fragmentation in High-Dimensional Space",
        body: `Dense embedding models (like text-embedding-3-large or BGE) compress a block of text into a single vector centroid. If 60% of your chunk is boilerplate table markup and 40% is the actual paragraph, the vector centroid drifts toward generic markup.

When we audited 12,000 failure queries in our search evaluation harness, over 70% of misses were chunks where the context was present in the raw document, but the chunk itself lacked the subject noun or parent heading because the sentence had been severed across a boundary.`,
      },
      {
        heading: "The Fix: Hierarchical Document Trees & Boundary-Aware Chunking",
        body: `The production-grade solution is to never store raw flat chunks without document ancestry. Instead, parse documents into an AST (Abstract Syntax Tree):

1. **Document Hierarchy Preservation**: Every chunk retains a metadata breadcrumb of its parent hierarchy (e.g., 'Document > Section 3.2 > Exceptions > Royalty Calculation').
2. **Context Enrichment at Index Time**: Prepend the immediate parent heading to the chunk before computing the dense embedding vector.
3. **Small-to-Big Retrieval**: Index small, high-density leaf chunks (128 tokens) for vector similarity, but return the larger parent container (1024 tokens) to the model context window. This ensures pinpoint vector accuracy while giving the LLM the complete surrounding thought.`,
      },
      {
        heading: "Production Takeaways",
        body: `Before you spend weeks fine-tuning an embedding model or swapping from 8B to 70B models, look at what your chunker actually produces. Print out 50 random chunks from your vector store. If a human engineer cannot confidently answer the query with only that chunk in front of them, your LLM has zero chance.`,
      },
    ],
  },
  {
    slug: "quantization-without-tears",
    title: "Quantization without tears: FP8 vs AWQ in production",
    topic: "Inference",
    date: "August 2025",
    readTime: "7 min read",
    summary:
      "A battle-tested guide to serving 70B parameter models on commodity GPU clusters without degrading output perplexity or breaking agent schemas.",
    excerpt:
      "Serving unquantized FP16 weights on 70B models requires multi-node tensor parallelism that eats operational budgets alive. Here is how we evaluated FP8 versus AWQ (Activation-aware Weight Quantization) in high-throughput inference.",
    content: [
      {
        heading: "The GPU Memory Wall",
        body: `A 70-billion parameter model in 16-bit precision requires ~140 GB of VRAM purely for model weights. Before factoring in the KV-cache, an 80 GB A100 or H100 cannot hold it; you immediately need two to four GPUs in a tensor-parallel configuration.

Tensor parallelism introduces inter-GPU communication across NVLink or PCIe. While raw compute is fast, GPU communication overhead grows quickly under high concurrency. Quantization is the only lever that drops memory footprint, fits larger models on fewer cards, and dramatically accelerates memory-bandwidth-bound decoding.`,
      },
      {
        heading: "Weight-Only vs Weight-and-Activation Quantization",
        body: `AWQ (Activation-aware Weight Quantization) quantizes weights to 4-bit integer (INT4) while maintaining activations in FP16. By identifying and protecting the top 1% of salient weights whose activations spike, AWQ preserves perplexity remarkably well.

However, during high-batch decoding, modern Hopper GPUs (H100/H200) feature dedicated FP8 Tensor Cores. FP8 quantizes both weights and activations to 8-bit floating point (E4M3 or E5M2). The compute units execute matrix multiplications natively in FP8, yielding a 2× theoretical compute speedup over FP16, whereas INT4 weight-only quantization must unpack weights back to FP16 before the ALU compute step.`,
      },
      {
        heading: "Production Benchmarks: Which One Wins?",
        body: `In our production benchmarks on vLLM with Llama-3-70B:
- **AWQ (INT4)**: Allowed running a 70B model on a single 80GB card. Throughput peaked at modest concurrencies (QPS < 30). Ideal for low-traffic endpoints and batch offloading.
- **FP8 (Native Hopper)**: Required two H100s instead of one, but delivered 2.8× higher sustained token generation throughput at 100+ concurrent requests. Furthermore, JSON schema compliance and agent tool-calling accuracy remained indistinguishable from unquantized FP16 (within 0.3% error).`,
      },
      {
        heading: "Rule of Thumb for Platform Engineers",
        body: `If your primary constraint is minimum cost-per-instance and moderate throughput: use AWQ. If your primary goal is maximizing tokens-per-second-per-dollar under heavy sustained load on modern hardware: native FP8 is the undisputed winner.`,
      },
    ],
  },
  {
    slug: "head-of-line-blocking-llm-batching",
    title: "The Head-of-Line Blocking Trap in Continuous Batching",
    topic: "Inference",
    date: "July 2025",
    readTime: "8 min read",
    summary:
      "Why mixing 4k-token document summarization with 50-token chatbot turns destroys tail latency, and how iteration-level chunked prefill fixes it.",
    excerpt:
      "When continuous batching arrived, we thought scheduling was solved. In reality, a massive prefill iteration can stall dozens of ongoing decode streams for 800 milliseconds, turning a snappy 50ms time-to-first-token into an on-call nightmare.",
    content: [
      {
        heading: "The Asymmetry of Prefill and Decode",
        body: `LLM inference consists of two fundamentally distinct phases:
1. **Prefill (Prompt Processing)**: Highly parallelizable, compute-bound matrix multiplications that saturate every tensor core.
2. **Decode (Token Generation)**: Sequential, memory-bandwidth-bound operations where the entire model weights must be streamed through the memory bus for every single generated token.

When a 4,000-token prompt enters a standard continuous batching scheduler, the engine attempts to process all 4,000 tokens in a single forward pass. This prefill kernel monopolizes the GPU for hundreds of milliseconds, blocking all ongoing decode streams in the same batch from emitting their next token.`,
      },
      {
        heading: "Measuring the Blast Radius",
        body: `In our production telemetry, we observed that while median token generation latency was 28ms, the p99 spiked to 1,200ms whenever a heavy document analysis request landed on the pod. The conversational users experienced visible UI stuttering and websocket timeouts.

The root cause: the scheduler had no prefill budget limit. A single giant prompt was starving 40 small conversational streams.`,
      },
      {
        heading: "Chunked Prefill: Splitting Prompts Across Iterations",
        body: `The modern architectural pattern to prevent this is **Chunked Prefill**:
- Instead of computing a 4,000-token prompt in one massive pass, chunk it into slices of 512 tokens.
- On iteration 1: execute 512 tokens of the prefill alongside 32 decode tokens.
- On iteration 2: execute the next 512 tokens of the prefill alongside the next 32 decode tokens.

By capping \`max_num_batched_tokens\` (e.g. at 2,048 or 4,096 tokens per step), the GPU execution time per iteration remains bounded under 40ms. Tail latency collapses from 4.2s down to 680ms with negligible throughput degradation.`,
      },
    ],
  },
  {
    slug: "deterministic-outbox-kafka-cdc",
    title: "Deterministic Replication: The PostgreSQL Outbox to Kafka Pipeline",
    topic: "Distributed Systems",
    date: "June 2025",
    readTime: "9 min read",
    summary:
      "Dual-writes to databases and message queues are guaranteed to produce silent data corruption. How we built zero-loss CDC outbox replication.",
    excerpt:
      "Every junior architect tries to write to PostgreSQL and publish to Kafka inside the same HTTP handler. Network partitions, crashes between step A and B, and rollback inconsistencies will corrupt your downstream state.",
    content: [
      {
        heading: "The Dual-Write Anti-Pattern",
        body: `Consider the naive pattern:
\`\`\`go
func HandleOrder(order Order) error {
    tx := db.Begin()
    if err := tx.Save(&order); err != nil { return err }
    if err := kafka.Publish("orders", order); err != nil {
        tx.Rollback() // What if Rollback fails? What if the network times out?
        return err
    }
    return tx.Commit() // What if Commit fails after Kafka published?
}
\`\`\`
There is no two-phase commit between PostgreSQL and Apache Kafka without intolerable latency and distributed deadlock hazards. If the database commits but the network to Kafka drops, the downstream systems miss the event forever. If Kafka accepts the message but the database commit aborts on a serialization conflict, the downstream systems process a ghost transaction.`,
      },
      {
        heading: "The Transactional Outbox Pattern",
        body: `The architectural fix is atomicity within the local database engine:
1. Write the domain entity (e.g., \`orders\`) and an event record into an \`outbox_events\` table within the exact same ACID database transaction.
2. If the transaction commits, both records are guaranteed to exist on disk in the Write-Ahead Log (WAL). If it aborts, neither exists.
3. A separate CDC worker reads the PostgreSQL WAL stream using logical decoding (\`pgoutput\`) and streams the outbox records to Kafka with exact partition keys.`,
      },
      {
        heading: "Handling Schema Evolution and High Throughput",
        body: `In our production deployment processing 3.2M daily transactions:
- We avoided polling queries (\`SELECT * FROM outbox WHERE sent = false\`) which create massive index bloat and table lock contention.
- We used dedicated logical replication slots that stream WAL changes at under 15ms latency.
- Consumers use deterministic deduplication idempotency keys (\`event_id\`) stored in Redis with an atomic TTL to guarantee exact-once downstream processing even during failovers.`,
      },
    ],
  },
  {
    slug: "reciprocal-rank-fusion-real-world",
    title: "Reciprocal Rank Fusion: Why Vector-Only Search Fails at Scale",
    topic: "Retrieval",
    date: "May 2025",
    readTime: "7 min read",
    summary:
      "Comparing BM25, dense embeddings, and cross-encoders across 14M enterprise records: why hybrid RRF delivers +34% relevance gains.",
    excerpt:
      "Semantic vector search is brilliant for fuzzy conversational questions, but disastrous for alphanumeric part numbers, error codes, and legal terms. How to combine lexical and semantic retrieval with reciprocal rank fusion.",
    content: [
      {
        heading: "The Semantic Drift of Vector Embeddings",
        body: `Dense vector embeddings project documents into high-dimensional geometric space where conceptual similarity equals cosine distance. This is extraordinary when someone searches for 'ways to cancel a contract' and finds documents talking about 'termination clauses'.

However, when an engineer searches for error code \`ERR_CONN_RESET_4032\`, vector models fail. Because the specific token is rare in the training corpus, the embedding model places it near generic network errors, returning documents about DNS timeouts and TLS handshakes. Meanwhile, classic BM25 lexical search finds the exact match in 4 milliseconds.`,
      },
      {
        heading: "Reciprocal Rank Fusion (RRF) Architecture",
        body: `Rather than normalizing raw scores (which are calibrated completely differently between BM25 and cosine distance), RRF uses rank position:
\`\`\`
RRF_Score(d) = Σ [ 1 / (k + rank_i(d)) ]
\`\`\`
where \`k\` is a smoothing constant (typically 60) and \`rank_i(d)\` is the position of document \`d\` in search system \`i\`.
This guarantees that a document appearing in the top 3 of both lexical and vector results rises to the top, while protecting against score distortion from outlier vector distances.`,
      },
      {
        heading: "The Two-Stage Pipeline in Production",
        body: `In our production pipeline across 14 million documents:
1. **Stage 1 (Parallel Fanout)**: Query BM25 (Elasticsearch) and Dense Vector Index (FAISS HNSW) in parallel, retrieving top 100 candidates from each.
2. **Stage 2 (RRF Merge)**: Merge candidate lists via RRF to produce top 40 candidates.
3. **Stage 3 (Cross-Encoder Reranking)**: Pass the top 40 candidates through a lightweight BGE-Reranker model that scores full cross-attention between query and passage.

This three-stage pipeline elevated nDCG@10 by 34% while keeping p95 latency under 45ms.`,
      },
    ],
  },
  {
    slug: "evals-before-models",
    title: "Evals before models: building a continuous LLM regression harness",
    topic: "Evaluation",
    date: "April 2025",
    readTime: "5 min read",
    summary:
      "Why synthetic test suites fail and how deterministic assertion cascades caught 92% of regressions before canary deployment.",
    excerpt:
      "If you cannot measure whether a prompt or model change degraded quality in 5 minutes, you cannot iterate safely. How to design a CI/CD evaluation harness that runs on every pull request.",
    content: [
      {
        heading: "The 'Eyeball Test' Is An Operational Liability",
        body: `When changing system prompts, fine-tuning weights, or updating few-shot exemplars, most teams test five queries in a playground, declare 'it feels better', and merge the pull request. Three days later, customer support escalates that a specific edge case in date parsing broke for hundreds of users.

Evaluating generative models requires treating evaluation as a continuous regression suite, not a post-hoc analysis.`,
      },
      {
        heading: "Deterministic Cascades vs LLM-as-a-Judge",
        body: `Many teams jump straight to 'LLM-as-a-Judge' using GPT-4. While helpful, LLM-as-a-Judge is slow, expensive ($50 per test suite run), non-deterministic, and prone to positional and leniency bias.

We built our CI evaluation pipeline as an tiered assertion cascade:
1. **Tier 1: Deterministic Syntax & Schema Check (0ms, $0)**: Verifies valid JSON, Pydantic schema validation, required fields, and regex assertions. Catches 40% of regressions instantly.
2. **Tier 2: Fact Extraction & Grounding (10ms, $0)**: Verifies that cited entity IDs, currency amounts, and dates actually existed in the provided context documents.
3. **Tier 3: Semantic Metric Distillation (100ms, $0.001)**: Computes BERTScore or cross-encoder similarity against golden references.
4. **Tier 4: Targeted LLM Judge (Only on passing candidates)**: Invokes an LLM judge with narrow, rubrics-based binary questions ('Did the response hallucinate an unsupported assumption? Yes/No') rather than a vague 1-to-5 rating.`,
      },
      {
        heading: "Integrating into GitHub Actions",
        body: `By caching prompt inputs and running deterministic assertions locally, our test suite runs in under 90 seconds on every branch push. Regressions in agent tool invocation or schema emission are blocked before they ever reach a staging environment.`,
      },
    ],
  },
  {
    slug: "agents-services-bad-memory",
    title: "Agents are services with bad memory",
    topic: "Agents",
    date: "February 2025",
    readTime: "6 min read",
    summary:
      "Treating agent execution loops as distributed state machines with idempotency keys, durable checkpoints, and state graphs.",
    excerpt:
      "Too many agent architectures are written as brittle while-loops that crash when a network socket disconnects. Here is how to architect resilient, long-running agentic services.",
    content: [
      {
        heading: "The Brittle While Loop",
        body: `The prototype pattern for an agent is:
\`\`\`python
while not done:
    action = model.generate(history)
    result = execute_tool(action)
    history.append(result)
\`\`\`
In production, this pattern is catastrophic. If the process crashes on step 4, the entire trajectory is lost. If an external API tool times out, the agent may retry and execute a side effect twice (e.g. charging a credit card or provisioning a VM).`,
      },
      {
        heading: "Agents As Durable Distributed State Machines",
        body: `To make an agent reliable, treat each step as a state transition in a directed graph:
- **Durable Checkpointing**: Every iteration saves its state snapshot (the graph state, step index, tool arguments, and execution status) into a durable store like PostgreSQL or Redis before invoking a tool.
- **Idempotency Keys**: Every outbound tool invocation receives an idempotency key derived from \`\${workflow_id}:\${step_index}\`. If the worker crashes and resumes, downstream services reject duplicate executions.
- **Human-in-the-Loop Interrupts**: Interruptible state transitions allow long-running workflows to pause, notify an approver on Slack, and safely resume without keeping an in-memory thread alive for hours.`,
      },
      {
        heading: "The Memory Tiering Strategy",
        body: `Do not dump entire conversation histories into context windows. Structure agent memory into three distinct tiers:
1. **Working Memory (Scratchpad)**: Transient token buffer for the immediate step.
2. **Episodic Memory**: Checkpointed state machine log tracking past tool outputs and branch decisions.
3. **Semantic Long-Term Memory**: Vector and key-value store queryable on-demand through explicit retrieval tools.`,
      },
    ],
  },
  {
    slug: "p99-tail-latency-tax",
    title: "The Tail Latency Tax: Debugging p99 Spikes Across gRPC & Kernel Swapping",
    topic: "Observability",
    date: "January 2025",
    readTime: "8 min read",
    summary:
      "How we tracked a 3-second periodic latency spike down through Envoy connection pools, Linux CFS CPU throttling, and Go GC stop-the-world pauses.",
    excerpt:
      "A service with a 15ms median response time can still breach SLA if 1 in 100 requests hangs for 3 seconds. Here is how we instrumented eBPF and distributed traces to eliminate invisible tail latency.",
    content: [
      {
        heading: "The Deceptive Allure of Median Latency",
        body: `Engineers often look at p50 or average latency dashboards and conclude their systems are fast. But in microservice architectures where a single user request fans out across 20 downstream RPCs, the probability of hitting at least one p99 response is:
\`\`\`
P(encountering p99) = 1 - (0.99)^20 ≈ 18.2%
\`\`\`
Nearly 1 in 5 user transactions will hit a tail latency penalty. Tail latency is not an anomaly; it is the dominant user experience at scale.`,
      },
      {
        heading: "The Ghost in the Metrics: CFS CPU Throttling",
        body: `During an incident audit on our payment gateway, we observed periodic 2,800ms latency spikes occurring exactly every 100ms under moderate load. Application code metrics showed no slow database queries or lock contention.

By attaching eBPF probes to the Linux kernel CFS (Completely Fair Scheduler), we discovered Kubernetes CPU limits were actively throttling the container. When multiple requests arrived concurrently, the Go runtime spawned OS threads that burned through the pod's 100ms CFS quota in 15ms. The kernel froze all threads for the remaining 85ms of the epoch. Removing aggressive CPU limits and sizing by memory requests alone instantly eliminated the recurring spikes.`,
      },
      {
        heading: "Envoy Connection Pooling and TCP Keep-Alives",
        body: `The remaining tail latency was caused by TCP handshake overhead and TLS renegotiation during sudden traffic surges. By configuring Envoy with warm connection pools, HTTP/2 connection multiplexing, and TCP keep-alive probes, we cut connection setup latency from 65ms to 0ms on the critical path.`,
      },
    ],
  },
];

export const findArticle = (slug) => articles.find((a) => a.slug === slug);
