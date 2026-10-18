import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { site } from "../content/site";

const links = [
  { to: "/about", label: "About" },
];

export default function Header() {
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
              onClick={() => setIsDark((prev) => !prev)}
              className="p-1.5 text-muted hover:text-text rounded-md transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
