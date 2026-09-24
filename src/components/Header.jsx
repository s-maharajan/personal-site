import { Link, NavLink } from "react-router-dom";
import { site } from "../content/site";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 pt-6 sm:pt-8">
      <Link to="/" className="font-medium text-text transition-colors hover:text-accent">
        {site.name}
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 transition-colors ${
                isActive ? "text-text" : "text-muted hover:text-text"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
