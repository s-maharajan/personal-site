// Imports the ✅ picks from the private daily-learning notes into src/content/learning.js.
// Usage: node scripts/import-learning.js <daily-learning checkout>/site/notes
// Every pick is considered once: scripts/learning-seen.json keeps hashes of the source
// URLs already imported or skipped, so entries removed by hand do not come back.
// Without that file, the first run only records what exists and imports nothing.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const LEARNING = new URL("../src/content/learning.js", import.meta.url);
const SEEN = new URL("./learning-seen.json", import.meta.url);
// { lastRefresh, lastNote }: when the notes were last reviewed and the newest note then.
const REFRESH = new URL("./learning-refresh.json", import.meta.url);

// Mirrors the content test in src/learning.test.jsx.
const BAD = /\[removed\]|undefined|TODO|lnkd\.in|\bour (agent stack|workstream|team|repos)\b/i;

// The section a pick lands in: keyword hits (title hits count three times); the most
// hits wins, ties go to the earlier section, and no hits means the developer toolbox.
const SECTION_WORDS = {
  "agent-security": ["security", "sandbox", "injection", "supply chain", "vulnerab", "attack", "malicious", "exploit", "untrusted"],
  "skills-and-harness": ["skill", "plugin", "agents.md", "claude.md", "instruction", "harness", "hook", "slash command", "agentic workflow"],
  "agent-architecture": ["architecture", "loop", "graph", "multi-agent", "orchestrat", "decider", "decision", "effective agents", "agent design"],
  "ai-native-engineering": ["team", "engineering", "prompting", "token", "cost", "dictionary", "tdd", "prd", "practice", "ship", "factory", "output"],
  "models-and-frontier": ["open-weight", "local model", "frontier", "benchmark", "scaling law", "paper", "llm research", "parameters"],
  "developer-toolbox": ["cli", "tool", "repo", "open-source", "install", "localhost", "library", "emulator", "app", "browser"],
};
const FALLBACK_SECTION = "developer-toolbox";

const hash = (url) => createHash("sha256").update(url).digest("hex").slice(0, 16);
const slugify = (text) => text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`);
const clean = (text) => text?.replace(/\s+/g, " ").trim();
const ok = (text) => Boolean(text) && !BAD.test(text);

function flowOf(block) {
  const chart = block.match(/```mermaid\n([\s\S]*?)```/)?.[1];
  if (!chart) return undefined;
  const ids = [];
  const labels = {};
  for (const [, id, label] of chart.matchAll(/\b([A-Za-z0-9_]+)\["([^"]+)"\]/g)) {
    if (!(id in labels)) ids.push(id);
    labels[id] ??= clean(label.replace(/<br\s*\/?>/gi, " "));
  }
  if (ids.length < 2 || ids.some((id) => !ok(labels[id]))) return undefined;
  const flow = { steps: ids.map((id) => labels[id]) };
  for (const line of chart.split("\n")) {
    const nodes = line.split(/-->(?:\|[^|]*\|)?/).map((part) => part.trim().match(/^[A-Za-z0-9_]+/)?.[0]);
    for (let i = 1; i < nodes.length; i += 1) {
      const from = ids.indexOf(nodes[i - 1]);
      const to = ids.indexOf(nodes[i]);
      if (from >= 0 && to >= 0 && to < from) flow.loopBack = to;
    }
  }
  return flow;
}

// One daily-learning note -> learning entries for its ✅ picks (no section yet).
export function parseNote(markdown, date) {
  const glance = Object.fromEntries([...markdown.matchAll(/^\| \*\*([a-z])\*\* \|.*?<br><sub>(.*?)<\/sub>/gm)]
    .map(([, letter, line]) => [letter, line]));
  return markdown.split(/^(?=## [a-z]\. )/m).slice(1).flatMap((block) => {
    const [, letter, heading] = block.match(/^## ([a-z])\. (.+)/);
    const verdict = block.match(/^\*\*✅ Yes\*\*(?: · (.+))?\n\n((?:.+\n)+)/m);
    const link = block.match(/<sub>🔗 \[([^\]]+)\]\((https:\/\/[^)\s]+)\)/);
    if (!verdict || !link) return [];
    const entry = {
      slug: slugify(heading.replace(" - ", " ")),
      title: clean(heading.replace(" - ", ": ")),
      date,
      source: clean(link[1]),
      url: link[2],
      takeaway: sentence(clean(glance[letter] ?? verdict[1] ?? "")),
      summary: clean(verdict[2]),
      points: (block.match(/^\*\*How it works\*\*\n((?:- .+\n?)+)/m)?.[1] ?? "")
        .split("\n").map((line) => clean(line.replace(/^- /, ""))).filter(ok),
    };
    if (![entry.title, entry.source, entry.url, entry.takeaway, entry.summary].every(ok)) return [];
    const tryIt = clean(block.match(/^> \*\*Try it:\*\* (.+)/m)?.[1]);
    const caveat = clean(block.match(/^> \*\*Caveats:\*\* (.+(?:\n> .+)*)/m)?.[1].replace(/\n> /g, " "));
    const flow = flowOf(block);
    if (ok(tryIt)) entry.tryIt = tryIt;
    if (ok(caveat)) entry.caveat = caveat;
    if (flow) entry.flow = flow;
    return [entry];
  });
}

// Every pick in a note and whether parseNote can import it, with the reason when not,
// so picks the importer leaves out are listed for review instead of vanishing.
export function reviewNote(markdown, date) {
  const importable = new Set(parseNote(markdown, date).map((e) => e.url));
  return markdown.split(/^(?=## [a-z]\. )/m).slice(1).map((block) => {
    const [, letter, heading] = block.match(/^## ([a-z])\. (.+)/);
    const verdict = clean(block.match(/^\*\*((?:✅|🤔|⏭️|❌|👀)[^*]*)\*\*/mu)?.[1]);
    const url = block.match(/<sub>🔗 \[[^\]]+\]\((https:\/\/[^)\s]+)\)/)?.[1];
    const ready = importable.has(url);
    let reason;
    if (!verdict) reason = "no verdict yet";
    else if (!verdict.startsWith("✅")) reason = `rated ${verdict}`;
    else if (!url) reason = "no source link";
    else if (!ready) reason = /lnkd\.in/.test(url) ? "source is an lnkd.in shortlink" : "a field failed the content check";
    return { letter, title: clean(heading), verdict, url, importable: ready, reason };
  });
}

export function sectionFor(entry) {
  const count = (text, word) => text.toLowerCase().split(word).length - 1;
  const body = [entry.takeaway, entry.summary, ...entry.points].join(" ");
  let best = FALLBACK_SECTION;
  let bestScore = 0;
  for (const [slug, words] of Object.entries(SECTION_WORDS)) {
    const score = words.reduce((n, word) => n + 3 * count(entry.title, word) + count(body, word), 0);
    if (score > bestScore) [best, bestScore] = [slug, score];
  }
  return best;
}

const readTime = (section) => {
  const words = section.entries.flatMap((e) => [e.title, e.takeaway, e.summary, ...e.points, e.tryIt ?? "", e.caveat ?? ""])
    .join(" ").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 250))} min read`;
};

