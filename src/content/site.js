// Everything personal about the site lives here.
export const site = {
  name: "Som",
  fullName: "Somasundaram Maharajan",
  role: "Principal Engineer · Distributed Systems & AI Infrastructure",
  location: "Remote / London & Worldwide",
  tagline: "Architecting distributed platforms & AI infrastructure that hold up at p99.",
  intro:
    "I'm a Principal Systems and AI Infrastructure Engineer with over a decade of track record designing and scaling mission-critical platforms: high-throughput LLM serving runtimes, prefix-aware KV-cache routers, hybrid retrieval engines, and deterministic transactional CDC pipelines. I write about architecture trade-offs, real production failures, and benchmarks that matter.",
  bio: [
    "Over the past 10+ years, I've designed and scaled systems that handle millions of daily events, tens of thousands of tokens per second, and strict sub-second p99 tail latency SLAs.",
    "My focus centers on the intersection of distributed consensus and production AI infrastructure: low-latency model inference runtimes (vLLM, Triton), Radix KV-cache reuse, hybrid retrieval architectures (BM25 + FAISS + cross-encoders), and reliable event streaming (Kafka, PostgreSQL CDC).",
  ],
  stats: [
    { label: "p99 Tail Latency Cut", value: "6×" },
    { label: "Daily Transactions", value: "3.2M+" },
    { label: "Peak Model Serving", value: "62k tok/s" },
    { label: "Duplicate Events", value: "0" },
  ],
  now: [
    "Tuning LLM serving (continuous chunked prefill & prefix cache reuse) for sub-second p99 tail latency on Hopper/Blackwell clusters.",
    "Designing agentic retrieval systems combining BM25, dense vector search, and learned cross-encoders with AST hierarchy preservation.",
    "Benchmarking zero-dependency PostgreSQL logical replication (pgoutput) to Kafka CDC for financial-grade deterministic event pipelines.",
    "Available for advisory, architecture audits, and high-concurrency performance investigations.",
  ],
  email: "sundaram.krissh@gmail.com",
  links: {
    github: "https://github.com/s-maharajan",
    linkedin: "https://www.linkedin.com/in/s-maharajan",
    resume: "/resume",
  },
  advisory: {
    title: "Architecture Reviews & Advisory",
    description:
      "I partner with engineering teams, CTOs, and founders on critical architectural reviews: cutting LLM tail latency, designing production evaluation harnesses, un-tangling distributed consensus issues, and cloud compute cost governance.",
    availability: "Limited availability for Q4 2026 / Q1 2027.",
  },
};
