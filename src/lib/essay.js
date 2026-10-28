// Heading text determines the fragment; suffixes keep repeated headings unique.
export function sectionIds(sections) {
  const used = new Set();
  return sections.map(({ heading }) => {
    const base = heading.normalize("NFKD").replace(/\p{M}/gu, "")
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return id;
  });
}

export function readingProgress(top, height, viewportHeight) {
  const distance = height - viewportHeight;
  if (distance <= 0) return top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -top / distance));
}
