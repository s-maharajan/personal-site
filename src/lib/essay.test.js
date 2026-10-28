import { describe, expect, it } from "vitest";
import { sectionIds, readingProgress } from "./essay";

describe("essay navigation", () => {
  it("makes readable, deterministic, unique fragments", () => {
    const headings = ["Café & queues!", "Café & queues!", "cafe-queues-2", "!!!", "日本語"];
    expect(sectionIds(headings.map(heading => ({ heading })))).toEqual([
      "cafe-queues", "cafe-queues-2", "cafe-queues-2-2", "section", "日本語",
    ]);
  });
  it("measures the body from its start to its visible end and clamps overscroll", () => {
    expect(readingProgress(100, 2000, 800)).toBe(0);
    expect(readingProgress(-600, 2000, 800)).toBe(0.5);
    expect(readingProgress(-1200, 2000, 800)).toBe(1);
    expect(readingProgress(-1400, 2000, 800)).toBe(1);
    expect(readingProgress(100, 400, 800)).toBe(0);
    expect(readingProgress(0, 400, 800)).toBe(1);
  });
});
