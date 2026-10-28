import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./index.css", import.meta.url), "utf8");
const luminance = (hex) => {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
};

describe("small-text contrast", () => {
  it.each([":root", ".dark"])("meets AA for faint text and the skip link in %s", (selector) => {
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    const token = (name) => block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))[1];
    // Metadata is 11–12px, so the large-text exception does not apply.
    expect(contrast(token("faint"), token("bg"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("faint"), token("surface"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("text"), token("surface"))).toBeGreaterThanOrEqual(4.5);
  });
});
