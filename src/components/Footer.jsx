import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-3 border-t border-line py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <div className="flex gap-5">
        <Link to="/work" className="transition-colors hover:text-text">Work</Link>
        <Link to="/about" className="transition-colors hover:text-text">About</Link>
        {site.links.github && (
          <a href={site.links.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-text">
            GitHub
          </a>
        )}
      </div>
    </footer>
  );
}
