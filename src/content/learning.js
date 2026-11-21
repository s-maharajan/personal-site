// Curated from my private daily-learning notes: only the items worth keeping,
// grouped into sections. Summaries describe public sources, linked per entry.
// New picks are added by scripts/import-learning.js; edit by hand as needed.
export const learningSections = [
  {
    "slug": "agent-architecture",
    "title": "Agent architecture",
    "kicker": "Loops, graphs & decisions",
    "description": "How to shape agent systems: when one loop is enough, when to wire loops into a graph, and when a small decision model beats a big generative one.",
    "readTime": "4 min read",
    "entries": [
      {
        "slug": "barry-zhang-building-effective-agents",
        "title": "Barry Zhang: Building Effective Agents",
        "date": "2026-11-16",
        "source": "YouTube",
        "url": "https://www.youtube.com/watch?v=D7_ipDqhtwk",
        "takeaway": "Build the environment, tools and prompt first; optimise later, and debug by reading only what the agent sees.",
        "summary": "Anthropic engineer expands three ideas from the \"Building Effective Agents\" blog post: do not build agents for everything, keep them simple, and think from the agent's point of view. A workflow is a fixed chain of model calls; an agent chooses its own steps from environment feedback.",
        "points": [
          "An agent = model using tools in a loop, defined by environment, tools and system prompt.",
          "Build those three first; optimize (caching, parallel tool calls, progress display) later.",
          "Debug by reading only what the agent sees in its context window."
        ],
        "caveat": "Talk dates from 2025; predictions (multi-agent in production \"by end of this year\") refer to that year. Slide content not visible from audio.",
        "flow": {
          "steps": [
            "System prompt with goals and limits",
            "Model call",
            "Tool action in environment",
            "Feedback"
          ],
          "loopBack": 1
        }
      },
      {
        "slug": "karpathy-stanford-llm-to-graph",
        "title": "Karpathy Stanford: LLM to Graph",
        "date": "2026-08-31",
        "source": "codila (@0xCodila)",
        "url": "https://x.com/0xcodila/status/2087976384324890626",
        "takeaway": "Raw model → prompt → agent → loop → graph: each rung buys reliability with structure, not cleverness.",
        "summary": "Karpathy's framework for how far you can push an LLM: start with a raw model, add a prompt, wrap it as an agent, let it loop, then connect multiple agents in a graph. His claim: a graph of simple agents beats a single clever prompt.",
        "points": [
          "10% - LLM: treat the model as a general-purpose computer reprogrammed at runtime",
          "30% - Prompt: give that computer a natural-language program",
          "50% - Agent: add goal, context, memory and tools so prediction becomes action",
          "70% - Loop: separate the inner loop (learns from context) from the outer loop (updates weights via training)",
          "100% - Graph: organize multiple agents as data-dependent message passing over a directed graph"
        ],
        "tryIt": "Watch the 1-hour talk, then sketch your current Copilot CLI/agent setup as LLM→Prompt→Agent→Loop→Graph to see which stage you're actually stuck at.",
        "caveat": "It's a mental model, not a library - no code to run; value only comes from actually applying it to a real agent design.",
        "flow": {
          "steps": [
            "LLM",
            "Prompt",
            "Agent",
            "Loop",
            "Graph"
          ]
        }
      },
      {
        "slug": "loop-vs-graph-engineering-explainer",
        "title": "Loop vs Graph Engineering Explainer",
        "date": "2026-09-13",
        "source": "Sumanth (@Sumanth_077)",
        "url": "https://x.com/sumanth_077/status/2097689190712692965",
        "takeaway": "Start with one loop for one coherent task; move to a graph only for parallelism, different permissions or human gates.",
        "summary": "Clear definitions: a \"loop\" is one agent's own plan→act→verify→repeat cycle; a \"graph\" is the layer above that wires multiple loops/tools/agents together via explicit nodes and edges. You start with a loop for one coherent task, move to a graph once work needs parallelism, different permissions, or human approval steps.",
        "points": [],
        "caveat": "High-level framing only, no code or repo attached.",
        "flow": {
          "steps": [
            "Task given to agent",
            "Plan",
            "Act",
            "Verify, repeat or stop"
          ]
        }
      },
      {
        "slug": "loops-and-graphs-approval-course",
        "title": "Loops and Graphs: Approval Course",
        "date": "2026-09-13",
        "source": "Hanako (@hanakoxbt)",
        "url": "https://x.com/hanakoxbt/status/2091515787366306154",
        "takeaway": "A loop needs a check that can fail. Gate approvals on blast radius, and retry only the failing unit.",
        "summary": "The most practical of the four loop/graph posts. A loop is only real if it has a check that can fail (not just \"no error = success\"). A graph is nodes (splitter, worker, code node, gate) and edges (only where one step's output actually feeds the next - if you can't name the variable that crosses, there's no real dependency and you're waiting for nothing). The key operational advice: gate approvals on how expensive a mistake is to undo (blast radius), not on the model's self-reported confidence; and when a step fails, send back only the failing unit, never the whole batch.",
        "points": [
          "A loop = produce, check, correct, repeat until green - write the failure condition first, before the work itself",
          "A graph's nodes come in four types: splitter (cuts work into units), worker (does one unit in its own context), code node (deterministic merging/dedup - no model needed), gate (approves or rejects)",
          "Edges should only exist where output truly feeds the next step; chained-but-independent steps (\"summarize, then check weather\") don't need an edge",
          "Two return paths: a short \"correction\" edge sends one failing unit back to be fixed; a long \"learning\" edge turns a confirmed cause into a constraint for the splitter, so future runs don't repeat it",
          "Gate decisions should sort by blast radius (reversible & contained vs reversible-but-wide vs hard-to-reverse/irreversible), not by model confidence score"
        ],
        "caveat": "No code/repo, just a written framework; needs translating into your own orchestration tooling to be useful.",
        "flow": {
          "steps": [
            "Splitter cuts work into units",
            "Workers process units",
            "Gate checks blast radius",
            "Approve or send unit back"
          ]
        }
      },
      {
        "slug": "agent-graphs-beat-agent-chains",
        "title": "Agent Graphs Beat Agent Chains",
        "date": "2026-09-20",
        "source": "rvaniaaaa (@rvaniaaaa)",
        "url": "https://x.com/rvaniaaaa/status/2101296533899510266",
        "takeaway": "Fan out single-purpose workers, reduce with plain code, and verify with a fresh skeptic that never saw the worker's context.",
        "summary": "Argues most multi-agent systems are slow not because of weak models but because they're built as a straight-line sequence of steps; running independent steps as a parallel graph instead removes most of the wasted waiting.",
        "points": [
          "A node = one agent with one job (e.g. review one file); an edge = a real data dependency, not an arbitrary wait someone invented",
          "Fan out: run many single-purpose agents in parallel (one per competitor, file, or claim)",
          "Reduce: combine results with plain code, spending no extra model tokens",
          "Verify: a fresh \"skeptic\" agent checks each finding - critically, with its own clean context, never the worker's conversation history",
          "Synthesize once from what survived verification"
        ],
        "caveat": "The $165K/535K-line case is a single anecdote with no linked source or repro; this is an architectural pattern to borrow, not a tool to install.",
        "flow": {
          "steps": [
            "Fan out: parallel agents",
            "Reduce: plain code",
            "Verify: fresh context",
            "Synthesize once"
          ]
        }
      },
      {
        "slug": "andrew-ng-graph-engineering-course",
        "title": "Andrew Ng Graph Engineering Course",
        "date": "2026-08-30",
        "source": "Mahax (@Mahaximus_)",
        "url": "https://x.com/mahaximus_/status/2087243572361994678",
        "takeaway": "A free, structured way to learn the graph pattern end to end.",
        "summary": "A free, structured course that walks from a single basic agent up to a full \"graph\" of agents that can modify their own structure - aimed at people who already know simple agent loops and want the next level.",
        "points": [
          "Starts with a single agent calling a single tool",
          "Builds up \"loop engineering\" - an agent repeating steps until done",
          "Moves to \"graph engineering\" - multiple agents/steps wired as a graph, not just a straight loop",
          "Shows agents that can rewrite their own graph structure",
          "Ends with a full multi-agent graph system"
        ],
        "tryIt": "Watch the video, then follow the companion guide the poster references (not fetched in this research).",
        "caveat": "2 hours long, no repo or written guide fetched here - would need to watch to extract anything concrete.",
        "flow": {
          "steps": [
            "Single agent",
            "Loop engineering",
            "Graph engineering",
            "Self-rewriting graph system"
          ]
        }
      },
      {
        "slug": "strands-decider-at-amazon",
        "title": "Strands Decider at Amazon",
        "date": "2026-11-12",
        "source": "Strands Agents",
        "url": "https://strandsagents.com/blog/amazon-saves-millions-replacing-sonnet-with-strands-decider/",
        "takeaway": "For closed choices from a stable catalogue, a decision model can hold quality at a fraction of the cost.",
        "summary": "Amazon engineers replaced Claude Sonnet 4.6 with a small decision model to label tickets into 20 categories. Quality held, cost dropped about 98%.",
        "points": [
          "A decision model gets state plus a question with options and returns a probability per option and a confidence; it cannot write text.",
          "Ticket events go SQS to Lambda to a SageMaker endpoint running the E4B (Gemma 4) build on ml.g5.xlarge.",
          "An AppConfig switch with three modes (BEDROCK, DUAL, DECIDER) let them run both models on real traffic and compare.",
          "Label descriptions were rewritten as 1-2 sentence options to fit a 4,096-token window."
        ],
        "tryIt": "`pip install strands-decider`",
        "caveat": "Only fits closed choices from a stable catalog with short context. Vendor blog. Needs GPU hosting.",
        "flow": {
          "steps": [
            "Ticket event",
            "SQS queue",
            "Lambda reads AppConfig mode",
            "SageMaker decider endpoint",
            "Label applied"
          ]
        }
      },
      {
        "slug": "gemini-decision-1",
        "title": "Gemini Decision 1",
        "date": "2026-11-12",
        "source": "Logan Kilpatrick (@OfficialLoganK)",
        "url": "https://x.com/OfficialLoganK/status/2120581433639198885",
        "takeaway": "A hosted decision model for cheap classification and routing steps inside a larger agent.",
        "summary": "A decision model picks from given options instead of writing text. Google now offers one in the Gemini API, free to try.",
        "points": [
          "You send state plus a question with options; the model returns its choice (see section m for how decision models work).",
          "Inputs can be image, audio, video or PDF; 256K context window."
        ],
        "caveat": "\"1K questions\" is not explained in the post. No accuracy data captured.",
        "flow": {
          "steps": [
            "Input: text, image, PDF",
            "Question with options",
            "Gemini Decision 1",
            "Chosen option"
          ]
        }
      }
    ]
  },
  {
    "slug": "ai-native-engineering",
    "title": "AI-native engineering",
    "kicker": "How teams actually ship with agents",
    "description": "Practices from teams running agents across the whole delivery lifecycle: verification, layered review, cost control and keeping humans in charge of the reasoning.",
    "readTime": "9 min read",
    "entries": [
      {
        "slug": "lauren-tan-slop-into-gold",
        "title": "Lauren Tan: Slop into Gold",
        "date": "2026-11-17",
        "source": "Alejo (@ecommartinez)",
        "url": "https://x.com/ecommartinez/status/2122049134660034936",
        "takeaway": "Talk: turn every agent correction into a lint rule and invest in verification.",
        "summary": "Lauren Tan explains how her team made the codebase trustworthy enough that agents merge most of their own PRs. The core move: turn every correction into a deterministic check (lint rule, type, architecture) and spend most tokens on verification, not generation.",
        "points": [
          "An \"inverse pyramid\" of where to invest: code and API design, then lint rules, types and tests, then runtime and formal verification, then a little prose (rules, skills, AGENTS.md).",
          "The codebase is the agent's biggest input, so anti-patterns get copied; keep it clean.",
          "Agents produce verification artifacts (videos, screenshots, diagrams) that replace most code review."
        ],
        "caveat": "Numbers are the speaker's claims, not independently checked. Taken from an auto-generated transcript, so names like GrokBot, Dune, PStack and Bombadil may be misspelled. Auto-merge without human review depends on very strong checks.",
        "flow": {
          "steps": [
            "Agent makes a mistake",
            "Add lint rule or API constraint",
            "Agent verifies with tests and recordings",
            "Agent merges its own PR"
          ]
        },
        "tryIt": "Next time you correct an agent, add a lint rule, type or test that catches the mistake instead of another line in AGENTS.md."
      },
      {
        "slug": "copilot-fusion-benchmarks",
        "title": "Copilot Fusion Benchmarks",
        "date": "2026-11-18",
        "source": "Jorge Balderas",
        "url": "https://www.linkedin.com/posts/balderas_microsoftignite-githubcopilot-copilotfusion-share-7528585745163472896-XsNi/",
        "takeaway": "Copilot Fusion tops Terminal-Bench 4.1, and a hands-on test shows a wide cost gap between five models.",
        "summary": "Terminal-Bench compares whole agent harnesses (model plus orchestration, tools and runtime), and Copilot Fusion now leads version 4.1 per the keynote. The author then ran one personal prompt across five models and found large cost differences for similar run times.",
        "points": [
          "Terminal-Bench ([tbench.ai](https://www.tbench.ai/)) scores agents doing terminal tasks, so the harness matters, not only the model.",
          "The author used the VS Code Agents feature Compare Model Results with the prompt \"Implement shopping cart using cart.png\".",
          "Cost is shown in AI Credits (1 credit = $0.01 USD).",
          "Headline claim: Fusion scores 71.2% on Terminal-Bench 4.1, against 65.8% for Claude Opus 5.5 in Claude Code, at 57% lower cost.",
          "In the personal test, Fusion used 2.9 credits and MAI Code 2 used 14.3, while Claude Opus 5.5, Gemini 4 Carbon and GPT-6.2 Sol used 129 to 159; most finished in 17 to 20 minutes."
        ],
        "caveat": "The personal test is one prompt, one run. The author appears to work on GitHub Copilot, and the benchmark claim is GitHub's own. The author's own takeaway: test against your actual workloads.",
        "flow": {
          "steps": [
            "One prompt",
            "Compare Model Results",
            "Five models run in parallel",
            "Compare credits, time and output"
          ]
        },
        "tryIt": "In VS Code Agents, run one of your own prompts through Compare Model Results and compare credits, time and output."
      },
      {
        "slug": "claude-code-team-code-review",
        "title": "Claude Code Team Code Review",
        "date": "2026-11-06",
        "source": "claude.dev Blog",
        "url": "https://claude.dev/blog/solving-code-review-at-anthropic/",
        "takeaway": "Move code reading to machines in layers, track reverts as the guardrail, and spend human attention where the risk is.",
        "summary": "Claude writes about 90% of Claude Code's code, so the team moved most code reading to machines and optimised for human attention. From June to September merged PRs more than doubled while the revert share fell by over 40%.",
        "points": [
          "Goal: most PRs merge with at most one human in the loop (can be the author) with no rise in reverts or incidents. They track human approvals per PR, comments and wait time; revert and incident rates are the guardrail.",
          "Layer 1, before a PR exists: Claude must show verification output (tests, build, screenshot), then a fresh-context subagent reviews the diff. Repeated findings are fixed at the source via skills, lint rules, CLAUDE.md and REVIEW.md (owner-written: what failure looks like, cap nits, require file and line evidence).",
          "Layer 2: AI review on every PR (Quick / Standard / Deep). Several agents hunt bugs in parallel, another group votes, and only agreed findings are posted, tagged Important, Nit or Pre-existing. Every finding must be fixed or resolved with a reason.",
          "Layer 3: blocking security review (also available as an open-source GitHub Action and /security-review). Layer 4: lint, types, tests and build. Fast rollback sits under all layers.",
          "Context: Anthropic's monorepo went from about 2,500 changes per day in May to more than 30,000 in September."
        ],
        "tryIt": "run `/code-review` or `/security-review` inside Claude Code",
        "caveat": "Code Review for Claude Code is on Team and Enterprise plans. Numbers are self-reported by the vendor. Research text stopped after layer 4.",
        "flow": {
          "steps": [
            "Author plus Claude verify locally",
            "Subagent diff review",
            "AI PR review with voting",
            "Blocking security review and CI",
            "Human check where risk is"
          ]
        }
      },
      {
        "slug": "critical-thinking-with-agents",
        "title": "Critical Thinking With Agents",
        "date": "2026-11-06",
        "source": "Addy Osmani (@addyosmani)",
        "url": "https://x.com/addyosmani/status/2117512471930167377",
        "takeaway": "Offload, don't surrender: form a hypothesis first and define what 'verified' means before the agent starts.",
        "summary": "As models improve, outputs are mostly right and rarely demand a second look, so engineers slowly stop checking them. Osmani gives a spectrum (offloading, deferral, surrender) and a set of questions to keep ownership of the reasoning while still using agents heavily.",
        "points": [
          "**Offloading** (good): you delegate the task but keep ownership of the result. **Deferral**: the agent's output becomes your input and stops being a hypothesis. **Cognitive surrender** (term from Steven Shaw and Gideon Nave, Wharton): the output quietly becomes yours and you no longer check it.",
          "Surrender builds \"comprehension debt\": code looks clean and tests pass, but nobody can explain it when it must change. He notes the Claude Code team rebuilds understanding on demand by asking Claude to explain a slice.",
          "Rule of thumb: delegate fully where being wrong is cheap; keep the reasoning where others live with the consequences.",
          "Self-check questions: Did I form a hypothesis before asking? Am I using it to help me think or to replace thinking? What would have to be true for this to be wrong? Have I heard the counter-argument (ask another model to argue the opposite)? Would I bet on this in front of its maintainer? What am I no longer practising?",
          "Verification is the new bottleneck: give the agent a way to verify (tests, property tests, app interaction), but beware \"surrendered verification\" - a green check written with the same mistake as the feature proves nothing. Define \"verified\" upfront."
        ],
        "caveat": "Opinion essay, no data. The article text was truncated in research, so the ending is not covered.",
        "flow": {
          "steps": [
            "Write hypothesis first",
            "Delegate to agent",
            "Agent verifies with tests",
            "Ask what the check did not prove",
            "Own the decision"
          ]
        }
      },
      {
        "slug": "uber-software-factory-cost",
        "title": "Uber Software Factory Cost",
        "date": "2026-08-31",
        "source": "Uber Engineering (@UberEng)",
        "url": "https://x.com/ubereng/status/2093444169037762840",
        "takeaway": "Benchmark models on your own real work, route subagents to cheaper models and cap reasoning effort by default.",
        "summary": "How Uber runs AI coding agents across its whole SDLC (70%+ of PRs touched by agents, 3,600+ agent skills, 30K agent-skill runs/day) while cutting cost: pick the cheapest model that still passes a real-work benchmark, use weaker models for subagents, cache prompts longer, and cap reasoning effort.",
        "points": [
          "Build a benchmark from real work (e.g. real PRs with known bugs, graded easy/medium/hard)",
          "Run every candidate model (frontier or open-weight) on that benchmark behind one harness",
          "Pick whatever model is Pareto-optimal for cost vs quality right now, and keep re-checking as models change",
          "Default subagents (well-defined, low-reasoning sub-tasks) to cheaper models; keep the primary model on frontier for planning/evaluation",
          "Cap reasoning effort at \"Medium\" by default and auto-compact context at 400K tokens to cut output/input token spend",
          "Use a 1-hour prompt-cache TTL for interactive sessions (vs 5 min) since engineers often go idle >5 min between turns; keep subagents on 5-min TTL since their tasks are short"
        ],
        "tryIt": "Start small - build a 10-20 example benchmark from your own recent PRs/tasks and compare 2 models on cost vs pass rate before committing to one everywhere.",
        "caveat": "These are Uber's own numbers on Uber's own codebase/scale - explicitly stated as not directly transferable; replicating this needs a real benchmark harness and multi-model routing setup, which is itself a project, not a config change.",
        "flow": {
          "steps": [
            "Real PRs / work",
            "Benchmark harness",
            "Try frontier + open-weight models",
            "Pick Pareto-optimal model",
            "Re-check as models shift"
          ]
        }
      },
      {
        "slug": "meta-forum-ai-native-engineering",
        "title": "Meta Forum: AI-Native Engineering",
        "date": "2026-10-25",
        "source": "Engineering at Meta",
        "url": "https://engineering.fb.com/2026/10/15/ml-applications/how-meta-built-forum-ai-native-engineering/",
        "takeaway": "Precise specs, automated checks inside the loop, and rules added only after a mistake repeats.",
        "summary": "A small Meta team built Forum, a standalone Groups app, with an AI agent running the plan-build-test-fix loop. They moved from \"human-in-the-loop\" (person drives each step) to \"human-on-the-loop\" (agent drives, person sets goal and approves). Success was measured as verified changes that build, pass tests and survive review, not lines of code.",
        "points": [
          "Planning as precise, machine-readable specs: ambiguity makes agents fail",
          "Automated checks (build, unit tests, UI spec matching) inside the agent loop; PRs arrive with test plans and recorded verification sessions",
          "Navigation agents use the live app like a person and report regressions; agents also triage user feedback after launch",
          "Operating model: Rules (permanent instructions, added after a mistake repeats twice), Skills, Agents, Commands (chained workflows) and Hooks (e.g. lint after every agent turn)",
          "Gave agents tools to inspect the live view hierarchy instead of text descriptions; a separate sandbox build flavor keeps prototype code out of production"
        ],
        "caveat": "Internal Meta tooling; no numbers on overall speed-up in the readable text.",
        "flow": {
          "steps": [
            "Engineer sets goal and spec",
            "Agent plans and codes",
            "Build, tests, UI checks",
            "Agent fixes and repeats",
            "Engineer reviews PR with evidence"
          ]
        }
      },
      {
        "slug": "airbnb-airchat-async-agents",
        "title": "Airbnb AirChat: Async Agents",
        "date": "2026-10-25",
        "source": "getdx.com podcast",
        "url": "https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/",
        "takeaway": "Adoption came from treating internal AI tooling as a product, not from mandates.",
        "summary": "Airbnb reached wide agentic AI use through its internal AirChat platform without mandates, and saw large output gains. They now focus on asynchronous agents (many agents running long tasks without constant watching).",
        "points": [
          "Treat internal AI tools like products: brand, onboarding, workshops, internal marketing",
          "Community learning: AI champions, train-the-trainer, hackathons",
          "Tooling: AirChat CLI, AirChat SDK (teams build their own AI apps), AirChat Remote (async agents), migration tooling"
        ],
        "tryIt": "Watch on YouTube: https://www.youtube.com/watch?v=lL9-yATNAo0",
        "caveat": "Self-reported company metrics; 40-minute talk."
      },
      {
        "slug": "claude-code-token-costs-and-cache",
        "title": "Claude Code: Token Costs and Cache",
        "date": "2026-10-27",
        "source": "Residual (@res1dualedge)",
        "url": "https://x.com/res1dualedge/status/2114100837119037817",
        "takeaway": "Every tool result becomes future input: keep sessions focused, keep prefixes stable, and measure whole tasks.",
        "summary": "The attached video explains where Claude Code tokens go and how to reduce wasted work without removing useful context. Its central mechanism is the growing request history: every tool result becomes input to later requests, while an unchanged prefix can use the cheaper prompt cache. Choose the model and effort deliberately, keep each session focused, and measure cache use before assuming that more agents or fewer prompts will save money.",
        "points": [
          "The harness assembles the current request from instructions, available tools and accumulated history.",
          "The model emits an answer or a tool call. The harness executes tool calls and appends their results.",
          "An identical initial prefix can reuse the prompt cache. New material still needs processing.",
          "Context hygiene reduces repeated input. Matching model and effort to the task controls the cost of processing that input and producing output.",
          "Measure the complete task, including subagents and retries, rather than comparing final-answer length."
        ],
        "tryIt": "Inspect the context and usage views in your installed Claude Code version, then run one known task in a fresh session with the existing quiet test command. Check current product help before changing any setting.",
        "caveat": "Pricing, cache lifetimes, settings and model-specific exceptions are the speaker's claims at recording time and can change. Speech recognition mishears some product names and command spellings, so uncertain model names and exact configuration keys are deliberately omitted. The video does not supply a reproducible swarm implementation or controlled cost benchmark."
      },
      {
        "slug": "boris-cherny-on-claude-code-prompting",
        "title": "Boris Cherny on Claude Code Prompting",
        "date": "2026-10-07",
        "source": "Deep Genius AI (@Deep_GeniusAi)",
        "url": "https://x.com/deep_geniusai/status/2107132153582547307",
        "takeaway": "The biggest lever is giving the agent a way to verify its own work.",
        "summary": "A thread-split recording of a ~28-minute talk by Anthropic engineer Boris Cherny (creator of Claude Code) given at the \"Code w/ Claude\" event. It's less \"prompt wording tips\" and more practical setup: CLAUDE.md project memory files, keyboard/memory shortcuts, and running parallel Claude Code sessions for bigger tasks.",
        "points": [
          "CLAUDE.md: a project-root file Claude Code reads automatically for persistent context (conventions, architecture notes, do/don't rules), so you don't repeat yourself every session.",
          "Memory shortcuts: commands to save/recall context mid-session instead of re-explaining.",
          "Parallel sessions: running multiple Claude Code instances on different parts of a task at once.",
          "Prompting technique: structuring asks around the tool's actual settings rather than just wording the request differently."
        ],
        "tryIt": "Create a `CLAUDE.md` in a repo root with project conventions and architecture notes, then open a Claude Code session there and see if it's picked up automatically.",
        "caveat": "Video content only (no written doc), French-language repost framing, no repo or artifact to inspect directly - treat as a workflow idea to validate hands-on."
      },
      {
        "slug": "karpathy-s-llm-output-tips",
        "title": "Karpathy's LLM Output Tips",
        "date": "2026-10-04",
        "source": "Andrej Karpathy (@karpathy)",
        "url": "https://x.com/karpathy/status/2105819303471976479",
        "takeaway": "When output is hard to understand, climb the ladder: plain controlled English, then a diagram, then an interactive page.",
        "summary": "As models write more of our work, the bottleneck shifts to us understanding the output. Karpathy lays out an escalating ladder of output formats to make that easier: controlled-English text, then diagrams, then interactive HTML pages, then fully custom explainer videos (e.g. \"3blue1brown style\" with narration).",
        "points": [
          "Ask for ASD-STE100 (or \"80% of the way there\") instead of normal prose for cleaner writing",
          "If text is still hard to parse, ask for a diagram instead",
          "If a diagram isn't enough, ask for an interactive HTML page",
          "If that isn't enough, ask for a bespoke narrated explainer video (needs an API key, e.g. ElevenLabs, or a free local alternative)"
        ],
        "tryIt": "Ask your agent: \"Explain this in ASD-STE100, then as a diagram if that's clearer.\"",
        "caveat": "Video generation step needs an API key (cost) and is described as \"just starting to work\" - least mature rung of the ladder.",
        "flow": {
          "steps": [
            "Plain text answer",
            "Controlled English",
            "Diagram",
            "HTML page",
            "Explainer video"
          ]
        }
      },
      {
        "slug": "elephant-goldfish-model-spec-review",
        "title": "Elephant-Goldfish Model: Spec Review",
        "date": "2026-11-16",
        "source": "Pallavi Ahuja",
        "url": "https://www.linkedin.com/posts/progressivethinker_googles-19k-star-github-repo-deliberately-share-7527645218007912448-EU7L/",
        "takeaway": "If a reviewer with no chat history cannot follow the spec, the spec is not finished.",
        "summary": "An agent plugin where one agent (the Elephant) keeps the full conversation and drafts the spec, and fresh agents (Goldfish) review the spec with no chat history. If a reader without the conversation cannot follow the design, the doc is not finished.",
        "points": [
          "Elephant holds project context and drafts the specification.",
          "Goldfish reviewers get only the document and its referenced source files.",
          "They check design sense, clarity, fit with the code and implementation readiness.",
          "You resolve findings and approve the spec before implementation.",
          "Seven skills: brainstorming, drafting, independent review, resolution, codebase docs and doc drift checks."
        ],
        "tryIt": "`claude plugin marketplace add google/elephant-goldfish-model && claude plugin install egm@egm`, then `/egm:egm-review docs/designs/<doc>.md`",
        "caveat": "As one commenter says, it grades legibility, not correctness: a clear spec can still be wrong about the world. Licence not stated.",
        "flow": {
          "steps": [
            "Engineer and Elephant agent",
            "Draft spec",
            "Fresh Goldfish reviewers",
            "Findings",
            "Engineer approves"
          ]
        }
      },
      {
        "slug": "ai-coding-dictionary",
        "title": "AI Coding Dictionary",
        "date": "2026-11-12",
        "source": "GitHub",
        "url": "https://github.com/mattpocock/dictionary-of-ai-coding",
        "takeaway": "A shared vocabulary for sessions, context, failure modes and handoffs makes team conversations about agents faster.",
        "summary": "Matt Pocock's glossary of AI coding terms in seven sections: the model, sessions and context, tools, failure modes, handoffs, memory and steering, and patterns of work.",
        "points": [],
        "caveat": "Includes a newsletter plug."
      }
    ]
  },
  {
    "slug": "agent-security",
    "title": "Agent security",
    "kicker": "Sandboxes, injection & supply chain",
    "description": "What changes when software reads untrusted content and acts on it: prompt injection defences, isolation designs and a practical open-source security stack.",
    "readTime": "4 min read",
    "entries": [
      {
        "slug": "github-marketplace-badges",
        "title": "GitHub Marketplace Badges",
        "date": "2026-11-17",
        "source": "GitHub Docs",
        "url": "https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/about-marketplace-badges",
        "takeaway": "What the publisher-verified badge means and does not mean.",
        "summary": "Explains the two Marketplace app badges. The \"Publisher domain and email verified\" badge checks the publisher organisation, not the app's code.",
        "points": [
          "Verified badge: org verified its domain, confirmed its email for GitHub Support, and requires 2FA.",
          "GitHub does not analyse or inspect third-party code; publishers maintain their apps.",
          "\"App meets the requirements for listing\" badge: app meets listing rules but publisher is not verified; such apps cannot change pricing plan until verified."
        ],
        "tryIt": "Check the badge tooltip on any Marketplace app listing before installing.",
        "caveat": "Docs page; no dates or stats.",
        "flow": {
          "steps": [
            "Publisher org",
            "Verify domain, email and 2FA",
            "Verified badge",
            "Code still not inspected by GitHub"
          ]
        }
      },
      {
        "slug": "uber-mcp-gateway-design",
        "title": "Uber MCP Gateway Design",
        "date": "2026-11-21",
        "source": "Shannon Williams",
        "url": "https://www.linkedin.com/posts/smw355_uber-engineering-published-the-design-of-share-7524014804051611649-Yyrc/",
        "takeaway": "Registry-first, disabled-by-default gateway for 800 MCP servers.",
        "summary": "A summary of Uber's MCP gateway (MCP = Model Context Protocol, the standard way to give AI agents tools). Every discovered server and tool starts disabled; the owning team must turn it on, and later changes to a tool description go through config review.",
        "points": [
          "A crawler discovers MCP servers and tools; all start disabled.",
          "Owners enable what they stand behind; tool description changes become a config diff to approve, deploy or roll back.",
          "Access is checked per server and per tool with the same policy system used for humans and services.",
          "PII redaction on responses by default, plus a discovery layer so the model only loads tools it needs.",
          "Scale: 800 MCP servers and 5,000 tools. The lesson: registry first, allowlist by default, then widen; teams that start open spend months finding what is wired in."
        ],
        "caveat": "The poster sells Obot, a competing product. Read the original [Uber post](https://www.uber.com/blog/designing-mcp-gateway/) for details.",
        "flow": {
          "steps": [
            "Crawler finds MCP tools",
            "Registry, disabled by default",
            "Owner reviews and enables",
            "Policy check per tool",
            "Agent sees allowed tools only"
          ]
        },
        "tryIt": "List the MCP servers your agents can reach, and start any new one disabled until its owner enables it."
      },
      {
        "slug": "anthropic-beats-prompt-injection",
        "title": "Anthropic Beats Prompt Injection",
        "date": "2026-08-30",
        "source": "Boris Cherny (@bcherny)",
        "url": "https://x.com/bcherny/status/2086520950259118464",
        "takeaway": "Defence is layered (training, input probes, intent checks), and 'largely solved' still means sandbox anything holding real credentials.",
        "summary": "Prompt injection is when a webpage or document an agent reads contains hidden instructions (e.g., \"send the user's SSH keys to evil.com\") that the AI model mistakes for a real command from its user. Anthropic says training plus input filtering plus an intent-checking classifier has pushed this close to zero on their Claude models, based on an independent benchmark in the Claude Opus 5 system card.",
        "points": [
          "Model training specifically against injected instructions in fetched content",
          "Input probes that scan content before the model sees it",
          "A classifier that checks whether a detected \"instruction\" matches user intent",
          "Stacking all three layers together, not any single fix"
        ],
        "tryIt": "Read the Claude Opus 5 system card (page 73) for the actual benchmark numbers before relying on this for anything sensitive.",
        "caveat": "Anthropic self-reported (\"surprisingly positive\"), independent benchmark exists; \"largely solved\" is not \"solved\" - still worth sandboxing agents with real credentials.",
        "flow": {
          "steps": [
            "Agent fetches webpage",
            "Input probes scan content",
            "Intent classifier checks instructions",
            "Model ignores injected command"
          ]
        }
      },
      {
        "slug": "perplexity-space-sandbox",
        "title": "Perplexity SPACE Sandbox",
        "date": "2026-10-18",
        "source": "Perplexity (@perplexity_ai)",
        "url": "https://x.com/perplexity_ai/status/2110778478312481167",
        "takeaway": "A reference design for isolating agent execution from the systems it touches.",
        "summary": "SPACE (Sandboxed Platform for Agentic Code Execution) runs agent or user code in isolated Firecracker microVMs (tiny, fast-booting virtual machines). Your app uses an HTTP API to create Linux sandboxes, run commands, read output, and pause or delete them.",
        "points": [
          "A template gives the starting environment; a sandbox is an instance with its own VM and writable filesystem",
          "Lifecycle changes are asynchronous: the API returns an operation ID you poll",
          "Command output streams over a separate data-plane connection with a session-scoped token",
          "Sandboxes can be kept, paused or suspended and woken later",
          "Credentials and outbound traffic are controlled from outside the VM"
        ],
        "tryIt": "Follow docs/installation.md to deploy in a local Kind cluster.",
        "caveat": "Repo created 2026-10-01, so it is young. Needs Kubernetes knowledge for the default setup.",
        "flow": {
          "steps": [
            "Your app",
            "Create sandbox from template",
            "Start command session",
            "Read output and exit code",
            "Pause, suspend or delete"
          ]
        }
      },
      {
        "slug": "digitalocean-managed-agents",
        "title": "DigitalOcean Managed Agents",
        "date": "2026-09-26",
        "source": "DigitalOcean (@digitalocean)",
        "url": "https://x.com/digitalocean/status/2102414817797550320",
        "takeaway": "Managed, sandboxed agent runs are becoming a commodity platform service.",
        "summary": "A new DigitalOcean cloud service that hosts AI coding agents (Claude Code, Codex, OpenCode, LangGraph, etc.) in isolated microVMs that pause when idle, so you only pay for CPU time the agent is actively using, with one governed endpoint for tools and a choice of 75+ models.",
        "points": [
          "You pick an agent (Claude Code, Codex CLI, OpenCode, Hermes, or custom LangGraph) and DigitalOcean runs it unmodified in an isolated microVM",
          "The runtime pauses automatically when the agent is idle (waiting on model or tool calls costs $0)",
          "Tools the agent can call are exposed behind one governed endpoint instead of managed separately",
          "You choose from 75+ open and proprietary models, billed through one DigitalOcean account",
          "Sessions can be closed and resumed later from another device, continuing the same agent state"
        ],
        "tryIt": "See the getting-started prompts in DigitalOcean's blog post: https://do.co/4ysh3it",
        "flow": {
          "steps": [
            "Developer starts agent",
            "Runs in isolated microVM",
            "Pauses when idle, resumes on demand",
            "Billed only for active CPU time"
          ]
        }
      },
      {
        "slug": "open-source-security-review-stack",
        "title": "Open-source Security Review Stack",
        "date": "2026-11-06",
        "source": "saed (LinkedIn)",
        "url": "https://www.linkedin.com/posts/saedf_binance-lost-63-billion-because-one-engineers-share-7524082239333150720--03V/",
        "takeaway": "Gitleaks, zizmor and SkillSpector are quick wins when code ships at agent speed.",
        "summary": "Argues that code ships faster with AI but security review has not sped up, and lists 11 open-source tools to automate the obvious checks.",
        "points": [
          "Agent-driven review: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (★63569, six-phase audit where a fresh verifier tries to disprove each finding), [anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review) (★6762, PR GitHub Action), Strix (AI pentest agents).",
          "Agent supply chain: [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) (★24651) scans agent skills for prompt injection and exfiltration; its README says 26.1% of 31,132 analysed skills had vulnerabilities and 5.2% showed likely malicious intent. garak attacks LLM apps with jailbreaks.",
          "Classic: Semgrep (rules), Gitleaks and TruffleHog (secrets), OSV-Scanner (vulnerable deps), zizmor (GitHub Actions holes), Nuclei (running services)."
        ],
        "tryIt": "`gitleaks git .` (check the Gitleaks README for current syntax)",
        "caveat": "The claude-code-security-review README says it is not hardened against prompt injection; use only on trusted PRs. Incident figures are from the post, not verified.",
        "flow": {
          "steps": [
            "Commit",
            "Secrets scan",
            "SAST and deps scan",
            "AI security review on PR",
            "Runtime scan in prod"
          ]
        }
      },
      {
        "slug": "gh-secure-github-cli-extension",
        "title": "gh-secure GitHub CLI Extension",
        "date": "2026-10-03",
        "source": "Miguel Ángel Durán (@midudev)",
        "url": "https://x.com/midudev/status/2106007255095050537",
        "takeaway": "A fast way to audit repository security settings from the terminal.",
        "summary": "An official GitHub Security Lab `gh` CLI extension that turns on five repo security features — branch protection, private vulnerability reporting, secret scanning, Dependabot and code scanning — in one command, with no security expertise required beyond repo admin access.",
        "points": [
          "Installs as a `gh` CLI extension (`gh extension install GitHubSecurityLab/gh-secure`)",
          "Interactive mode walks you through each feature, or `--yes` enables everything non-interactively",
          "You can target specific features by name/shorthand (e.g. `bp` for branch-protection, `cs` for code-scanning)",
          "`--dry-run` previews changes before applying them",
          "`status` subcommand reports which features are already on for a repo",
          "Also usable from GitHub Copilot CLI or Copilot App as a tool an AI assistant can call"
        ],
        "tryIt": "`gh extension install GitHubSecurityLab/gh-secure && gh secure status`",
        "caveat": "Needs repo admin/maintainer permissions; no license listed on the repo (check before vendoring/forking); always run `--dry-run` first on repos with existing custom branch rules, since the tool warns about but does not fully reconcile overlapping rulesets.",
        "flow": {
          "steps": [
            "gh secure command",
            "Checks current repo settings",
            "Enables selected security features",
            "Hardened repo"
          ]
        }
      }
    ]
  },
  {
    "slug": "skills-and-harness",
    "title": "Skills & harness",
    "kicker": "Instructions, plugins & workflows",
    "description": "The layer around the model: skills, instruction files, plugins and CI workflows that make agents consistent across people and repositories.",
    "readTime": "6 min read",
    "entries": [
      {
        "slug": "github-copilot-evals",
        "title": "GitHub Copilot Evals",
        "date": "2026-11-18",
        "source": "The GitHub Blog",
        "url": "https://github.blog/changelog/2026-11-17-github-copilot-evals-is-now-in-public-preview/",
        "takeaway": "Repeatable tests for your Copilot skills, agents and MCP tools.",
        "summary": "An eval is a repeatable test for AI behaviour: a realistic task plus a description of a good result, checking both the result and how the agent got there. Copilot Evals lets you create, run and compare these for your own skills, custom agents and MCP tools, so a change does not silently make things worse.",
        "points": [
          "Ask in plain words or use `/eval` (`setup`, `create`, `review`, `improve`, `run`, `compare`).",
          "You approve each run before it starts; results show passed and failed checks and why.",
          "Compare runs before and after a customisation change.",
          "The engine is Vally, an extensible local eval tool; the plugin bundles six skills, three automation blueprints, an Evals Canvas and a 15-tool MCP server."
        ],
        "tryIt": "In Copilot CLI, install the plugin per the [docs](https://aka.ms/evals), then run `/eval setup`.",
        "caveat": "Public preview; runs consume model usage. The tool is new, so expect changes.",
        "flow": {
          "steps": [
            "Skill agent or MCP tool",
            "Create eval",
            "Run and approve",
            "Pass and fail report",
            "Compare before and after"
          ]
        }
      },
      {
        "slug": "github-event-streams-preview",
        "title": "GitHub Event Streams Preview",
        "date": "2026-11-21",
        "source": "The GitHub Blog",
        "url": "https://github.blog/changelog/2026-11-17-github-event-streams-is-now-in-preview/",
        "takeaway": "Agents subscribe to PR events instead of polling.",
        "summary": "An agent subscribes to a pull request and keeps a connection open; GitHub pushes an event when something changes. No polling loop, and no public webhook endpoint, so it works for an agent running on a laptop.",
        "points": [
          "Subscribe to a PR, connect and keep the connection open.",
          "Events fire on: review submitted, new commits, merge conflict, merged or closed, check-suite changes and status changes (one event per check suite).",
          "Replaces polling, which either burns rate limit or delays reaction to review feedback."
        ],
        "tryIt": "Sign up at https://gh.io/event-streams-signup",
        "caveat": "Preview, waitlist only. Check the docs for auth and connection limits before building on it.",
        "flow": {
          "steps": [
            "Agent subscribes to PR",
            "Open connection to GitHub",
            "Review, commit or check event",
            "Agent wakes and acts"
          ]
        }
      },
      {
        "slug": "github-agentic-workflows-ga",
        "title": "GitHub Agentic Workflows GA",
        "date": "2026-11-06",
        "source": "The GitHub Blog",
        "url": "https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/",
        "takeaway": "Markdown-defined agents that compile to GitHub Actions, read-only by default with validated safe outputs.",
        "summary": "You write an automation in Markdown (plain-language instructions plus YAML frontmatter), and the `gh aw` CLI extension compiles it into a normal GitHub Actions workflow that runs a coding agent. Good for reasoning tasks like issue triage, CI failure analysis, doc updates and tests.",
        "points": [
          "Engines: GitHub Copilot (default, needs a Copilot licence), Claude Code, OpenAI Codex, Google Gemini or Pi; the model provider can be picked per workflow.",
          "Safeguards: agents are read-only by default, run in a sandboxed container behind the Agent Workflow Firewall, writes go through validated \"safe outputs\" jobs, and a threat-detection job scans proposed changes.",
          "New at GA: self-hosted ARC runners with Docker-in-Docker, `gh aw forecast` for AI credit budgeting, model routing by task difficulty, micro-VM isolation and \"enclaves\" for cross-repo workflows.",
          "Ready-made workflows in [githubnext/agentics](https://github.com/githubnext/agentics) (★1046): Issue Triage, Repo Assist, CI Doctor, CI Coach, Grumpy Reviewer and more."
        ],
        "tryIt": "follow the [quickstart](https://github.github.com/gh-aw/setup/quick-start/), then `gh aw add-wizard`",
        "caveat": "README notes a past security advisory in some versions - stay on a current release. AI credit costs; the README says it complements, not replaces, deterministic CI.",
        "flow": {
          "steps": [
            "Markdown workflow file",
            "gh aw compile",
            "Actions YAML",
            "Sandboxed agent run",
            "Safe outputs to repo"
          ]
        }
      },
      {
        "slug": "claude-opus-5-5-prompt-audit",
        "title": "Claude Opus 5.5 Prompt Audit",
        "date": "2026-09-25",
        "source": "Dan McAteer (@daniel_mac8)",
        "url": "https://x.com/daniel_mac8/status/2102799218154881486",
        "takeaway": "Instruction files written for older models over-constrain newer ones; audit them and review the diff.",
        "summary": "An official Anthropic Claude Code skill (`/claude-api prompt-audit`) that scans your own prompt/config files (CLAUDE.md, AGENTS.md, custom skills) for outdated prompting patterns written for older models, and rewrites them to suit Claude Opus 5.5.",
        "points": [
          "Skill lives in `skills/claude-api/shared/prompt-audit.md` inside the anthropics/skills repo",
          "You invoke it as a slash command inside Claude Code: `/claude-api prompt-audit`",
          "It reads your project's instruction files and flags anti-patterns tuned for older/weaker models (e.g. overly verbose scaffolding, excessive guardrails)",
          "Rewrites/organizes the files, removing stale instructions that now restrict a more capable model",
          "Users report it finding ~70 improvable patterns and applying fixes across an entire project tree"
        ],
        "tryIt": "`/claude-api prompt-audit` (run inside Claude Code)",
        "caveat": "Skill rewrites your instruction files in place - review the diff before committing; some skills in the repo (docx/pdf/pptx/xlsx) are source-available, not open source, this particular skill folder's license should be checked before reuse.",
        "flow": {
          "steps": [
            "Run /claude-api prompt-audit",
            "Scans CLAUDE.md, AGENTS.md, skills",
            "Flags outdated anti-patterns",
            "Rewrites to suit Opus 5.5"
          ]
        }
      },
      {
        "slug": "nvidia-skillevaluator",
        "title": "NVIDIA SkillEvaluator",
        "date": "2026-11-16",
        "source": "André Lindenberg",
        "url": "https://www.linkedin.com/posts/alindnbrg_aiagents-agentskills-claudecode-share-7526751121378435074-f5t9/",
        "takeaway": "Treat skills like code: static checks, duplicate detection, and A/B runs that prove a skill actually helps.",
        "summary": "A three-tier tool for agent skills (folders of instructions per the Agent Skills spec): static quality checks, overlap detection, and live A/B runs that measure whether a skill actually helps the agent.",
        "points": [
          "Tier 1 Validation: is the skill safe, well-formed and harness-compatible; runs SkillSpector and Gitleaks scanners; works without an LLM.",
          "Tier 2 Deduplication: embeddings find guidance that repeats inside a skill or across a catalog.",
          "Tier 3 Live Evaluation: runs a supported agent in a sandbox (Docker by default) with and without the skill and scores the difference.",
          "A `ci init` command opens a PR that checks changed skills on every pull request."
        ],
        "caveat": "Tier 3 needs model access, an agent and Docker. The LLM rubric sends skill text to NVIDIA's hosted endpoint. A scanner that cannot run makes the result `INCOMPLETE`.",
        "flow": {
          "steps": [
            "Skill folder",
            "Tier 1 static checks",
            "Tier 2 overlap check",
            "Tier 3 agent runs with and without",
            "Score and report"
          ]
        }
      },
      {
        "slug": "skill-recorder-record-to-agent-skill",
        "title": "Skill Recorder: Record to Agent Skill",
        "date": "2026-10-27",
        "source": "0xMarioNawfal (@RoundtableSpace)",
        "url": "https://x.com/roundtablespace/status/2113891994128822631",
        "takeaway": "Record a workflow once and turn it into a reusable SKILL.md.",
        "summary": "A desktop app that records you doing a task (clicks, app switches, pages, terminal commands, optional voice) and uses GitHub Copilot to turn it into an editable list of steps. One click turns that into a reusable skill (a SKILL.md file) or a scheduled automation.",
        "points": [
          "Hit record (Cmd+Shift+R / Ctrl+Shift+R) and do the task; capture stays on your machine.",
          "A small always-on-top bar controls capture, mic and a recorded terminal.",
          "Analyze: the Copilot CLI rebuilds one intent plus ordered steps, which you edit.",
          "Create: generate a Skill or an Automation, preferring native tools like `gh` or `web_fetch` over replaying clicks."
        ],
        "caveat": "Needs a GitHub account with Copilot access. Records your screen, so sensitive data may end up in the recording sent to Copilot. No license listed in the repo. The README says review gives visibility, not a security guarantee.",
        "flow": {
          "steps": [
            "Record task once",
            "Local capture of clicks and terminal",
            "Copilot builds intent and steps",
            "Edit steps",
            "SKILL.md or scheduled automation"
          ]
        }
      },
      {
        "slug": "five-public-ai-configs",
        "title": "Five Public AI Configs",
        "date": "2026-11-12",
        "source": "Brucky (@danikkk_wqs)",
        "url": "https://x.com/danikkk_wqs/status/2119535297541070962",
        "takeaway": "Small composable skills beat one giant prompt; borrow from public skill packs before writing your own.",
        "summary": "A roundup of skill packs (reusable agent instructions). The most useful for engineering: Pocock's small composable skills, Osmani's spec-to-ship slash commands, and Cloudflare's multi-agent security audit.",
        "points": [],
        "tryIt": "`copilot plugin marketplace add mattpocock/skills`",
        "caveat": "Star counts in the post are out of date. No licences shown in metadata. Post's claim about Osmani's role was not verified.",
        "flow": {
          "steps": [
            "Recon and coverage ledger",
            "Isolated hunters",
            "Fresh verifier disproves",
            "findings.json",
            "REPORT.md"
          ]
        }
      },
      {
        "slug": "matt-pocock-home-repo",
        "title": "Matt Pocock Home Repo",
        "date": "2026-11-12",
        "source": "Matt Pocock (@mattpocockuk)",
        "url": "https://x.com/mattpocockuk/status/2120260969750540327",
        "takeaway": "Start agents in a 'home' repo whose AGENTS.md says where every other repo lives.",
        "summary": "To work across many repos with one agent, start it in a \"home\" repo whose AGENTS.md (the agent's standing instructions file) says where to clone the other repos.",
        "points": [
          "Home repo holds skills, steering files and a wiki.",
          "AGENTS.md lines like \"For skills, clone mattpocock/skills to a local folder\".",
          "The agent clones or opens the target repos on demand."
        ],
        "tryIt": "Add `For <name>, clone <owner>/<repo> to a local folder>` lines to an AGENTS.md.",
        "caveat": "The agent gets access to every pointed repo; keep secrets out of the home repo.",
        "flow": {
          "steps": [
            "Agent starts in home repo",
            "Reads AGENTS.md pointers",
            "Clones other repos locally",
            "Cross-repo changes"
          ]
        }
      },
      {
        "slug": "asd-ste100-skill-repo",
        "title": "ASD-STE100 Skill Repo",
        "date": "2026-10-04",
        "source": "Alik Huseynov (@alik_huseyn0v)",
        "url": "https://x.com/alik_huseyn0v/status/2105989790017454106",
        "takeaway": "A drop-in skill that makes agent writing shorter and less ambiguous.",
        "summary": "A Claude Code skill that rewrites dense, ambiguous agent-facing text into ASD-STE100 Simplified Technical English - the controlled-language standard aerospace maintenance manuals use so instructions can't be misread. Built for AI-to-AI reading, not humans.",
        "points": [
          "Picks a mode: Strict (procedures, errors, tool descriptions) or STE-flavored (READMEs, PRs, prose)",
          "Reads the input text for meaning, then flags every rule violation sentence-by-sentence (ambiguous words, passive voice, multi-instruction sentences, etc.)",
          "Rewrites flagged sentences without dropping facts or conditions",
          "Outputs only the rewritten text, plus a \"Kept as-is\" note where it chose not to simplify",
          "Can explain itself: ask \"which rules did it break\" for a before/after table"
        ],
        "tryIt": "`git clone https://github.com/danyuchn/asd-ste100-skill`",
        "caveat": "It's a style linter, not a correctness checker - it doesn't verify the rewrite preserved meaning.",
        "flow": {
          "steps": [
            "Dense agent output",
            "ASD-STE100 skill rules",
            "Rewritten plain sentences",
            "Unambiguous agent-to-agent text"
          ]
        }
      },
      {
        "slug": "impeccable-skill-in-perplexity-computer",
        "title": "Impeccable Skill in Perplexity Computer",
        "date": "2026-10-25",
        "source": "Aravind Srinivas (@AravSrinivas)",
        "url": "https://x.com/aravsrinivas/status/2114021917586014449",
        "takeaway": "Deterministic rules catch the visual tells of AI-generated UI before a human has to.",
        "summary": "Impeccable is design guidance for AI coding agents: 1 skill, 24 commands and 62 deterministic detector rules that spot typical \"AI-generated\" UI tells. Perplexity added it to its Computer skills marketplace; tasks using it are free through October 31, up to 5,000 credits per user.",
        "points": [
          "`/impeccable init` inspects the project and writes `PRODUCT.md` (audience, purpose, constraints, voice) so later commands have context",
          "24 commands form a shared design vocabulary: `audit`, `critique`, `polish`, `layout`, `typeset`, `harden` and more",
          "62 deterministic rules (no LLM, no API key) flag tells like Inter everywhere, purple-to-blue gradients, cards nested in cards",
          "`/impeccable live` iterates on elements in the browser",
          "Started from Anthropic's frontend-design skill"
        ],
        "tryIt": "`npx impeccable install`",
        "caveat": "No licence shown in research output - check before use. The free credits are Perplexity-specific and end Oct 31.",
        "flow": {
          "steps": [
            "npx impeccable install",
            "impeccable init writes PRODUCT.md",
            "audit or critique",
            "polish fixes",
            "Less generic UI"
          ]
        }
      },
      {
        "slug": "claude-code-modernization-plugin",
        "title": "Claude Code Modernization Plugin",
        "date": "2026-10-18",
        "source": "Daniel San (@dani_avila7)",
        "url": "https://x.com/dani_avila7/status/2110174786148340098",
        "takeaway": "A structured path for agent-assisted legacy modernisation; try it on one small module first.",
        "summary": "An official Claude Code plugin that rewrites legacy code (even into another language) and then checks that the new code behaves the same, ending with a PROVEN / PARTLY PROVEN / NOT PROVEN report.",
        "points": [
          "Analyses the legacy system and extracts business rules",
          "Produces a modernization plan for your approval, then rewrites the code",
          "Runs old and new code on identical inputs and compares outputs, plus generated edge cases",
          "Mutation testing: plants deliberate bugs to check the tests catch them",
          "Leaves the original code untouched; human approval at critical steps"
        ],
        "tryIt": "`/plugin install code-modernization@claude-plugins-official`",
        "caveat": "v1.0.0. The directory README says to trust a plugin before installing it.",
        "flow": {
          "steps": [
            "Legacy code",
            "Extract business rules and plan",
            "Rewrite code",
            "Compare old vs new outputs",
            "Verification report"
          ]
        }
      }
    ]
  },
  {
    "slug": "developer-toolbox",
    "title": "Developer toolbox",
    "kicker": "Tools worth keeping close",
    "description": "Small, practical tools that remove friction: faster search, local cloud emulation, quick tunnels, reverse engineering and curated building blocks for agents.",
    "readTime": "7 min read",
    "entries": [
      {
        "slug": "plannotator-plan-review",
        "title": "Plannotator: Plan Review",
        "date": "2026-11-18",
        "source": "Mayank A.",
        "url": "https://www.linkedin.com/posts/curiouslearner_a-13k-star-github-repo-is-built-around-one-share-7528711377352519682-LahT/",
        "takeaway": "Browser UI to annotate agent plans and diffs and send feedback back.",
        "summary": "Plannotator opens an agent's plan in a local browser page where you highlight, delete, comment and suggest replacements, then sends that structured feedback back to the agent. It also reviews uncommitted diffs, HTML artifacts, documents and PRs.",
        "points": [
          "Hooks into the agent's plan approval step (for example Claude Code plan mode); the review UI opens in your browser.",
          "Annotations become structured feedback the agent uses to revise the plan; Plannotator shows what changed between versions.",
          "`/plannotator-review` opens uncommitted changes in a side-by-side diff review with line comments.",
          "Plannotator Inbox collects questions, plans and reviews from several agent sessions in one local place."
        ],
        "tryIt": "Follow the install steps in the [README](https://github.com/backnotprop/plannotator).",
        "caveat": "GitHub shows no licence file detected, so confirm the licence before company use. Hooks run local code alongside your agent; review what it installs.",
        "flow": {
          "steps": [
            "Agent proposes plan",
            "Plannotator opens in browser",
            "You annotate and comment",
            "Feedback sent to agent",
            "Revised plan diffed"
          ]
        }
      },
      {
        "slug": "microsoft-tgrep",
        "title": "Microsoft tgrep",
        "date": "2026-09-13",
        "source": "Frank (@jedisct1)",
        "url": "https://x.com/jedisct1/status/2096919996412666296",
        "takeaway": "A drop-in speed win for searching very large repositories.",
        "summary": "A trigram-indexed grep replacement built in Rust. It builds a local index of 3-character substrings (\"trigrams\") per file so a regex search can skip files that can't possibly match, then verifies candidates with the real regex engine in parallel. A background server keeps the index warm so repeat searches are fast. It already powers search inside GitHub Copilot CLI.",
        "points": [
          "`tgrep index .` builds an on-disk trigram index (stored in `.tgrep/`, should be gitignored)",
          "`tgrep serve .` runs a background server that keeps the index updated asynchronously",
          "`tgrep -- \"pattern\" .` searches: uses the server if running, else the local index, else falls back to a plain filesystem scan",
          "Benchmarks (Aug 2026 sweep): faster than ripgrep in 17 of 18 repo/platform combos, 0.93x-51.9x speedup depending on query and repo",
          "Respects `.gitignore` like ripgrep when run inside a Git repo"
        ],
        "tryIt": "`tgrep index . && tgrep -- \"pattern\" .`",
        "caveat": "No license listed in repo metadata - check before relying on it in anything redistributed; index can be stale without the server running; Rust toolchain needed to build from source if no binary release is used.",
        "flow": {
          "steps": [
            "Source files",
            "Trigram index built",
            "Query narrowed to candidate files",
            "Regex verifies matches"
          ]
        }
      },
      {
        "slug": "aws-emulator-local-aws-apis",
        "title": "AWS Emulator: Local AWS APIs",
        "date": "2026-11-16",
        "source": "Miguel Ángel Durán (@midudev)",
        "url": "https://x.com/midudev/status/2120880400272597140",
        "takeaway": "Run integration tests against AWS APIs without an AWS account.",
        "summary": "An official local emulator of AWS APIs. Point the AWS CLI or SDK at it to test, prototype or run integration tests in CI without an AWS account or AWS charges.",
        "points": [
          "Server mode: a local AWS API endpoint (Linux package, or Docker on Windows/macOS); set env vars to point SDKs at it.",
          "Embedded mode (Rust tests): one isolated in-process instance per test.",
          "Agent mode: an `aws-emulator` skill lets a coding agent set it up (AWS CLI 2.35.0+)."
        ],
        "tryIt": "`aws agent-toolkit add-skill --skill-name aws-emulator --region us-east-1`",
        "caveat": "Not for production or security testing (README). Licence not stated.",
        "flow": {
          "steps": [
            "Your code or tests",
            "AWS CLI or SDK",
            "Local AWS Emulator",
            "Emulated resources"
          ]
        }
      },
      {
        "slug": "github-actions-parallel-steps",
        "title": "GitHub Actions Parallel Steps",
        "date": "2026-10-25",
        "source": "The GitHub Blog",
        "url": "https://github.blog/changelog/2026-06-25-actions-steps-can-now-be-run-in-parallel/",
        "takeaway": "Parallel steps inside one job cut CI time without restructuring the workflow.",
        "summary": "Steps in a single GitHub Actions job can now run at the same time, each with its own clean log. Before, steps ran one after another, or you used shell `&` and got mixed-up logs.",
        "points": [
          "`background: true` starts a step and moves on",
          "`wait` / `wait-all` pause until named or all background steps finish",
          "`cancel` stops a background step (e.g. a test service)",
          "`parallel` groups steps to run together, then waits"
        ],
        "caveat": "Check the workflow syntax docs for current details.",
        "flow": {
          "steps": [
            "Job starts",
            "Background service step",
            "Parallel build steps",
            "wait-all",
            "cancel service and finish"
          ]
        }
      },
      {
        "slug": "alibaba-open-code-review",
        "title": "Alibaba Open Code Review",
        "date": "2026-09-20",
        "source": "Sandhya (@agenticgirl)",
        "url": "https://x.com/agenticgirl/status/2099087022900367845",
        "takeaway": "Deterministic code does the mechanical parts of review; the model only reasons, at a fraction of the tokens.",
        "summary": "A CLI code-review agent built at Alibaba's internal scale: deterministic engineering handles the mechanical parts (which files to review, bundling, rule matching, comment placement), while an LLM agent only does the reasoning - giving higher precision/F1 than Claude Code on the same model at about 1/9 the tokens, trading off some recall.",
        "points": [
          "Reads git diffs, sends changed files to a configurable LLM (OpenAI/Anthropic-compatible) via a tool-using agent",
          "Deterministic file selection plus \"smart bundling\" groups related files (e.g. matching i18n property files) into one isolated-context sub-review",
          "Rule matching narrows what the model needs to look at, cutting noise",
          "`ocr scan` reviews whole files/directories without a diff, for auditing unfamiliar code",
          "Benchmarked on AACR-Bench: 200 real PRs across 50 OSS repos, 10 languages, 1,505 human-annotated ground-truth issues"
        ],
        "tryIt": "configure a model endpoint, then run `ocr scan` per the repo's quick start.",
        "caveat": "Benchmark numbers are self-reported by Alibaba; recall is explicitly lower (more missed issues) in exchange for fewer false positives; LICENSE not yet classified on GitHub - confirm terms before using at work.",
        "flow": {
          "steps": [
            "Git diff",
            "Deterministic file/rule engine",
            "LLM review agent",
            "Line-level comments"
          ]
        }
      },
      {
        "slug": "cloudflare-tunnel-free-localhost-sharing",
        "title": "Cloudflare Tunnel: Free Localhost Sharing",
        "date": "2026-09-21",
        "source": "Ram Maheshwari (@rammcodes)",
        "url": "https://x.com/rammcodes/status/2101644770389143770",
        "takeaway": "One command gives a local port a temporary public HTTPS URL for demos and webhooks.",
        "summary": "`cloudflared` is Cloudflare's tunnel client daemon. Its \"TryCloudflare\" quick-tunnel mode gives you a temporary public HTTPS URL pointing at a port on your machine, with a single command and no Cloudflare account.",
        "points": [
          "`cloudflared` runs locally and opens an outbound connection to Cloudflare's network (no inbound firewall ports needed).",
          "Cloudflare routes public requests for the generated URL through that connection to your local port.",
          "The \"TryCloudflare\" mode skips account setup entirely, just for quick testing (the named/persistent tunnel mode needs a Cloudflare account + domain).",
          "It can also tunnel raw TCP (SSH, RDP) via `cloudflared access`, not just HTTP."
        ],
        "tryIt": "`cloudflared tunnel --url http://localhost:8080`",
        "caveat": "TryCloudflare URLs are temporary/random and meant for quick tests, not production. No license listed on the repo (check before redistribution). Exposes your local service to the public internet while the tunnel is up - don't point it at anything sensitive.",
        "flow": {
          "steps": [
            "Local app on localhost:PORT",
            "cloudflared client",
            "Cloudflare network",
            "Public HTTPS URL"
          ]
        }
      },
      {
        "slug": "rea-reverse-engineer-skill",
        "title": "REA Reverse Engineer Skill",
        "date": "2026-10-18",
        "source": "Computer (@AskPerplexity)",
        "url": "https://x.com/askperplexity/status/2111120664543596957",
        "takeaway": "Lets a coding agent explain how a feature works in a compiled app, with evidence; mind the legal limits.",
        "summary": "REA is an MCP server (a plug-in tool interface that coding agents can call) for reverse engineering: it inspects native binaries, JavaScript/Electron apps, .NET assemblies and websites, explains how a feature works with evidence, and helps your agent build a similar feature.",
        "points": [
          "`npx rea-agents setup` registers REA's MCP server and workflow instructions with your agent (Claude Code, Codex, Cursor, Gemini CLI and others), backing up existing config",
          "The agent calls REA to inspect the target and trace relevant code; results include evidence and limitations",
          "Native analysis uses an existing Hopper, Ghidra or IDA install; static JavaScript analysis needs none",
          "Analysis runs locally; the same tools are available as a `rea` CLI"
        ],
        "tryIt": "`npx rea-agents setup`",
        "caveat": "Reverse engineering third-party apps can break licence terms. Setup edits your agent config. Beware copycat repos and packages.",
        "flow": {
          "steps": [
            "You ask agent about a feature",
            "Agent calls REA via MCP",
            "REA inspects app or binary locally",
            "Evidence and explanation",
            "Agent builds similar feature"
          ]
        }
      },
      {
        "slug": "15-repos-for-your-agent-stack",
        "title": "15 Repos for Your Agent Stack",
        "date": "2026-09-20",
        "source": "beamnxw ./ (@beamnxw)",
        "url": "https://x.com/beamnxw/status/2101278282700226824",
        "takeaway": "A shortlist of building blocks; pick only what fills a real gap.",
        "summary": "A curated shortlist of 15 open-source projects mapped onto one pipeline: find a signal, turn it into context, keep what matters, hand it to an agent, give it somewhere to run, adapt the model, ship to users.",
        "points": [],
        "tryIt": "pick one gap you actually have, e.g. `pip install openbb` for market data, or `curl -fsSL https://dokploy.com/install.sh | bash` to self-host apps - don't adopt all 15 at once.",
        "caveat": "Single creator's curated list with a self-promo close (\"save this to build your own business with an AI employee\"); several repos show no classified LICENSE on GitHub - check the actual file before adopting any of them; star counts are a popularity signal, not a quality guarantee."
      },
      {
        "slug": "copilotkit-opendots",
        "title": "CopilotKit OpenDots",
        "date": "2026-10-04",
        "source": "CopilotKit (@CopilotKit)",
        "url": "https://x.com/copilotkit/status/2105714964023685148",
        "takeaway": "A self-hostable template for persistent agent 'coworkers' with their own isolated computers.",
        "summary": "An open-source, self-hostable template for persistent AI \"coworker\" agents (called Dots), each with its own computer (browser/terminal/files), that can save their work as editable documents in a shared workspace.",
        "points": [
          "Each Dot is a specialist (name, role, instructions, permitted tools) you configure",
          "A Dot can run its own computer via OpenBot's container supervisor (browser control, terminal, files), isolated per Dot",
          "Work happens in a chat thread; a live computer view and human-review card appear inline",
          "Approved output is saved as an editable page inside a \"Space\" (a shared document workspace), with autosave and revision checks"
        ],
        "tryIt": "`git clone https://github.com/CopilotKit/OpenDots && cat docs/SETUP.md`",
        "caveat": "Early-stage template, not a hosted product - conversations need CopilotKit Intelligence (hosted or self-hosted/licensed); computer tools require you to stand up the pinned services yourself.",
        "flow": {
          "steps": [
            "Ask a Dot",
            "Dot browses or computes",
            "Human reviews and approves",
            "Saved as Space page"
          ]
        }
      },
      {
        "slug": "helix-foundry-open-source-ontology",
        "title": "Helix Foundry: Open-source Ontology",
        "date": "2026-10-11",
        "source": "Lam Sambert (@georgecurtiss)",
        "url": "https://x.com/georgecurtiss/status/2108374327980933516",
        "takeaway": "A local-first ontology over your data sources, useful for mapping an integration landscape.",
        "summary": "Helix Foundry brings that idea to **your own laptop, for free**. You connect your systems and it **suggests** the ontology: it matches the same records across sources and stores them as real objects and relationships. Then you ask questions in plain English, and each answer is backed by **SQL that was actually run, with citations**.",
        "points": [
          "**HelixDB** (Rust, ★6.2k) stores the ontology. It is a graph database that also has vector search and keyword search, so entities, relationships, embeddings and text sit in one engine.",
          "**DuckDB** does the number-crunching. It runs on immutable, versioned **Parquet snapshots**, so you can see history and schema drift.",
          "**AI:** by default a local `qwen3:4b` model via Ollama, so no data leaves the machine. Claude or OpenAI are optional. Any change the AI proposes is tested and waits for your review.",
          "**Connectors:** PostgreSQL, MySQL, Neon, Supabase, PlanetScale, Stripe, WorkOS, PostHog, REST APIs, S3, CSV/JSON/Parquet uploads. Postgres and MySQL support live change capture.",
          "**Setup:** a single Docker Compose stack at `http://localhost:3001`. Guided setup goes **AI → Data → Ontology**, and there is a **sample-data** option."
        ],
        "tryIt": "`git clone https://github.com/helixdb/helix-foundry && cd helix-foundry && ./scripts/setup.sh --compose`, then choose **Continue with sample data**.",
        "caveat": "it is only days old. Windows is untested, and the backup and restore scripts have only placeholder tests. \"Killed Palantir\" is marketing: there is no enterprise security, multi-user access or governance yet."
      },
      {
        "slug": "free-datasets-and-apis",
        "title": "Free Datasets and APIs",
        "date": "2026-10-14",
        "source": "Gyomei (@Gyome1_)",
        "url": "https://x.com/gyome1_/status/2109606016304214473",
        "takeaway": "A reference list for when an agent or prototype needs real data.",
        "summary": "A roundup of free data sources: API lists, dataset lists, Hugging Face datasets, OpenStreetMap, Open Food Facts, data.gov, OpenAlex, GDELT, FRED and Google Dataset Search. Good starting points for prototypes and test data.",
        "points": [
          "public-apis lists 1,400+ free APIs in 50+ categories, with auth, HTTPS and CORS info per entry",
          "awesome-public-datasets lists curated datasets by topic; most are free, some are not",
          "data.gov holds 590,000+ US government datasets; OpenAlex covers 250M+ scientific works",
          "GDELT tracks world news in 100+ languages, updated every 15 minutes"
        ],
        "tryIt": "Browse https://github.com/public-apis/public-apis",
        "caveat": "Check each source's licence and terms. public-apis README now leads with APILayer advertising."
      },
      {
        "slug": "modern-web-guidance",
        "title": "Modern Web Guidance",
        "date": "2026-11-12",
        "source": "Miguel Angel Duran (@midudev)",
        "url": "https://x.com/midudev/status/2120518082326110719",
        "takeaway": "Current platform guidance for anyone shipping web UI.",
        "summary": "A skill, run by Chrome, Edge, Firefox and MDN teams, that feeds coding agents current web-platform guidance so they stop writing old patterns and heavy polyfills.",
        "points": [
          "A CLI returns short, curated guides into the agent's context when it writes HTML, CSS or JS.",
          "Covers modern browser APIs, performance, accessibility and light fallbacks.",
          "`legacy-scan` checks existing code for old patterns with native replacements."
        ],
        "tryIt": "`npx modern-web-guidance@latest install`",
        "caveat": "No licence shown in repo metadata. The skill only acts on new code; use legacy-scan for old code.",
        "flow": {
          "steps": [
            "Agent writes web code",
            "Skill searches guides",
            "Guide loaded into context",
            "Modern native code"
          ]
        }
      }
    ]
  },
  {
    "slug": "models-and-frontier",
    "title": "Models & frontier",
    "kicker": "Local models & where research is going",
    "description": "Models you can run yourself, and a longer view on how AI changes scientific work.",
    "readTime": "2 min read",
    "entries": [
      {
        "slug": "recursive-flint-local-coding-moe",
        "title": "Recursive Flint: Local Coding MoE",
        "date": "2026-10-25",
        "source": "recursive.com",
        "url": "https://recursive.com/updates/introducing-recursive-flint",
        "takeaway": "An Apache-licensed coding model that runs offline on a laptop; split work into small tasks.",
        "summary": "Flint is an open-weights coding model built to run on your own laptop. It is a mixture-of-experts (MoE: only a few \"expert\" sub-networks run for each token) model with 40B total parameters but only 2.5B active per token, so it is fast. Weights are on Hugging Face under Apache 2.0.",
        "points": [
          "Recursive's \"Eureka Machine\" (an automated research system) proposed, ran and tested ideas across data, training, architecture and kernels",
          "Output layer quantized to 4 bits (smaller numbers, less memory), then distilled from the 16-bit model to recover accuracy; NVFP4 model is within 0.7 points of 16-bit",
          "Custom kernels for Apple Silicon (a Metal \"megakernel\" that fuses the whole decode step on M4/M5) and NVIDIA RTX Spark",
          "Supports up to 512k tokens of context; 256k recommended"
        ],
        "tryIt": "Download from `huggingface.co/RecursiveSI/flint` and run with Ollama or LM Studio.",
        "caveat": "Benchmarks are the vendor's own. Needs more guidance than big closed models; split work into small tasks.",
        "flow": {
          "steps": [
            "Eureka Machine proposes ideas",
            "Train 40B MoE model",
            "4-bit quantize plus distill",
            "Custom local kernels",
            "Fast coding model on laptop"
          ]
        }
      },
      {
        "slug": "macos-27-free-terminal-llm",
        "title": "macOS 27 Free Terminal LLM",
        "date": "2026-10-25",
        "source": "Alvaro Cintas (@dr_cintas)",
        "url": "https://x.com/dr_cintas/status/2113756925124882770",
        "takeaway": "A free on-device model in the terminal on Apple Silicon.",
        "summary": "macOS 27 ships an `fm` command that talks to Apple's on-device Foundation Model. It runs offline on any Apple Silicon Mac (M1 included) and can serve an OpenAI-compatible API on localhost.",
        "points": [
          "One-time `sudo fm license`, then `fm available` to check the model is downloaded",
          "`fm respond \"question\"`; pipe files with `cat notes.txt | fm respond -i \"summarize this\"`",
          "Structured JSON output via `fm schema object` and `--schema`",
          "`fm serve` gives an OpenAI-compatible endpoint on localhost"
        ],
        "tryIt": "`fm respond \"your question\"`",
        "caveat": "Needs `sudo` once. Tiny 4,096-token context. Only macOS 27 on Apple Silicon.",
        "flow": {
          "steps": [
            "Text or file via pipe",
            "fm respond",
            "On-device Apple model",
            "Answer or JSON"
          ]
        }
      },
      {
        "slug": "hassabis-ai-for-science-and-agi",
        "title": "Hassabis: AI for Science and AGI",
        "date": "2026-10-27",
        "source": "hoshino (@hoshinoxbt)",
        "url": "https://x.com/hoshinoxbt/status/2114396607550746911",
        "takeaway": "Pick problems with clear objectives and lots of data, and judge progress by evidence.",
        "summary": "This is a Cambridge lecture about Demis Hassabis's route from games to scientific discovery and the longer-term goal of artificial general intelligence. Its useful engineering idea is to turn an enormous search problem into a tractable one with a learned model, a measurable objective and data or simulation. AlphaGo and AlphaFold illustrate that approach; the later sections cover world models, safety, and questions about careers and game development.",
        "points": [
          "Define a search problem and an objective whose improvement can actually be checked.",
          "Learn structure from data or generated experience so the model can propose promising candidates.",
          "Use the model to guide search rather than enumerate every possible candidate.",
          "Compare results with held-out answers, experiments or another task-appropriate independent evaluation.",
          "Expand deployment only after the result meets the domain's accuracy and risk requirements."
        ],
        "tryIt": "For one proposed AI project, write four fields: candidate/search space, measurable objective, data or simulator, and independent acceptance check. If a field is missing, resolve that gap before treating a demo as a production capability.",
        "caveat": "The lecture contains historical product examples and recording-time statistics. Its repost date does not make those current release information. AlphaFold structure prediction does not solve all of biology, and predictions or design candidates still require domain-specific validation. General claims about AGI, physics and future productivity remain the speaker's expectations or conjectures. The summary uses audio only and omits uncertain command spellings and details visible only on slides."
      }
    ]
  }
];