// Adds unseen picks to their sections (newest first) and returns them.
export function importNotes(sections, notes, seen) {
  const known = new Set(sections.flatMap((s) => s.entries.map((e) => e.url)));
  const added = [];
  for (const { date, markdown } of notes) {
    for (const entry of parseNote(markdown, date)) {
      if (seen.has(hash(entry.url))) continue;
      seen.add(hash(entry.url));
      if (known.has(entry.url)) continue;
      known.add(entry.url);
      const section = sections.find((s) => s.slug === sectionFor(entry)) ?? sections.find((s) => s.slug === FALLBACK_SECTION);
      while (section.entries.some((e) => e.slug === entry.slug)) entry.slug += "-2";
      section.entries.unshift(entry);
      section.readTime = readTime(section);
      added.push({ ...entry, section: section.slug });
    }
  }
  return added;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) throw new Error("usage: node scripts/import-learning.js <daily-learning>/site/notes");
  const notes = readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort()
    .map((f) => ({ date: f.slice(0, 10), markdown: readFileSync(join(dir, f), "utf8") }));
  // Read once instead of checking existence first, so the file cannot change in between.
  let seenFile;
  try {
    seenFile = readFileSync(SEEN, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const seeding = seenFile === undefined;
  const seen = new Set(seeding ? [] : JSON.parse(seenFile));
  const source = readFileSync(LEARNING, "utf8");
  const { learningSections } = await import(LEARNING.href);
  const added = importNotes(learningSections, notes, seen);
  writeFileSync(SEEN, `${JSON.stringify([...seen].sort(), null, 2)}\n`);
  if (seeding) {
    console.log(`Recorded ${seen.size} existing picks; nothing imported.`);
  } else if (added.length) {
    const header = source.slice(0, source.indexOf("export const learningSections"));
    writeFileSync(LEARNING, `${header}export const learningSections = ${JSON.stringify(learningSections, null, 2)};\n`);
    for (const e of added) console.log(`Imported "${e.title}" into ${e.section}`);
  } else {
    console.log("No new picks.");
  }

  // Review list: every pick in the notes dated after the last refresh, with what
  // happened to it. The refresh record moves on only when newer notes arrive.
  let refresh = {};
  try {
    refresh = JSON.parse(readFileSync(REFRESH, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const since = notes.filter((n) => !refresh.lastNote || n.date > refresh.lastNote);
  const addedUrls = new Set(added.map((e) => e.url));
  console.log(refresh.lastNote
    ? `Last refresh ${refresh.lastRefresh} covered notes up to ${refresh.lastNote}; ${since.length} newer note(s).`
    : `No refresh record yet; reviewing all ${since.length} note(s).`);
  for (const { date, markdown } of since) {
    console.log(`${date}:`);
    for (const pick of reviewNote(markdown, date)) {
      const status = addedUrls.has(pick.url) ? "imported" : pick.importable ? "already considered" : `not imported: ${pick.reason}`;
      console.log(`  ${pick.letter}. ${pick.title}: ${status}`);
    }
  }
  if (since.length) {
    refresh = { lastRefresh: new Date().toISOString().slice(0, 10), lastNote: since.at(-1).date };
    writeFileSync(REFRESH, `${JSON.stringify(refresh, null, 2)}\n`);
  }
}
