import { Link, NavLink } from "react-router-dom";
import { site } from "../content/site";

const links = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 pt-6 sm:pt-8">
      <Link to="/" className="group flex items-center gap-2.5 font-medium text-text">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm font-semibold text-bg">
          {site.name[0].toLowerCase()}
        </span>
        <span className="transition-colors group-hover:text-accent">{site.name}</span>
      </Link>
      <nav className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 text-sm">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 transition-colors ${
                isActive ? "bg-raised text-text" : "text-muted hover:text-text"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
