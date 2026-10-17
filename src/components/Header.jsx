import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";
import { site } from "../content/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
];

export default function Header({ onOpenPalette }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="pt-6 sm:pt-10 print-hidden">
      {/* Masthead */}
      <div className="flex flex-col items-center text-center">
        <Link to="/" className="group inline-block">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-text transition-colors group-hover:text-accent sm:text-4xl">
            {site.fullName || site.name}
          </h1>
        </Link>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-faint">
          {site.role}
        </p>
      </div>

      {/* Editorial Navigation Strip */}
      <div className="mt-5 flex items-center justify-between border-y border-line py-2.5">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:gap-x-6">
          {links.map((l, i) => (
            <div key={l.to} className="flex items-center gap-4 sm:gap-6">
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? "font-semibold text-accent underline decoration-accent decoration-1 underline-offset-4"
                      : "text-muted hover:text-text"
                  }`
                }
              >
                {l.label}
              </NavLink>
              {i < links.length - 1 && (
                <span className="select-none text-line" aria-hidden="true">
                  |
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Right side utility icons: Theme switch & search */}
        <div className="flex items-center gap-1.5 pl-3">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="grid h-8 w-8 place-items-center rounded text-muted transition hover:bg-raised hover:text-text"
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              className="inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs font-mono text-faint transition hover:bg-raised hover:text-text"
              title="Quick Search (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden sm:inline-block">⌘K</kbd>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
