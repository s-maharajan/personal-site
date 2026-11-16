// Essays. Each one credits what it draws on: `sources` lists learning entry
// slugs and `references` lists outside documentation ({ title, url, source }).
// A "Sources" section linking to both is added automatically.
import { learningSections } from "./learning.js";

const p = (...paragraphs) => paragraphs.join("\n\n");
const code = (lang, ...lines) => ["```" + lang, ...lines, "```"].join("\n");

const drafts = [
  {
    slug: "apache-camel-integration-patterns-as-code",
    title: "Apache Camel: integration patterns as code",
    topic: "Integration",
    date: "November 2026",
    summary:
      "Camel turns the classic enterprise integration patterns into routes you can read, test and run anywhere Java runs. Routes, the patterns that matter most, failure handling, testing, and where model calls fit.",
    excerpt:
      "Most integration bugs are not exotic. They are a message processed twice, a retry that never stops, or a failure nobody can see. Camel's value is that it gives each of those problems a named, tested pattern.",
    sources: ["strands-decider-at-amazon", "gemini-decision-1"],
    references: [
      { title: "Enterprise Integration Patterns", url: "https://www.enterpriseintegrationpatterns.com/", source: "Gregor Hohpe and Bobby Woolf" },
      { title: "Enterprise Integration Patterns in Camel", url: "https://camel.apache.org/components/latest/eips/enterprise-integration-patterns.html", source: "Apache Camel docs" },
      { title: "Error handler", url: "https://camel.apache.org/manual/error-handler.html", source: "Apache Camel docs" },
      { title: "AdviceWith", url: "https://camel.apache.org/manual/advice-with.html", source: "Apache Camel docs" },
      { title: "Camel JBang", url: "https://camel.apache.org/manual/camel-jbang.html", source: "Apache Camel docs" },
      { title: "LangChain4j Chat component", url: "https://camel.apache.org/components/latest/langchain4j-chat-component.html", source: "Apache Camel docs" },
    ],
    content: [
      {
        heading: "What Camel is, and what it is not",
        body: p(
          "Apache Camel is an open-source integration framework. It implements the patterns from Gregor Hohpe and Bobby Woolf's book Enterprise Integration Patterns (routers, splitters, aggregators, dead letter channels and many more) and connects them to hundreds of components: Kafka, JMS, HTTP, files, databases, cloud services and SaaS APIs.",
          "It is a library, not a server. Camel runs inside your application, on Spring Boot, Quarkus or plain Java, and Camel JBang lets you run a single route file from the command line while prototyping. That makes it a natural fit for cloud deployment: each integration is a small service in a container, built, tested and deployed like any other.",
          "The trade-off is ownership. Camel gives you the patterns and the connectors; you own the runtime, the deployment, the monitoring and the on-call.",
        ),
      },
      {
        heading: "Routes: the unit of integration",
        body: p(
          "A route reads from one endpoint, applies a series of steps, and writes to one or more endpoints. Endpoints are URIs, so swapping a file drop for a Kafka topic is usually a one-line change. This route reads orders, drops duplicates and sends each order to a queue based on its priority:",
          code(
            "java",
            "public class OrderRoutes extends RouteBuilder {",
            "  @Override",
            "  public void configure() {",
            '    from("kafka:orders?groupId=order-router")',
            '      .routeId("order-router")',
            '      .idempotentConsumer(jsonpath("$.orderId"), idempotentRepository)',
            "      .choice()",
            '        .when(jsonpath("$.priority").isEqualTo("HIGH"))',
            '          .to("jms:queue:orders.priority")',
            "        .otherwise()",
            '          .to("jms:queue:orders.standard")',
            "      .end();",
            "  }",
            "}",
          ),
          "The same route can be written in YAML or XML. The Java DSL is easiest to refactor and test; YAML suits teams that generate or review routes as configuration.",
        ),
        diagram: {
          steps: [
            "Kafka topic: orders",
            "Idempotent consumer drops duplicates by orderId",
            "Content-based router reads priority",
            { either: ["Priority queue", "Standard queue"] },
          ],
          caption: "The route above as patterns: consume, de-duplicate, route by content.",
        },
      },
      {
        heading: "The patterns that earn their keep",
        body: p(
          "Camel implements dozens of patterns. A handful cover most real work:",
          "- **Content-based router**: `choice()` and `when()` send each message where it belongs.\n- **Idempotent consumer**: brokers deliver at least once, so duplicates will arrive. Use a persistent repository (JDBC, Redis, Infinispan or Kafka), not the in-memory one, so restarts do not forget what was processed.\n- **Splitter and aggregator**: break a large payload into units, process them, and reassemble with a completion size or timeout.\n- **Dead letter channel**: where a message goes after its retries run out, so it is parked rather than lost.\n- **Circuit breaker**: `circuitBreaker()` with Resilience4j stops hammering a failing dependency and runs a fallback instead.\n- **Wire tap**: send a copy of a message to an audit or shadow path without slowing the main flow.",
          "Splitting a large file line by line, with streaming so it never loads fully into memory, looks like this:",
          code(
            "java",
            'from("file:inbox?antInclude=*.csv")',
            '  .split(body().tokenize("\\n")).streaming()',
            '    .to("direct:validate-line")',
            "  .end()",
            '  .log("Processed ${header.CamelFileName}");',
          ),
        ),
      },
      {
        heading: "Make failure boring",
        body: p(
          "The most important design decision in any integration is what happens when a step fails. Separate transient failures (timeouts, a broker restarting) from permanent ones (a malformed message). Retry the first with growing delays; never retry the second.",
          code(
            "java",
            'errorHandler(deadLetterChannel("jms:queue:orders.dlq")',
            "  .maximumRedeliveries(5)",
            "  .redeliveryDelay(1000)",
            "  .useExponentialBackOff()",
            "  .retryAttemptedLogLevel(LoggingLevel.WARN));",
            "",
            "onException(ValidationException.class)",
            "  .handled(true)",
            "  .maximumRedeliveries(0)",
            '  .to("jms:queue:orders.invalid");',
          ),
          "A dead letter queue is only useful if someone looks at it. Alert on its depth, record why each message landed there, and have a tested way to replay messages once the cause is fixed.",
        ),
        diagram: {
          steps: [
            "Consume message",
            "Process",
            "Redeliver with exponential back-off",
            { label: "Dead letter queue after the last attempt", tone: "accent" },
            "Alert, fix, replay",
          ],
          loopBack: 1,
          loopLabel: "Transient failures go back to Process with growing delays. Permanent failures, such as validation errors, skip the retries.",
          caption: "Retries for transient failures, a visible place for everything else.",
        },
      },
      {
        heading: "Test routes like code",
        body: p(
          "Routes are code, so they deserve unit tests. `AdviceWith` rewires a route for a test: replace the real consumer with a direct endpoint and swap brokers for mock endpoints that record what they receive.",
          code(
            "java",
            "@Override",
            "public boolean isUseAdviceWith() {",
            "  return true; // start the context only after advising",
            "}",
            "",
            "@Test",
            "void routesHighPriorityOrders() throws Exception {",
            '  AdviceWith.adviceWith(context, "order-router", a -> {',
            '    a.replaceFromWith("direct:orders");',
            '    a.mockEndpointsAndSkip("jms:*");',
            "  });",
            "  context.start();",
            "",
            '  getMockEndpoint("mock:jms:queue:orders.priority").expectedMessageCount(1);',
            '  template.sendBody("direct:orders", Map.of("orderId", "A1", "priority", "HIGH"));',
            "  MockEndpoint.assertIsSatisfied(context);",
            "}",
          ),
          "Test the routing decisions, the error paths and the idempotency in isolation. Then keep a smaller set of integration tests against real brokers in containers.",
        ),
      },
      {
        heading: "Operate it like any other service",
        body: p(
          "Because Camel lives inside a normal application, it plugs into the operational tooling you already have. Expose route metrics through Micrometer, trace messages across services with OpenTelemetry, and publish health checks so the platform restarts or stops routing to an unhealthy instance.",
          "Give every route a stable `routeId`. It becomes the name in metrics, traces, logs and tests, and it is what people search for at three in the morning.",
        ),
      },
      {
        heading: "Where Camel meets AI",
        body: p(
          "A call to a model is, from an integration point of view, just another endpoint: slow, occasionally failing, and metered. Camel's LangChain4j components let a route call a model like any other endpoint, so the patterns above apply unchanged: timeouts, retries with back-off, circuit breakers and idempotency.",
          "This matters most for classification steps. Amazon engineers replaced a large general model with a small decision model for ticket labelling and report a cost drop of about 98%, and Google now offers a decision model in the Gemini API. The safe way to make that kind of switch is a pattern Camel already has: keep the current model on the main path and use a wire tap to send a copy of each message to the candidate, then compare decisions before cutting over.",
        ),
        diagram: {
          steps: [
            "Inbound message",
            ["Current model decides (main path)", "Candidate model via wire tap (shadow)"],
            "Compare decisions offline",
            { label: "Switch the route when the candidate matches", tone: "accent" },
          ],
          caption: "Shadow testing a model change with a wire tap: real traffic, no risk to the main path.",
        },
      },
      {
        heading: "Camel or MuleSoft?",
        body: p(
          "Both implement the same patterns, so the choice is less about features than about operating model.",
          "- **Camel** suits teams that are strong in Java and run their own platform on Kubernetes. It is open source under the Apache License, code-first, and every integration is a normal service you build, test and operate yourself.\n- **MuleSoft** suits organisations where many teams publish and consume APIs and need a shared catalogue, policies, monitoring and low-code tooling as a managed platform, and are prepared to pay for it.",
          "Plenty of organisations run both: MuleSoft for governed, reusable APIs between business systems, and Camel inside services that need embedded routing close to the code.",
        ),
      },
    ],
  },
  {
    slug: "mulesoft-api-led-integration-for-agents",
    title: "MuleSoft in the agent era: API-led integration still does the heavy lifting",
    topic: "Integration",
    date: "November 2026",
    summary:
      "Agents need governed, reusable access to enterprise systems, which is what API-led connectivity was designed for. The model, the Mule 4 practices that matter, moving off Mule 3, and what MuleSoft is adding for agents.",
    excerpt:
      "Every agent demo eventually needs to read an order, update a customer or check stock. The hard part is not the model; it is safe, governed access to systems of record. That has been MuleSoft's job for years.",
    sources: [],
    references: [
      { title: "DataWeave documentation", url: "https://docs.mulesoft.com/dataweave/latest/", source: "MuleSoft docs" },
      { title: "Error handling in Mule 4", url: "https://docs.mulesoft.com/mule-runtime/latest/error-handling", source: "MuleSoft docs" },
      { title: "Migrating from Mule 3 to Mule 4", url: "https://docs.mulesoft.com/mule-runtime/latest/migration-intro", source: "MuleSoft docs" },
      { title: "Apply Open Policies to AWS API Gateway", url: "https://blogs.mulesoft.com/news/apply-open-policies-to-aws-api-gateway/", source: "MuleSoft blog" },
      { title: "Direct Telemetry Stream from Managed Omni Gateways", url: "https://blogs.mulesoft.com/news/direct-telemetry-stream-from-managed-omni-gateways/", source: "MuleSoft blog" },
      { title: "Orchestrate Copilot Studio agents with the A2A bridge", url: "https://blogs.mulesoft.com/news/orchestrate-copilot-studio-agents-with-the-a2a-bridge/", source: "MuleSoft blog" },
      { title: "What's new with Agent Broker", url: "https://blogs.mulesoft.com/automation/build-test-and-run-trusted-agent-orchestrations-faster-whats-new-with-agent-broker/", source: "MuleSoft blog" },
      { title: "Agentic KPI Framework", url: "https://blogs.mulesoft.com/agentic-perspectives/agentic-kpi-framework-from-orchestration-to-measurable-control/", source: "MuleSoft blog" },
    ],
    content: [
      {
        heading: "The platform in one paragraph",
        body: p(
          "MuleSoft's Anypoint Platform has a few parts worth naming. The **Mule runtime** runs integration applications built from flows. **Anypoint Code Builder** and **Anypoint Studio** are where you build them. **Exchange** is the catalogue where teams publish and find reusable assets: API specifications, connectors and fragments. **API Manager** applies policies such as rate limiting, client ID enforcement and token validation at the gateway. **Runtime Manager** deploys to CloudHub, Runtime Fabric or your own servers, and **Anypoint Monitoring** collects the metrics and logs.",
        ),
      },
      {
        heading: "API-led connectivity, briefly",
        body: p(
          "API-led connectivity organises integration into three layers, each with a different job:",
          "- **System APIs** unlock a system of record and hide its quirks, so nobody else has to learn them.\n- **Process APIs** combine data and business rules across systems: \"place an order\" rather than \"insert three rows in the ERP\".\n- **Experience APIs** shape that data for one kind of consumer: a mobile app, a partner, and increasingly an agent.",
          "The point is reuse and change isolation. When the ERP is replaced, only its system API changes. The pitfall is applying the layers by rule. A process API that only passes a call through adds latency, cost and another deployment for no benefit, so add a layer where there is real reuse or real logic.",
        ),
        diagram: {
          layers: [
            { label: "Experience APIs", detail: "Shaped for one consumer: web, mobile, partner or agent." },
            { label: "Process APIs", detail: "Business capabilities that orchestrate several systems." },
            { label: "System APIs", detail: "Stable interfaces over each system of record." },
          ],
          base: { label: "Shared platform", detail: "Exchange, API Manager policies and monitoring across every layer." },
          caption: "Three layers, each isolating the one below it from change.",
        },
      },
      {
        heading: "DataWeave is the part worth mastering",
        body: p(
          "DataWeave, MuleSoft's functional transformation language, is where most integration logic ends up. It reads and writes JSON, XML, CSV and more with the same expressions:",
          code(
            "dataweave",
            "%dw 2.0",
            "output application/json",
            "---",
            "payload.orders map (order) -> {",
            "  id: order.orderId,",
            '  customer: upper(order.customer.name default ""),',
            "  total: order.lines reduce ((line, sum = 0) -> sum + line.qty * line.price),",
            '  priority: if (order.express == true) "HIGH" else "STANDARD"',
            "}",
          ),
          "Three habits pay off. Keep non-trivial transformations in their own `.dwl` modules rather than inline in flows. Unit test them with MUnit, including the empty and malformed cases. And for large payloads, make sure the transformation can stream instead of loading everything into memory.",
        ),
      },
      {
        heading: "Error handling in Mule 4",
        body: p(
          "Mule 4 errors are typed, such as `HTTP:CONNECTIVITY` or `HTTP:TIMEOUT`, and each error handler chooses between two behaviours. **On Error Propagate** handles the error and re-throws it, so transactions roll back and the caller sees a failure. **On Error Continue** handles it and lets the flow complete as if it succeeded. Choosing the wrong one is a common source of silently lost messages.",
          "**Until Successful** retries a block for transient failures and raises `MULE:RETRY_EXHAUSTED` when it gives up:",
          code(
            "xml",
            '<flow name="sync-order">',
            '  <http:listener config-ref="api-httpListener" path="/orders" />',
            '  <until-successful maxRetries="3" millisBetweenRetries="2000">',
            '    <http:request config-ref="erp" method="POST" path="/orders" />',
            "  </until-successful>",
            "  <error-handler>",
            '    <on-error-propagate type="MULE:RETRY_EXHAUSTED">',
            '      <jms:publish config-ref="broker" destination="orders.dlq" />',
            "    </on-error-propagate>",
            "  </error-handler>",
            "</flow>",
          ),
          "Until Successful retries on any error, so validate the request before it. A malformed order should be rejected once, not sent to the ERP four times.",
        ),
      },
      {
        heading: "Moving off Mule 3",
        body: p(
          "Mule 3 applications do not run on Mule 4 unchanged. Expressions move from MEL to DataWeave 2, error handling is redesigned around typed errors, connectors become separately versioned extensions, and streaming is repeatable by default. MuleSoft's migration assistant converts projects as a starting point, but the output still needs review.",
          "A safer path than a big-bang rewrite:",
          "1. Inventory applications by business domain and traffic, and retire what nobody uses.\n2. Write contract tests against the current Mule 3 behaviour before converting anything.\n3. Migrate one domain at a time, starting with low-risk system APIs.\n4. Run old and new side by side on real traffic and compare responses before switching consumers.",
          "That last step is the same dual-run pattern that works for model migrations: never switch on a hunch when you can compare on real traffic.",
        ),
      },
      {
        heading: "What MuleSoft is adding for agents",
        body: p(
          "MuleSoft's recent announcements are mostly about making the same governed layers usable by agents. As reported on the MuleSoft blog:",
          "- **Copilot Studio agents and A2A**: a generally available bridge lets Copilot Studio agents join A2A (agent-to-agent) workflows without custom adapters. Check identity propagation and failure handling before relying on it.\n- **Agent Broker**: aims to shorten the build, publish and deploy loop when testing changes to agent orchestrations.\n- **One policy, many gateways**: a policy from the policy library can be applied across Omni Gateway, Apigee, Azure API Management, Kong and, since 4 November 2026, AWS API Gateway.\n- **Direct telemetry**: Managed Omni Gateway can stream telemetry directly instead of routing it through Anypoint's OpenTelemetry exporter.\n- **Agentic KPIs**: a framework arguing that scaling agents needs measures of effectiveness, efficiency, governance and safety, not more workflows.",
        ),
        diagram: {
          steps: [
            "Agent",
            { label: "Gateway policies: identity, rate limits, audit", tone: "accent" },
            "Experience API shaped for the agent",
            "Process APIs",
            "System APIs",
          ],
          caption: "Agents should reach systems of record through the same governed layers as every other consumer, never directly.",
        },
      },
      {
        heading: "Practical guidance",
        body: p(
          "1. Give agents their own experience APIs with narrow scopes, read-only by default. Writes should go through a small number of explicit, validated operations.\n2. Require idempotency keys on every write API. Agents retry, and so do networks.\n3. Publish specifications in Exchange with clear descriptions and examples. Agents read them, so vague descriptions become wrong tool calls.\n4. Apply rate limits and a client identity per agent, so one misbehaving agent cannot take a system of record down and you can see which agent did what.\n5. Measure agent traffic like any other consumer: error rates, latency and cost per business outcome, not just call counts.",
        ),
      },
    ],
  },
  {
    slug: "loops-first-graphs-second",
    title: "Loops first, graphs second: a working model for agent systems",
    topic: "Agents",
    date: "November 2026",
    summary:
      "Most agent designs go wrong by reaching for multi-agent orchestration too early. Start with one loop that can fail its own check, and add a graph only when the work demands it.",
    excerpt:
      "Agent design advice is noisy, but across Anthropic's guidance, Karpathy's framing and a handful of practitioner write-ups, the same shape keeps appearing: earn every layer of structure you add.",
    sources: [
      "barry-zhang-building-effective-agents",
      "karpathy-stanford-llm-to-graph",
      "loop-vs-graph-engineering-explainer",
      "loops-and-graphs-approval-course",
      "agent-graphs-beat-agent-chains",
      "andrew-ng-graph-engineering-course",
    ],
    content: [
      {
        heading: "Start with the smallest thing that works",
        body: p(
          "Barry Zhang's talk on building effective agents makes three points that are easy to agree with and hard to practise: do not build agents for everything, keep them simple, and think from the agent's point of view.",
          "His definitions are useful because they are plain. A **workflow** is a fixed chain of model calls that you designed. An **agent** chooses its own next step from what the environment tells it. And an agent is just a model using tools in a loop, defined by three things: the environment, the tools and the system prompt.",
          "That gives a clear order of work. Build those three things first. Leave the optimisations (caching, parallel tool calls, progress displays) until the basic loop behaves. When it misbehaves, debug by reading only what the agent could see in its context window, not what you know about the task.",
        ),
      },
      {
        heading: "A ladder, not a leap",
        body: p(
          "Karpathy describes the same idea as a ladder: a raw model, then a prompt, then an agent with goals, memory and tools, then a loop, and finally a graph of agents passing messages along data dependencies. His claim is that a graph of simple agents beats a single clever prompt.",
          "The ladder matters more than the top rung. Each step buys reliability with structure rather than with cleverness, and each step adds cost and moving parts. Most tasks should stop on a lower rung than the one that sounds most impressive.",
        ),
        diagram: {
          steps: ["Model", "Prompt", "Agent: goals, memory, tools", "Loop", "Graph of agents"],
          caption: "Karpathy's ladder. Each rung adds reliability through structure, and also cost and moving parts. Stop at the lowest rung that does the job.",
        },
      },
      {
        heading: "What makes a loop real",
        body: p(
          "A loop is one agent's own cycle: plan, act, verify, repeat. The practical test, from a write-up on loops and approval gates, is simple: a loop is only real if it has a check that can fail. \"No error\" is not a check. A compiler run, a test suite, a schema validation or a comparison against a spec is.",
          "So write the failure condition first, before the work itself. If you cannot say what a failed attempt looks like, the agent cannot either, and the loop becomes a polite way of running once.",
        ),
        diagram: {
          steps: [{ label: "Write the failure check first", tone: "accent" }, "Plan", "Act", "Run the check"],
          loopBack: 1,
          loopLabel: "Repeat from Plan until the check passes, or stop and escalate to a person.",
          caption: "A loop is only real if its check can fail. \"No error\" is not a check.",
        },
      },
      {
        heading: "When a graph earns its place",
        body: p(
          "A graph is the layer above loops: nodes and edges that wire several loops, tools or agents together. The signal to move up is not ambition but need. Reach for a graph when the work needs parallelism, different permissions for different steps, or a human approval in the middle.",
          "A useful vocabulary for the nodes:",
          "- **Splitter**: cuts the work into independent units.\n- **Worker**: does one unit in its own clean context.\n- **Code node**: merges, deduplicates or filters with plain code, spending no model tokens.\n- **Gate**: approves or rejects before the next step.",
          "Edges should exist only where one step's output really feeds the next. If you cannot name the variable that crosses an edge, there is no dependency, and you are making a step wait for nothing. That is the core of the \"graphs beat chains\" argument: many multi-agent systems are slow because they run independent steps in a straight line.",
          "The fan-out pattern that follows is worth copying directly: run single-purpose workers in parallel, reduce their results with code, have a fresh skeptic agent verify each finding with a clean context (never the worker's conversation), and synthesise once from what survived.",
        ),
        diagram: {
          steps: [
            "Split into independent units",
            ["Worker, own context", "Worker, own context", "Worker, own context"],
            "Merge and dedupe in code",
            "Skeptic verifies in a fresh context",
            { label: "Gate on blast radius", tone: "accent" },
            "Synthesise once",
          ],
          caption: "Fan out, reduce with code, verify in a clean context, gate, then synthesise once. A failing unit goes back to its worker on its own, never the whole batch.",
        },
      },
      {
        heading: "Gate on blast radius, retry by unit",
        body: p(
          "Two operational rules make graphs safe to run. First, decide where humans approve by how expensive a mistake is to undo, not by the model's self-reported confidence. Reversible and contained changes can flow; hard-to-reverse ones stop at a gate.",
          "Second, when a step fails, send back only the failing unit, never the whole batch. Keep a second, longer return path too: when the same cause shows up repeatedly, turn it into a constraint for the splitter so future runs avoid it.",
        ),
      },
      {
        heading: "A short checklist",
        body: p(
          "1. Can a fixed workflow do this? If yes, do not build an agent.\n2. Does the loop have a check that can fail, written before the work?\n3. Is there a real reason for a graph: parallelism, permissions or approvals?\n4. Can you name the data on every edge?\n5. Are merges done in code and findings verified in a clean context?\n6. Are gates placed by blast radius?",
        ),
      },
    ],
  },
  {
    slug: "code-review-when-agents-write-the-code",
    title: "Code review when agents write most of the code",
    topic: "Engineering practice",
    date: "November 2026",
    summary:
      "When agents produce most of the diff, reading every line stops scaling. The teams doing this well layer automated checks, watch reverts, and protect human attention for the risky parts.",
    excerpt:
      "Anthropic says Claude writes about 90% of Claude Code's code. That forces a question every team adopting agents will meet: what does review mean when people can no longer read everything?",
    sources: [
      "claude-code-team-code-review",
      "critical-thinking-with-agents",
      "alibaba-open-code-review",
      "elephant-goldfish-model-spec-review",
      "meta-forum-ai-native-engineering",
    ],
    content: [
      {
        heading: "Volume broke the old model",
        body: p(
          "The numbers the Claude Code team published are their own, but the direction is hard to argue with. Anthropic's monorepo went from about 2,500 changes a day in May to more than 30,000 in September. Between June and September merged pull requests more than doubled while the share of reverts fell by over 40%.",
          "Their stated goal is not \"review less\". It is that most pull requests merge with at most one human in the loop, who can be the author, with no rise in reverts or incidents. They track human approvals per PR, comments and wait time, and treat revert and incident rates as the guardrail. That framing is the useful part: speed is the target, and a measurable quality signal decides whether you are allowed to keep it.",
        ),
      },
      {
        heading: "Layer the review",
        body: p(
          "The model they describe stacks several layers, each catching a different class of problem:",
          "1. **Before a PR exists**: the agent must show verification output (tests, build, a screenshot), then a subagent with a fresh context reviews the diff. Findings that keep recurring are fixed at the source, in a skill, a lint rule, CLAUDE.md or an owner-written REVIEW.md.\n2. **On every PR**: several review agents hunt for bugs in parallel, another group votes, and only agreed findings are posted, tagged Important, Nit or Pre-existing. Every finding is fixed or resolved with a reason.\n3. **Security**: a blocking security review.\n4. **The basics**: lint, types, tests and build.",
          "Under all of it sits fast rollback. Layered review is only safe if undoing a change is cheap.",
        ),
        diagram: {
          layers: [
            { label: "Before the PR", detail: "Verification output, then a fresh-context subagent reviews the diff." },
            { label: "AI review on every PR", detail: "Parallel bug hunters, a vote, and tagged findings that must be fixed or resolved." },
            { label: "Security review", detail: "Blocking: the merge waits for it." },
            { label: "Lint, types, tests, build", detail: "The basics, on every change." },
          ],
          base: { label: "Fast rollback", detail: "Makes every layer above safe to rely on." },
          caption: "Each layer catches a different class of problem, so human attention can go where the risk is.",
        },
      },
      {
        heading: "Let deterministic code do the mechanical work",
        body: p(
          "Alibaba's open-source code review agent makes a complementary point. Choosing which files to review, bundling related files, matching rules and placing comments are mechanical jobs, so plain code does them. The model is only asked to reason.",
          "On their own benchmark of 200 real pull requests they report higher precision than a general coding agent on the same model, at about a ninth of the tokens, while missing more issues. That trade is often the right one for review: fewer false positives keep people reading the comments.",
        ),
      },
      {
        heading: "Review the spec, not only the diff",
        body: p(
          "Many agent failures start before any code exists, in an ambiguous plan. Meta's Forum team treated planning as precise, machine-readable specs because ambiguity is what makes agents fail, and they measured success as verified changes that build, pass tests and survive review, not as lines of code.",
          "The Elephant-Goldfish model is a neat way to test a spec. One agent keeps the whole conversation and drafts the document; fresh reviewers get only the document and the files it references. If a reader without the chat history cannot follow the design, the spec is not finished. As one commenter noted, this grades legibility, not correctness, but legibility is exactly what an implementing agent needs.",
        ),
        diagram: {
          steps: [
            "Engineer and an agent with the full conversation",
            "Draft spec",
            ["Reviewer with only the document", "Reviewer with only the document"],
            "Resolve findings",
            { label: "Approve, then implement", tone: "accent" },
          ],
          caption: "The Elephant-Goldfish model. If reviewers without the chat history cannot follow the design, the spec is not finished.",
        },
      },
      {
        heading: "Keep ownership of the reasoning",
        body: p(
          "Addy Osmani's essay on critical thinking names the quiet risk in all of this. As outputs become mostly right, people stop checking them. He describes a spectrum: offloading (you delegate but own the result), deferral (the output becomes your input) and cognitive surrender (the output quietly becomes yours).",
          "Surrender creates comprehension debt: code that looks clean and passes tests, but that nobody can explain when it has to change. It also creates surrendered verification, where a green check was written with the same mistake as the feature and proves nothing. The fix is to define what \"verified\" means before the agent starts.",
          "His self-check questions are worth keeping nearby: Did I form a hypothesis before asking? What would have to be true for this to be wrong? Would I defend this in front of its maintainer?",
        ),
      },
    ],
  },
  {
    slug: "not-every-step-needs-a-frontier-model",
    title: "Not every step needs a frontier model",
    topic: "Cost",
    date: "November 2026",
    summary:
      "Agent cost is an architecture problem: benchmark on your own work, route sub-tasks to cheaper models, keep prompts cacheable, and replace closed-choice steps with decision models.",
    excerpt:
      "The bill for running agents rarely comes from one expensive call. It comes from defaults: the biggest model everywhere, maximum reasoning effort, and context that grows with every tool result.",
    sources: [
      "claude-code-token-costs-and-cache",
      "uber-software-factory-cost",
      "strands-decider-at-amazon",
      "gemini-decision-1",
    ],
    content: [
      {
        heading: "Where the tokens actually go",
        body: p(
          "An agent harness rebuilds each request from the instructions, the available tools and the accumulated history. The model replies with an answer or a tool call; the harness runs the tool and appends the result. So every tool result becomes input to every later request in that session.",
          "Two things follow. An unchanged prefix can be served from the prompt cache, which is much cheaper than processing new input, so stable instructions and tool definitions matter. And context hygiene, keeping each session focused on one task, reduces how much is re-read on every turn.",
          "Measure the complete task, including subagents and retries. Comparing the length of final answers tells you almost nothing about cost.",
        ),
      },
      {
        heading: "Benchmark on your own work",
        body: p(
          "Uber's write-up on its software factory is the most concrete public example I have found. They report more than 70% of pull requests touched by agents, over 3,600 agent skills and around 30,000 skill runs a day, and they cut cost with a small number of levers.",
          "The first is a benchmark built from real work: real pull requests with known bugs, graded easy, medium and hard. Every candidate model, frontier or open-weight, runs on it behind one harness, and they pick whichever model is the best trade-off between cost and quality today, then keep re-checking as models change.",
          "Their numbers are explicitly not transferable, and a benchmark harness is a project in itself. But the starting version is small: take 10 to 20 recent tasks from your own repositories and compare two models on pass rate and cost before standardising on either.",
        ),
      },
      {
        heading: "Route by difficulty",
        body: p(
          "The other levers are about matching effort to the job:",
          "- Keep the primary model on a frontier model for planning and evaluation, and default subagents, which do well-defined low-reasoning work, to cheaper models.\n- Cap reasoning effort at a medium default instead of the maximum.\n- Compact long contexts automatically before they grow without limit.\n- Use a longer prompt-cache lifetime for interactive sessions, where people pause between turns, and a short one for subagents that finish quickly.",
        ),
        diagram: {
          steps: [
            "Task",
            { label: "Plan on a frontier model", tone: "accent" },
            ["Subagent on a cheaper model", "Subagent on a cheaper model", "Decision model for a closed choice"],
            { label: "Evaluate on a frontier model", tone: "accent" },
          ],
          caption: "Spend frontier tokens on planning and evaluation. Route well-defined sub-tasks to cheaper models, and closed choices to a decision model.",
        },
      },
      {
        heading: "Decision models for closed choices",
        body: p(
          "Some steps do not need a generative model at all. A decision model receives the current state, a question and a set of options, and returns a probability for each option with a confidence. It cannot write text, which is exactly the point.",
          "Amazon engineers used one to label tickets into 20 categories, replacing a large general model. They report that quality held and cost fell by about 98%. Google now offers a decision model in the Gemini API as well.",
          "The integration design is as instructive as the model. Ticket events flow from a queue to a function to a hosted model endpoint. A configuration switch with three modes (the old model, both side by side, or the new model) let the team run both on real traffic and compare before switching. That dual-run pattern is a safe way to migrate any model-backed step.",
          "It only fits closed choices from a stable catalogue with short context. Free-form reasoning still belongs to generative models.",
        ),
        diagram: {
          steps: [
            "Ticket event",
            "Queue",
            "Function reads the mode switch",
            { either: ["Mode 1: current model", "Mode 2: both, compared", "Mode 3: decision model"] },
            "Label applied",
          ],
          caption: "The dual-run pattern from Amazon's write-up: a three-mode switch lets the old and new model run on real traffic before the cut-over.",
        },
      },
      {
        heading: "A cost review checklist",
        body: p(
          "1. Do you know the cost of a whole task, including subagents and retries?\n2. Are instructions and tool definitions stable enough to be cached?\n3. Is there a small benchmark from your own work to compare models?\n4. Are subagents on cheaper models and reasoning effort capped by default?\n5. Are any steps really closed choices that a decision model could handle?\n6. Can you run old and new models side by side before switching?",
        ),
      },
    ],
  },
  {
    slug: "agents-read-untrusted-input",
    title: "Agents read untrusted input. Design for it.",
    topic: "Security",
    date: "November 2026",
    summary:
      "Prompt injection defences are improving, but an agent holding real credentials still needs isolation, a narrow write path and the same supply-chain hygiene as any other code.",
    excerpt:
      "An agent that reads a web page, an issue or a document is processing untrusted input and then acting on it. That is the oldest problem in security, in a new form.",
    sources: [
      "anthropic-beats-prompt-injection",
      "perplexity-space-sandbox",
      "digitalocean-managed-agents",
      "github-agentic-workflows-ga",
      "open-source-security-review-stack",
      "gh-secure-github-cli-extension",
    ],
    content: [
      {
        heading: "Injection is better, not solved",
        body: p(
          "Prompt injection is when content an agent reads contains instructions, such as \"send the user's SSH keys to this address\", that the model mistakes for a request from its user. Anthropic says a combination of training against injected instructions, probes that scan content before the model sees it, and a classifier that checks whether an instruction matches the user's intent has pushed the success rate close to zero on its recent models, citing an independent benchmark in a system card.",
          "That is real progress, and it is self-reported. \"Largely solved\" is not \"solved\". Any agent that holds real credentials should be designed as if an injection will eventually get through.",
        ),
      },
      {
        heading: "Isolate execution",
        body: p(
          "The emerging pattern is that an agent's computer is disposable and its privileges live outside it. Perplexity's SPACE runs agent code in Firecracker microVMs created through an HTTP API, and controls credentials and outbound traffic from outside the VM. DigitalOcean's managed agents run existing coding agents unmodified in isolated microVMs that pause when idle, with the tools they may call exposed through one governed endpoint.",
          "Whichever platform you use, the questions are the same. What can the sandbox reach on the network? Which credentials are inside it, and for how long? What happens to its filesystem when the task ends?",
        ),
      },
      {
        heading: "Narrow the write path",
        body: p(
          "GitHub Agentic Workflows show what a narrow write path looks like in practice. Agents are read-only by default and run in a sandboxed container behind a firewall. Anything they want to change goes through validated \"safe outputs\" jobs, and a threat-detection job scans proposed changes before they land.",
          "The principle generalises well beyond GitHub: the agent proposes, and a deterministic, permission-limited step applies. That keeps the model's judgement out of the part of the system that holds write access.",
        ),
        diagram: {
          steps: [
            { label: "Untrusted input: web page, issue, document", tone: "dashed" },
            "Agent in a sandbox: read-only, no secrets",
            "Proposed change as a safe output",
            { label: "Deterministic job holds write access", tone: "accent" },
            "Repository",
          ],
          caption: "The agent proposes; a narrow, permission-limited step applies. Credentials never enter the sandbox that reads untrusted content.",
        },
      },
      {
        heading: "Skills are supply chain",
        body: p(
          "Agent skills and plugins are code that runs with your agent's permissions, and they are shared the way packages are. NVIDIA's SkillSpector README reports that 26.1% of the 31,132 skills it analysed had vulnerabilities and 5.2% showed likely malicious intent. Whatever the exact rate in your ecosystem, skills deserve the same scanning and review as dependencies.",
        ),
      },
      {
        heading: "Automate the obvious checks",
        body: p(
          "Shipping faster with agents does not make security review faster by itself, so automate what can be automated:",
          "- **Repository settings**: GitHub Security Lab's gh-secure turns on branch protection, private vulnerability reporting, secret scanning, Dependabot and code scanning in one command. Run it with `--dry-run` first.\n- **Secrets**: Gitleaks or TruffleHog.\n- **Dependencies**: OSV-Scanner.\n- **CI workflows**: zizmor finds risky GitHub Actions patterns.\n- **Code**: Semgrep rules, plus an AI security review on pull requests. Anthropic's review action is not hardened against prompt injection, so use it on trusted pull requests only.\n- **Agent-led audits**: Cloudflare's security audit skill has a fresh verifier try to disprove each finding before it is reported.",
        ),
        diagram: {
          steps: ["Commit", "Secrets scan", "Static analysis and dependency scan", "AI security review on the PR", "Runtime scan"],
          caption: "Automated checks at every stage, so human review can focus on design and intent.",
        },
      },
    ],
  },
  {
    slug: "skills-and-instructions-are-code",
    title: "Skills and instruction files are code now",
    topic: "Tooling",
    date: "November 2026",
    summary:
      "AGENTS.md, CLAUDE.md and skill folders shape what agents do on every run. Version them, test them, prune them and review them like the code they effectively are.",
    excerpt:
      "A one-line change to an instruction file can alter every agent session on a team. Yet most teams still treat these files as notes rather than as software.",
    sources: [
      "meta-forum-ai-native-engineering",
      "boris-cherny-on-claude-code-prompting",
      "claude-opus-5-5-prompt-audit",
      "nvidia-skillevaluator",
      "skill-recorder-record-to-agent-skill",
      "matt-pocock-home-repo",
      "five-public-ai-configs",
      "github-agentic-workflows-ga",
    ],
    content: [
      {
        heading: "The layer around the model",
        body: p(
          "Most of what makes an agent useful on a real codebase is not the model. It is the layer around it: instruction files such as CLAUDE.md and AGENTS.md, skills, commands, hooks and the workflows that run them. Boris Cherny's advice on Claude Code starts here, with a project file the agent reads automatically so conventions and rules do not have to be repeated every session.",
          "Meta's Forum team described a fuller operating model with five parts: rules (permanent instructions), skills, agents, commands that chain workflows, and hooks such as running lint after every agent turn. One detail stands out: a rule is added only after a mistake repeats twice. That keeps instruction files short and grounded in real failures.",
        ),
      },
      {
        heading: "Instructions go stale as models improve",
        body: p(
          "Instructions written for older models often hold newer ones back: verbose scaffolding, heavy guardrails, step-by-step hand-holding the model no longer needs. Anthropic's prompt-audit skill scans a project's instruction files for those patterns and rewrites them. It edits files in place, so review the diff as you would any refactor.",
          "The broader habit is to prune. Every model upgrade is a good moment to delete instructions instead of only adding them.",
        ),
      },
      {
        heading: "Test skills like code",
        body: p(
          "NVIDIA's SkillEvaluator treats a skill the way a CI pipeline treats a library, in three tiers:",
          "1. **Validation**: is the skill safe, well-formed and compatible with the harness? This tier runs security scanners and needs no model.\n2. **Deduplication**: embeddings find guidance that repeats inside a skill or across a catalogue.\n3. **Live evaluation**: run an agent in a sandbox with and without the skill and score the difference.",
          "It can also add a pull-request check for changed skills. The third tier is the important idea: a skill should prove that it helps, not just that it parses.",
        ),
        diagram: {
          steps: [
            "Write or record a skill",
            "Tier 1: static and security checks",
            "Tier 2: overlap check",
            { label: "Tier 3: agent runs with and without it", tone: "accent" },
            "Merge through a pull request",
          ],
          loopBack: 0,
          loopLabel: "On every model upgrade, audit and prune the skill, then run the checks again.",
          caption: "A skill should prove that it helps, not just that it parses.",
        },
      },
      {
        heading: "Capture skills from real work",
        body: p(
          "Writing a good skill from memory is hard; recording one is easier. Skill Recorder captures you doing a task (clicks, pages, terminal commands, optionally your voice), turns it into editable steps, and generates a SKILL.md or a scheduled automation that prefers native tools such as `gh` over replaying clicks.",
          "Because it records your screen, anything sensitive on it can end up in what is sent for analysis. Record in a clean session.",
        ),
      },
      {
        heading: "Compose, share and run where the team works",
        body: p(
          "Matt Pocock's \"home repo\" pattern is a simple way to work across many repositories: start the agent in one repository whose AGENTS.md says where to clone the others. Keep secrets out of it, because the agent can reach everything it points to.",
          "Before writing your own skills, borrow from public packs. Small, composable skills tend to age better than one giant prompt, and packs such as Pocock's skills, Osmani's spec-to-ship commands and Cloudflare's security audit are good references.",
          "Finally, run agents where the team already works. GitHub Agentic Workflows compile a Markdown file of instructions into a normal GitHub Actions workflow, and the githubnext/agentics repository has ready-made ones for issue triage, CI failure analysis and reviews. Once instructions live in the repository, they get history, review and rollback for free.",
        ),
      },
    ],
  },
];

