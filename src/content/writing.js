// Published technical essays and deep-dives.
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
    slug: "evals-before-models",
    title: "Evals before models: building a continuous LLM regression harness",
    topic: "Evaluation",
    date: "May 2025",
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
    date: "January 2025",
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
];

export const findArticle = (slug) => articles.find((a) => a.slug === slug);
