import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-3 border-t border-line py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between print:hidden">
      <span>© {new Date().getFullYear()} {site.fullName || site.name}</span>
      <div className="flex flex-wrap gap-5">
        <Link to="/work" className="transition-colors hover:text-text">Work</Link>
        <Link to="/writing" className="transition-colors hover:text-text">Writing</Link>
        <Link to="/about" className="transition-colors hover:text-text">About</Link>
        <Link to="/resume" className="transition-colors hover:text-text">Resume</Link>
        {site.links.github && (
          <a href={site.links.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-text">
            GitHub
          </a>
        )}
        {site.links.linkedin && (
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-text">
            LinkedIn
          </a>
        )}
      </div>
    </footer>
  );
}
