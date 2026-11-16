import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";

// Small, dependency-free diagrams that render on the server and follow the theme.
//
// Flow:   { steps, loopBack?, loopLabel?, caption? }
//         A step is a label, a node object { label, tone }, an array of those
//         for work that runs in parallel, or { either: [...] } when exactly one
//         branch is taken. tone is "accent" (privileged or key step) or
//         "dashed" (untrusted or external).
// Layers: { layers: [{ label, detail }], base?: { label, detail }, caption? }

const node = (n) => (typeof n === "string" ? { label: n } : n);
// A group of nodes in one step: parallel work or alternative branches.
const group = (step) =>
  Array.isArray(step) ? { nodes: step, note: "in parallel" } : step?.either ? { nodes: step.either, note: "one of" } : null;
const pad = (i) => String(i + 1).padStart(2, "0");

const toneClass = {
  undefined: "border-line bg-bg",
  accent: "border-accent bg-bg",
  dashed: "border-dashed border-faint bg-raised",
};

function Node({ item, number }) {
  return (
    <div className={`flex-1 rounded-lg border px-2.5 py-2 ${toneClass[item.tone]}`}>
      {number && <span className={`block font-mono text-[10px] ${item.tone === "accent" ? "text-accent" : "text-faint"}`}>{number}</span>}
      <span className="block text-xs leading-snug text-text">{item.label}</span>
    </div>
  );
}

function Flow({ steps, loopBack, loopLabel }) {
  return (
    <>
      <ol className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
        {steps.map((step, i) => {
          const branches = group(step);
          return (
            <li key={i} className="flex flex-1 flex-col items-stretch gap-1 sm:flex-row sm:items-center">
              {branches ? (
                <div className="flex flex-1 flex-col gap-1">
                  <ul className="flex flex-col gap-1" aria-label={`Step ${i + 1}, ${branches.note}`}>
                    {branches.nodes.map((n, j) => (
                      <li key={j} className="flex"><Node item={node(n)} number={j === 0 ? pad(i) : null} /></li>
                    ))}
                  </ul>
                  <span className="text-center font-mono text-[10px] text-faint">{branches.note}</span>
                </div>
              ) : (
                <Node item={node(step)} number={pad(i)} />
              )}
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="flex shrink-0 justify-center text-faint">
                  <ArrowDown className="h-3.5 w-3.5 sm:hidden" />
                  <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {loopBack !== undefined && (
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
          <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span>{loopLabel || `Repeats from step ${pad(loopBack)}: ${node(steps[loopBack]).label}`}</span>
        </p>
      )}
    </>
  );
}

function Layers({ layers, base }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {layers.map((layer, i) => (
        <li key={layer.label} className="grid grid-cols-[2rem_1fr] items-baseline gap-2 rounded-lg border border-line bg-bg px-3 py-2.5 sm:grid-cols-[2rem_12rem_1fr]">
          <span className="font-mono text-[10px] text-accent">{pad(i)}</span>
          <span className="text-sm font-medium text-text">{layer.label}</span>
          <span className="col-start-2 text-xs leading-snug text-muted sm:col-start-3">{layer.detail}</span>
        </li>
      ))}
      {base && (
        <li className="grid grid-cols-[2rem_1fr] items-baseline gap-2 rounded-lg border border-dashed border-accent bg-raised px-3 py-2.5 sm:grid-cols-[2rem_12rem_1fr]">
          <span className="font-mono text-[10px] text-accent" aria-hidden="true">↳</span>
          <span className="text-sm font-medium text-text">{base.label}</span>
          <span className="col-start-2 text-xs leading-snug text-muted sm:col-start-3">{base.detail}</span>
        </li>
      )}
    </ol>
  );
}

export default function Diagram({ caption, label, ...diagram }) {
  return (
    <figure className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      {diagram.layers ? <Layers {...diagram} /> : <Flow {...diagram} />}
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-muted">{caption}</figcaption>
      ) : (
        <figcaption className="sr-only">{label || "Diagram"}</figcaption>
      )}
    </figure>
  );
}
