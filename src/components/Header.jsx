import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { site } from "../content/site";
import { navLinks } from "../content/nav";


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
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // The switch still works for this visit when storage is blocked.
    }
  };

  return (
    <header className="pt-6 sm:pt-10 print-hidden">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${site.fullName}, home`}>
          <span className="font-serif text-2xl font-medium tracking-tight text-text">
            {site.initials}<span className="text-accent">.</span>
          </span>
          <span className="hidden sm:inline font-sans text-sm text-muted group-hover:text-text transition-colors">
            {site.fullName}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1 text-sm font-sans">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-md px-2 py-1 transition-colors ${l.end ? "hidden sm:inline" : ""} ${
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
            className="ml-1 rounded-md border border-line p-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
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
