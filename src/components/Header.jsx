import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import { site } from "../content/site";

const links = [
  { to: "/work", label: "Work" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
];

export default function Header({ onOpenPalette }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pt-6 sm:pt-8 print:hidden">
      <Link to="/" className="group flex items-center gap-2.5 font-medium text-text">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm font-semibold text-bg">
          {site.name[0].toLowerCase()}
        </span>
        <span className="transition-colors group-hover:text-accent font-semibold">{site.name}</span>
      </Link>

      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 text-xs sm:text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 transition-colors ${
                  isActive ? "bg-raised font-medium text-text" : "text-muted hover:text-text"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-faint hover:text-text sm:h-9 sm:w-auto sm:px-2.5 sm:gap-1.5"
            title="Open command palette (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <kbd className="hidden font-mono text-[10px] text-faint sm:inline-block">⌘K</kbd>
          </button>
        )}
      </div>
    </header>
  );
}
