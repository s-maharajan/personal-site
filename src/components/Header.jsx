import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";
import { site } from "../content/site";

const links = [
  { to: "/", label: "Overview" },
  { to: "/work", label: "Case Studies" },
  { to: "/writing", label: "Field Notes" },
  { to: "/tools", label: "Tools" },
  { to: "/banter", label: "Banter" },
  { to: "/about", label: "Philosophy" },
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
    <header className="pt-6 sm:pt-8 print-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-line pb-4">
        {/* Brand identity */}
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface font-mono text-xs font-black text-accent shadow-sm transition group-hover:border-accent">
            SM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-text group-hover:text-accent transition-colors">
                {site.fullName || site.name}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="font-mono text-[11px] text-faint">
              {site.role}
            </p>
          </div>
        </Link>

        {/* Navigation & Utilities */}
        <div className="flex items-center justify-between md:justify-end gap-2 overflow-x-auto no-scrollbar py-0.5">
          <nav className="flex items-center rounded-xl border border-line bg-surface p-1 text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-2.5 py-1 whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-text font-semibold text-bg shadow-sm"
                      : "text-muted hover:text-text hover:bg-raised"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:border-text hover:text-text"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-accent" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {onOpenPalette && (
              <button
                type="button"
                onClick={onOpenPalette}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 text-xs font-mono text-faint transition hover:border-text hover:text-text"
                title="Command Palette (⌘K)"
              >
                <Search className="h-3 w-3" />
                <kbd className="text-[10px]">⌘K</kbd>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
