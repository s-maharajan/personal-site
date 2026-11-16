// Renders the small markdown subset used in essay bodies: paragraphs,
// fenced code blocks, ordered/unordered lists, **bold**, `inline code` and
// [links](https://...).

const LIST_ITEM = /^(\d+\.|-)\s+/;

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;

// eslint-disable-next-line react-refresh/only-export-components
export function inline(text) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-text">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={i} className="rounded bg-raised px-1 py-0.5 font-mono text-[0.85em] text-text">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-hover">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

// Export the pure parser for unit tests alongside the renderer.
// eslint-disable-next-line react-refresh/only-export-components
export function parse(body) {
  const blocks = [];
  const lines = body.split("\n");
  let para = [];

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flushPara();
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    const match = line.match(LIST_ITEM);
    if (match) {
      flushPara();
      const ordered = match[1] !== "-";
      const last = blocks[blocks.length - 1];
      const item = line.replace(LIST_ITEM, "");
      if (last?.type === "list" && last.ordered === ordered && lines[i - 1]?.match(LIST_ITEM)) {
        last.items.push(item);
      } else {
        blocks.push({ type: "list", ordered, items: [item] });
      }
      continue;
    }

    if (line.trim() === "") flushPara();
    else para.push(line.trim());
  }
  flushPara();
  return blocks;
}

export default function Prose({ body }) {
  return parse(body).map((block, i) => {
    if (block.type === "code") {
      return (
        <pre
          key={i}
          className="my-3 overflow-x-auto rounded-lg border border-line bg-raised/70 p-4 font-mono text-xs text-text leading-relaxed"
        >
          <code>{block.text}</code>
        </pre>
      );
    }
    if (block.type === "list") {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          key={i}
          className={`my-2 space-y-1.5 pl-6 text-xs sm:text-sm marker:text-faint ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, j) => (
            <li key={j} className="pl-1">{inline(item)}</li>
          ))}
        </List>
      );
    }
    return <p key={i}>{inline(block.text)}</p>;
  });
}