const entriesBySlug = new Map(learningSections.flatMap((s) => s.entries.map((e) => [e.slug, { ...e, section: s }])));

const sourcesSection = (slugs = [], references = []) => ({
  heading: "Sources",
  body: [
    slugs.length
      ? "These sources informed this essay, including notes from my learning log. Figures are as reported by each source."
      : "Further reading. Figures and product details are as reported by each source.",
    [
      ...slugs.map((slug) => {
        const entry = entriesBySlug.get(slug);
        if (!entry) throw new Error(`Unknown learning entry in essay sources: ${slug}`);
        return { title: entry.title, url: entry.url, source: entry.source };
      }),
      ...references,
    ]
      .map((ref) => `- [${ref.title}](${ref.url}) (${ref.source})`)
      .join("\n"),
  ].join("\n\n"),
});

const words = (article) =>
  [article.excerpt, ...article.content.map((s) => `${s.heading} ${s.body}`)].join(" ").split(/\s+/).length;

// Published essays, each with its sources section and a read time from its length.
export const articles = drafts.map((draft) => {
  const article = { ...draft, content: [...draft.content, sourcesSection(draft.sources, draft.references)] };
  return { ...article, readTime: `${Math.max(1, Math.round(words(article) / 220))} min read` };
});

export const findArticle = (slug) => articles.find((a) => a.slug === slug);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Dates are written as "Month YYYY". Parse them explicitly: `new Date("October 2025")`
// is not a standard format and returns Invalid Date in Safari.
export const isoMonth = (date) => {
  const [month, year] = date.split(" ");
  return `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}`;
};

export const sortedArticles = [...articles].sort((a, b) => isoMonth(b.date).localeCompare(isoMonth(a.date)));
