// Essays. Each one draws together several notes from the learning log and
// credits them: `sources` lists learning entry slugs, and a "Sources" section
// with links to the originals is added automatically from those entries.
import { learningSections } from "./learning.js";

const p = (...paragraphs) => paragraphs.join("\n\n");

const drafts = [
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
      },
      {
        heading: "What makes a loop real",
        body: p(
          "A loop is one agent's own cycle: plan, act, verify, repeat. The practical test, from a write-up on loops and approval gates, is simple: a loop is only real if it has a check that can fail. \"No error\" is not a check. A compiler run, a test suite, a schema validation or a comparison against a spec is.",
          "So write the failure condition first, before the work itself. If you cannot say what a failed attempt looks like, the agent cannot either, and the loop becomes a polite way of running once.",
        ),
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
      },
      {
        heading: "Decision models for closed choices",
        body: p(
          "Some steps do not need a generative model at all. A decision model receives the current state, a question and a set of options, and returns a probability for each option with a confidence. It cannot write text, which is exactly the point.",
          "Amazon engineers used one to label tickets into 20 categories, replacing a large general model. They report that quality held and cost fell by about 98%. Google now offers a decision model in the Gemini API as well.",
          "The integration design is as instructive as the model. Ticket events flow from a queue to a function to a hosted model endpoint. A configuration switch with three modes (the old model, both side by side, or the new model) let the team run both on real traffic and compare before switching. That dual-run pattern is a safe way to migrate any model-backed step.",
          "It only fits closed choices from a stable catalogue with short context. Free-form reasoning still belongs to generative models.",
        ),
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

const sourcesSection = (slugs) => ({
  heading: "Sources",
  body: [
    "These notes from my learning log informed this essay. Figures are as reported by each source.",
    slugs
      .map((slug) => {
        const entry = entriesBySlug.get(slug);
        if (!entry) throw new Error(`Unknown learning entry in essay sources: ${slug}`);
        return `- [${entry.title}](${entry.url}) (${entry.source})`;
      })
      .join("\n"),
  ].join("\n\n"),
});

const words = (article) =>
  [article.excerpt, ...article.content.map((s) => `${s.heading} ${s.body}`)].join(" ").split(/\s+/).length;

// Published essays, each with its sources section and a read time from its length.
export const articles = drafts.map((draft) => {
  const article = { ...draft, content: [...draft.content, sourcesSection(draft.sources)] };
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
