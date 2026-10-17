export const resumeData = {
  name: "Somasundaram Maharajan",
  title: "Principal Engineer, AI & Platform",
  email: "sundaram.krissh@gmail.com",
  location: "Remote / Worldwide",
  website: "https://som.dev",
  github: "https://github.com/s-maharajan",
  linkedin: "https://www.linkedin.com/in/s-maharajan",
  summary:
    "Principal systems and AI infrastructure engineer with a decade of track record architecting high-throughput distributed systems, low-latency LLM serving runtimes, deterministic event pipelines, and cloud cost governance. Proven expertise cutting p99 latencies, debugging deep distributed state anomalies, and transitioning bleeding-edge research into mission-critical, SLA-backed production services.",
  skills: [
    {
      category: "AI & ML Infrastructure",
      items: ["vLLM", "Triton Inference Server", "PyTorch", "TensorRT-LLM", "HuggingFace", "FAISS", "LangGraph", "Ray"],
    },
    {
      category: "Distributed Systems & Streaming",
      items: ["Apache Kafka", "Debezium (CDC)", "gRPC / Protobuf", "Envoy Gateway", "Event Sourcing", "Transactional Outbox"],
    },
    {
      category: "Storage & Databases",
      items: ["PostgreSQL", "Redis", "Elasticsearch", "ClickHouse", "DynamoDB", "pgvector"],
    },
    {
      category: "Cloud & Reliability",
      items: ["Kubernetes", "AWS (EKS, EC2, RDS, Athena)", "Terraform", "Docker", "OpenTelemetry", "Prometheus / Grafana"],
    },
    {
      category: "Languages",
      items: ["Python", "Go", "TypeScript / Node.js", "Java", "SQL", "Rust (Working)"],
    },
  ],
  experience: [
    {
      role: "Principal Engineer, AI Infrastructure",
      period: "2024 – Present",
      company: "AI Platform & Distributed Systems",
      highlights: [
        "Architected production LLM serving runtime on vLLM and Triton across 32x H100 GPUs, cutting p99 tail latency from 4.2s to 680ms (6× improvement) under 850 QPS peak ingress.",
        "Engineered length-aware request bucketing and prefix-cache reuse algorithms, eliminating redundant attention prefill across conversational agents and lifting GPU utilization from 38% to 71%.",
        "Designed and deployed hybrid enterprise retrieval pipeline combining Elasticsearch BM25, FAISS dense vector search, and cross-encoder rerankers, boosting retrieval accuracy (nDCG@10) by 34% against 12k benchmark queries.",
        "Built automated continuous evaluation harness in CI/CD executing multi-tiered assertion cascades on every pull request, cutting model regression escape rate by 92%.",
      ],
    },
    {
      role: "Lead Platform Engineer, Distributed Systems",
      period: "2022 – 2024",
      company: "Core Infrastructure & Platform",
      highlights: [
        "Architected financial-grade event streaming pipeline using Kafka, PostgreSQL ACID transactions, and Debezium CDC outbox pattern, achieving 0 duplicate-event incidents across 3.2M daily transactions over 18 consecutive months.",
        "Directed the decomposition of a 420k-line legacy monolithic backend into 11 domain-driven Go microservices using Envoy shadow traffic mirroring and automated diff assertions with zero user downtime.",
        "Led cross-functional cloud infrastructure efficiency initiative, architecting Kubernetes VPA recommendation pipelines and Spot fleet ML training to reduce annualized AWS spend by 42% ($640k/year savings) without latency penalty.",
        "Mentored senior and staff engineers, authored architecture decision records (ADRs), and chaired company-wide architecture review boards.",
      ],
    },
    {
      role: "Senior Systems Engineer, Backend Infrastructure",
      period: "2019 – 2022",
      company: "High-Traffic Distributed Products",
      highlights: [
        "Engineered distributed event ingestion microservices in Go and gRPC handling 45,000 requests/sec with p99 response times under 25ms.",
        "Implemented standardized OpenTelemetry distributed tracing and metrics across 80+ microservices, reducing MTTR for complex cross-service incidents from 4 hours to 18 minutes.",
        "Migrated relational workloads from self-hosted MySQL to distributed PostgreSQL read-replicas with zero data corruption.",
      ],
    },
    {
      role: "Software Engineer, Backend Systems",
      period: "2016 – 2019",
      company: "Enterprise Cloud Platforms",
      highlights: [
        "Built core REST and asynchronous messaging services using Java, Spring Boot, and RabbitMQ.",
        "Refactored relational database indexing strategies, reducing high-volume batch report execution times from 45 minutes to 4 minutes.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Engineering (B.E.), Computer Science",
    detail: "Core coursework: Distributed Systems, Database Internals, Algorithms & Data Structures, Computer Networks.",
  },
};
