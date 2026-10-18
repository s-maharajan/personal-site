/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        raised: "var(--raised)",
        text: "var(--text)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-tertiary": "var(--accent-tertiary)",
      },
      fontFamily: {
        serif: ["Newsreader", "Charter", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        page: "46rem",
        prose: "42rem",
      },
    },
  },
  plugins: [],
};
