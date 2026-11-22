import { describe, expect, it } from "vitest";
import { importNotes, parseNote, reviewNote } from "./import-learning.js";

const note = `### 📌 At a glance

| | Post | Verdict |
|:-:|:--|:--|
| **a** | [Loop Tool - Agent Loops](#a)<br><sub>Agents that retry until tests pass</sub> | ✅ Yes |
| **b** | [Maybe Post](#b)<br><sub>Not sure</sub> | 🤔 Maybe |

## a. Loop Tool - Agent Loops

<sub>🔗 [Jane (@jane)](https://x.com/jane/status/1) · 2026-11-10</sub>

**✅ Yes** · worth a try

A tool that runs an agent in a loop
until the tests pass.

\`\`\`mermaid
flowchart LR
  A["Task"] --> B["Agent edits"] --> C["Run tests"] --> B
\`\`\`

> [!TIP]
> **Try it:** \`pip install [removed]\`

**How it works**
- Runs the agent.
- Calls [removed] internally.
- Stops when green.

> [!WARNING]
> **Caveats:** Costs tokens.
> Needs a test suite.

## b. Maybe Post

<sub>🔗 [Web](https://example.com/b)</sub>

**🤔 Maybe** · later

Something.
`;

const section = (slug) => ({ slug, readTime: "1 min read", entries: [] });

describe("daily-learning import", () => {
  it("turns only the ✅ picks into complete entries without redaction markers", () => {
    expect(parseNote(note, "2026-11-16")).toEqual([{
      slug: "loop-tool-agent-loops",
      title: "Loop Tool: Agent Loops",
      date: "2026-11-16",
      source: "Jane (@jane)",
      url: "https://x.com/jane/status/1",
      takeaway: "Agents that retry until tests pass.",
      summary: "A tool that runs an agent in a loop until the tests pass.",
      points: ["Runs the agent.", "Stops when green."],
      caveat: "Costs tokens. Needs a test suite.",
      flow: { steps: ["Task", "Agent edits", "Run tests"], loopBack: 1 },
    }]);
  });

  it("files a pick by its keywords and imports each source only once", () => {
    const sections = [section("agent-architecture"), section("developer-toolbox")];
    const seen = new Set();
    const notes = [{ date: "2026-11-16", markdown: note }];
    expect(importNotes(sections, notes, seen).map((e) => e.section)).toEqual(["agent-architecture"]);
    sections[0].entries = [];
    expect(importNotes(sections, notes, seen)).toEqual([]);
    expect(seen.size).toBe(1);
  });

  it("lists every pick with the reason it was not imported", () => {
    const extra = `${note}
## c. Shortlink Pick

<sub>🔗 [Someone (LinkedIn)](https://lnkd.in/p/abc)</sub>

**✅ Yes** · good

Worth keeping.

## d. Unrated Pick

<sub>🔗 [Web](https://example.com/d)</sub>

**How it works**
- Does a thing.
`;
    expect(reviewNote(extra, "2026-11-16").map(({ letter, importable, reason }) => ({ letter, importable, reason }))).toEqual([
      { letter: "a", importable: true, reason: undefined },
      { letter: "b", importable: false, reason: "rated 🤔 Maybe" },
      { letter: "c", importable: false, reason: "source is an lnkd.in shortlink" },
      { letter: "d", importable: false, reason: "no verdict yet" },
    ]);
  });
});
