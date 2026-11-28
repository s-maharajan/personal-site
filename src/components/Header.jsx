import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { site } from "../content/site";
import { navLinks } from "../content/nav";

// Page background per theme (the --bg tokens in index.css), used for the
// browser UI colour. index.html sets both by system preference; once someone
// picks a theme, both follow the choice.
// eslint-disable-next-line react-refresh/only-export-components
export const THEME_COLORS = { light: "#FBFAF7", dark: "#0F1013" };

const syncThemeColor = (theme) => {
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
};

const storedTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
};

export default function Header() {
  // The pre-paint script in index.html sets the first theme. Until someone
  // picks one, keep following the system preference.
  useEffect(() => {
    const chosen = storedTheme();
    if (chosen === "light" || chosen === "dark") syncThemeColor(chosen);
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!storedTheme()) document.documentElement.classList.toggle("dark", preference.matches);
    };
    preference.addEventListener("change", follow);
    return () => preference.removeEventListener("change", follow);
  }, []);

  const toggleTheme = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    syncThemeColor(dark ? "dark" : "light");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // The switch still works for this visit when storage is blocked.
    }
  };

  return (
    <header className="pt-6 sm:pt-10 print-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="group" aria-label={`${site.handle}, home`}>
          <span className="whitespace-nowrap font-serif text-lg sm:text-2xl font-medium tracking-tight text-text group-hover:text-accent transition-colors">
            {site.handle}<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <nav aria-label="Main" className="flex items-center sm:gap-1 text-[13px] sm:text-sm font-sans">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-md px-1 sm:px-2 py-1 transition-colors ${l.end ? "hidden sm:inline" : ""} ${
                    isActive ? "text-text font-medium bg-raised" : "text-muted hover:text-text"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="ml-0.5 sm:ml-1 rounded-md border border-line p-1 sm:p-1.5 text-muted transition-[color,border-color,transform] duration-200 hover:border-accent hover:text-accent motion-safe:active:scale-95 motion-safe:active:rotate-12"
            title="Switch between light and dark theme"
            aria-label="Switch between light and dark theme"
          >
            <Moon className="theme-icon-dark h-4 w-4" aria-hidden="true" />
            <Sun className="theme-icon-light h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
