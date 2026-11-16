import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Diagram from "./Diagram";
import { learningSections } from "../content/learning";
import { articles } from "../content/writing";
import { render } from "../entry-server";

const html = (props) => renderToStaticMarkup(<Diagram {...props} />);
const label = (n) => (typeof n === "string" ? n : n.label);
const validStep = (step) => (Array.isArray(step) ? step.length >= 2 && step.every(validStep) : Boolean(label(step)?.trim()));

const flows = [
  ...learningSections.flatMap((s) => s.entries.filter((e) => e.flow).map((e) => [`learning ${e.slug}`, e.flow])),
  ...articles.flatMap((a) => a.content.filter((c) => c.diagram && !c.diagram.layers).map((c) => [`essay ${a.slug}: ${c.heading}`, c.diagram])),
];

describe("Diagram", () => {
  it("renders an ordered flow with numbered steps and decorative arrows", () => {
    const out = html({ steps: ["Plan", "Act", "Check"], caption: "A loop" });
    expect(out).toMatch(/^<figure/);
    expect(out.match(/<ol/g)).toHaveLength(1);
    for (const n of ["01", "02", "03", "Plan", "Act", "Check"]) expect(out).toContain(n);
    expect(out).toContain('<figcaption class="mt-3');
    // Two arrows (down for mobile, right for wider screens) between each pair of steps.
    expect(out.match(/aria-hidden="true" class="flex shrink-0/g)).toHaveLength(2);
  });

  it("groups parallel work and describes loops", () => {
    const out = html({ steps: ["Split", ["Worker", "Worker"], "Merge"], loopBack: 0 });
    expect(out).toContain('aria-label="Step 2, in parallel"');
    expect(out).toContain("in parallel");
    expect(out).toContain("Repeats from step 01: Split");
    expect(out).toContain('class="sr-only">Diagram</figcaption>');
  });

  it("renders layers with a base", () => {
    const out = html({ layers: [{ label: "Top", detail: "first" }], base: { label: "Rollback", detail: "under all" } });
    expect(out).toContain("Top");
    expect(out).toContain("Rollback");
    expect(out).toContain("border-dashed border-accent");
  });
});

describe("diagram content", () => {
  it.each(flows)("%s has valid steps", (_, flow) => {
    expect(flow.steps.length).toBeGreaterThanOrEqual(3);
    expect(flow.steps.every(validStep)).toBe(true);
    if (flow.loopBack !== undefined) {
      expect(flow.loopBack).toBeGreaterThanOrEqual(0);
      expect(flow.loopBack).toBeLessThan(flow.steps.length);
    }
    expect(JSON.stringify(flow)).not.toMatch(/\[removed\]/);
  });

  it("gives most learning notes a how-it-works diagram", () => {
    const entries = learningSections.flatMap((s) => s.entries);
    expect(entries.filter((e) => e.flow).length).toBeGreaterThanOrEqual(30);
  });

  it("gives every essay at least one diagram with a caption", () => {
    for (const article of articles) {
      const diagrams = article.content.filter((c) => c.diagram);
      expect(diagrams.length, article.slug).toBeGreaterThan(0);
      for (const { diagram } of diagrams) expect(diagram.caption).toBeTruthy();
    }
  });

  it.each(learningSections)("prerenders one figure per diagram on the $slug page", (section) => {
    const { body } = render(`/learning/${section.slug}`);
    expect(body.match(/<figure/g) || []).toHaveLength(section.entries.filter((e) => e.flow).length);
  });

  it.each(articles)("prerenders the diagrams in $slug", (article) => {
    const { body } = render(`/writing/${article.slug}`);
    expect(body.match(/<figure/g)).toHaveLength(article.content.filter((c) => c.diagram).length);
  });
});
