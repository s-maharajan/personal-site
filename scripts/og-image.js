// Renders the Open Graph cards: one for the site, one per essay.
//
// satori lays out a React-like tree into SVG and resvg rasterises it to PNG.
// satori writes text as vector paths, so the PNG looks the same on every
// machine and the build never needs a font installed on the host: the Fraunces
// files in fonts/ are read from disk and bundled with the repository.
import { readFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { OG_WIDTH, OG_HEIGHT } from "../src/lib/og.js";
import { site } from "../src/content/site.js";

// Mirrors the palette in src/index.css. scripts/og-image.test.js compares the
// two so the cards cannot drift away from the site colours.
export const palette = {
  paper: "#FBFAF7",
  surface: "#FFFFFF",
  raised: "#F2F0EA",
  text: "#17171A",
  muted: "#4E4E55",
  faint: "#66666D",
  line: "#E3E0D8",
  pine: "#B13F12",
  pineDeep: "#8E3009",
  clay: "#3F5F8A",
  plum: "#4F6B45",
};

// The name matches the family name inside each file so satori and any other
// consumer agree on which face is which weight.
const FONT_FILES = [
  { name: "Fraunces", file: "Fraunces-Regular.ttf", weight: 400, style: "normal" },
  { name: "Fraunces", file: "Fraunces-Bold.ttf", weight: 700, style: "normal" },
  { name: "Fraunces", file: "Fraunces-Italic.ttf", weight: 400, style: "italic" },
  { name: "Fraunces SemiBold", file: "Fraunces-SemiBold.ttf", weight: 600, style: "normal" },
  { name: "Fraunces SemiBold", file: "Fraunces-SemiBoldItalic.ttf", weight: 600, style: "italic" },
];

const fontFile = (name) => new URL(`../fonts/${name}`, import.meta.url);

let fontCache = null;

// satori wants the raw bytes of each face, so read them once and keep them.
export const loadFonts = () => {
  if (!fontCache) {
    fontCache = FONT_FILES.map(({ name, file, weight, style }) => {
      const bytes = readFileSync(fontFile(file));
      const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      return { name, file, weight, style, data };
    });
  }
  return fontCache;
};

// A minimal element factory: satori takes the same shape React does.
const h = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
  },
});

// satori lays out with the content-box model, so every box asks for
// border-box explicitly: padding then stays inside the canvas.
const boxStyle = (style) => ({ display: "flex", boxSizing: "border-box", ...style });

const text = (style, children) => h("div", { style: boxStyle(style) }, children);

const box = (style, ...children) => h("div", { style: boxStyle(style) }, ...children);

const square = (color, size) =>
  box({ width: `${size}px`, height: `${size}px`, backgroundColor: color, borderRadius: "3px" });

const chips = (size = 11) =>
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "7px" } },
    square(palette.pine, size),
    square(palette.clay, size),
    square(palette.plum, size),
  );

const rule = (width = "100%", color = palette.line, height = "2px") =>
  box({ width, height, backgroundColor: color });

// Long titles still have to fit inside the card, so the type size steps down
// as the title grows.
const titleSize = (title) => {
  const length = title.length;
  if (length <= 40) return 80;
  if (length <= 64) return 68;
  if (length <= 96) return 58;
  return 50;
};

export const siteCard = () =>
  box(
    {
      flexDirection: "row",
      width: "100%",
      height: "100%",
      backgroundColor: palette.paper,
      fontFamily: "Fraunces",
    },
    // Brand panel
    box(
      {
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
        width: "440px",
        padding: "56px",
        backgroundColor: palette.pine,
      },
      text(
        {
          fontFamily: "Fraunces",
          fontWeight: 700,
          fontSize: "140px",
          lineHeight: "140px",
          color: palette.paper,
        },
        site.name,
      ),
      box(
        { flexDirection: "column", gap: "22px" },
        rule("72px", palette.pineDeep, "3px"),
        text({ fontSize: "25px", letterSpacing: "1px", color: palette.paper }, "personal-site"),
      ),
    ),
    // Name, role and tagline
    box(
      {
        flexDirection: "column",
        justifyContent: "center",
        flexGrow: 1,
        padding: "56px 60px",
        gap: "22px",
      },
      box(
        { flexDirection: "column", gap: "18px" },
        text(
          {
            fontFamily: "Fraunces SemiBold",
            fontWeight: 600,
            fontSize: "58px",
            lineHeight: "64px",
            color: palette.text,
          },
          site.fullName,
        ),
        text({ fontSize: "26px", lineHeight: "36px", color: palette.muted }, site.role),
      ),
      rule("96px"),
      text(
        { fontStyle: "italic", fontSize: "36px", lineHeight: "48px", color: palette.pine },
        site.tagline,
      ),
      box(
        { alignItems: "center", justifyContent: "space-between" },
        text(
          { fontSize: "25px", color: palette.faint },
          "Essays on retrieval, inference and reliability",
        ),
        chips(),
      ),
    ),
  );

export const essayCard = ({ title, topic, date, readTime, author }) => {
  const size = titleSize(title);
  return box(
    {
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: "58px 66px",
      backgroundColor: palette.paper,
      fontFamily: "Fraunces",
    },
    // Masthead: the brand chips, the site name and the publication date.
    box(
      { alignItems: "center", justifyContent: "space-between" },
      box(
        { alignItems: "center", gap: "16px" },
        chips(),
        text({ fontSize: "26px", color: palette.faint }, "personal-site"),
      ),
      text({ fontSize: "26px", color: palette.faint }, date),
    ),
    // Topic and title, centred in the space the masthead and footer leave.
    box(
      { flexDirection: "column", justifyContent: "center", flexGrow: 1, gap: "20px" },
      text(
        {
          fontSize: "26px",
          fontWeight: 600,
          letterSpacing: "5px",
          textTransform: "uppercase",
          color: palette.pine,
        },
        topic,
      ),
      text(
        {
          fontWeight: 400,
          fontSize: `${size}px`,
          lineHeight: `${Math.round(size * 1.12)}px`,
          color: palette.text,
          width: "1000px",
        },
        title,
      ),
    ),
    // Footer: who wrote it and how long it takes.
    box(
      { flexDirection: "column", gap: "24px" },
      rule(),
      box(
        { alignItems: "center", justifyContent: "space-between" },
        text({ fontSize: "28px", color: palette.muted }, author),
        text({ fontSize: "26px", color: palette.faint }, readTime),
      ),
    ),
  );
};

// Lays out a card and returns the PNG bytes.
export const renderOgPng = async (card) => {
  const svg = await satori(card, { width: OG_WIDTH, height: OG_HEIGHT, fonts: loadFonts() });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } });
  return resvg.render().asPng();
};
