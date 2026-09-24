export const experience = [
  { period: "2025 – now", title: "AI infrastructure", detail: "Agentic retrieval systems and model serving at scale." },
  { period: "2023 – 24", title: "Platform lead", detail: "Led the monolith decomposition and shipped the first LLM features to production." },
  { period: "2020 – 22", title: "Distributed systems", detail: "Event streaming, exactly-once pipelines, and observability." },
  { period: "2016 – 19", title: "Backend platform", detail: "JVM and Go services for high-traffic products." },
];

export const principles = [
  ["Measure before you argue", "Profiles, traces, and dashboards come before opinions."],
  ["Keep the hot path boring", "New technology belongs at the edges, not in the core."],
  ["Design for the next change", "A good architecture survives the requirement nobody has written yet."],
  ["Ship to learn", "Production teaches things staging cannot."],
];

export const toolbox = [
  ["Languages", "Python, Go, TypeScript, Java, Kotlin, Rust, SQL"],
  ["Infrastructure", "Kubernetes, gRPC, Kafka, Terraform, AWS, GCP, Envoy"],
  ["Data", "PostgreSQL, Redis, ClickHouse, Elasticsearch, DynamoDB, pgvector"],
  ["AI / ML", "PyTorch, vLLM, Triton, Ray, LangGraph, MLflow"],
  ["Observability", "OpenTelemetry, Prometheus, Grafana, Loki, Tempo"],
];

// Planned posts. Add an `href` to a post once it is published and it becomes a link.
export const writing = [
  { title: "Why your RAG is hallucinating: it's the chunker", topic: "Retrieval" },
  { title: "Quantization without tears", topic: "Inference" },
  { title: "Evals before models", topic: "Evaluation" },
  { title: "Agents are services with bad memory", topic: "Agents" },
];
