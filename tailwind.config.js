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
        "accent-secondary": "var(--accent-secondary)",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        page: "56rem",
        prose: "46rem",
      },
    },
  },
  plugins: [],
}
