export const experience = [
  { period: "2024 – now", title: "AI infrastructure", detail: "High-throughput model serving, agentic retrieval systems, and p99 latency optimization across GPU clusters." },
  { period: "2022 – 24", title: "Platform lead", detail: "Led monolith decomposition into 11 microservices and architected the outbox CDC pipeline with zero duplicate events." },
  { period: "2019 – 22", title: "Distributed systems", detail: "High-throughput event streaming, distributed transaction consensus, and OpenTelemetry observability." },
  { period: "2016 – 19", title: "Backend platform", detail: "JVM and Go services for high-traffic products." },
];

export const principles = [
  ["Measure before you argue", "Profiles, flamegraphs, traces, and dashboards come before opinions."],
  ["Keep the hot path boring", "New, volatile technology belongs at the edges, never in the critical write path."],
  ["Design for the next change", "A robust architecture survives the requirement nobody has thought to write down yet."],
  ["Ship to learn", "Production teaches harsh edge-case lessons that staging environments cannot replicate."],
];

export const toolbox = [
  ["Languages", "Python, Go, TypeScript, Java, Kotlin, Rust, SQL"],
  ["AI / ML Infra", "vLLM, Triton, PyTorch, FAISS, Ray, LangGraph, TensorRT-LLM"],
  ["Infrastructure", "Kubernetes, gRPC, Kafka, Terraform, AWS, GCP, Envoy"],
  ["Data & Storage", "PostgreSQL, Redis, ClickHouse, Elasticsearch, DynamoDB, pgvector, Debezium"],
  ["Observability", "OpenTelemetry, Prometheus, Grafana, Loki, Tempo"],
];

// Published posts linking directly to their dedicated reader views
export const writing = [
  {
    title: "Why your RAG is hallucinating: it's the chunker",
    topic: "Retrieval",
    date: "Oct 2025",
    readTime: "6 min read",
    href: "/writing/why-rag-hallucinates-chunking",
  },
  {
    title: "Quantization without tears: FP8 vs AWQ in production",
    topic: "Inference",
    date: "Aug 2025",
    readTime: "7 min read",
    href: "/writing/quantization-without-tears",
  },
  {
    title: "Evals before models: building continuous LLM regression harnesses",
    topic: "Evaluation",
    date: "May 2025",
    readTime: "5 min read",
    href: "/writing/evals-before-models",
  },
  {
    title: "Agents are services with bad memory",
    topic: "Agents",
    date: "Jan 2025",
    readTime: "6 min read",
    href: "/writing/agents-services-bad-memory",
  },
];
