import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Monitor, Sun, Moon } from "lucide-react";
import { site } from "../content/site";

const links = [
  { to: "/about", label: "About" },
];

export default function Header() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // Storage may be blocked; default to the system preference.
    }
    return "system";
  });

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      document.documentElement.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && preference.matches),
      );
    };
    applyTheme();
    if (theme === "system") {
      preference.addEventListener("change", applyTheme);
      return () => preference.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const nextTheme = { system: "light", light: "dark", dark: "system" }[theme];
  const ThemeIcon = { system: Monitor, light: Sun, dark: Moon }[theme];
  const themeLabel = theme[0].toUpperCase() + theme.slice(1);
  const nextThemeLabel = nextTheme[0].toUpperCase() + nextTheme.slice(1);

  const cycleTheme = () => {
    setTheme(nextTheme);
    try {
      if (nextTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", nextTheme);
      }
    } catch {
      // The switch still works for this visit when storage is blocked.
    }
  };

  return (
    <header className="pt-8 sm:pt-12 print-hidden">
      <div className="flex items-center justify-between border-b border-line/70 pb-5">
        {/* Author Wordmark */}
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-text group-hover:text-accent transition-colors">
            {site.fullName || site.name}
          </span>
        </Link>

        {/* Minimal Navigation */}
        <div className="flex items-center gap-5 sm:gap-6">
          <nav className="flex items-center gap-5 sm:gap-6 text-sm font-sans">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? "text-accent font-medium"
                      : "text-muted hover:text-text"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 border-l border-line/80 pl-3 sm:pl-4">
            <button
              type="button"
              onClick={cycleTheme}
              className="p-1.5 text-muted hover:text-accent rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              title={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}`}
              aria-label={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}`}
            >
              <ThemeIcon className="h-4 w-4 text-accent" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
