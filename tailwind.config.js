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
        serif: ["Newsreader", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["IBM Plex Sans", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        page: "52rem",
        prose: "44rem",
      },
    },
  },
  plugins: [],
}
