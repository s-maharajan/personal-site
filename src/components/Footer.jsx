import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70 pt-8 pb-12 print-hidden text-xs font-sans text-muted">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-serif text-sm text-text font-medium">{site.fullName || site.name}</span>
          <span className="text-faint mx-2">·</span>
          <a href={`mailto:${site.email}`} className="text-muted hover:text-accent underline underline-offset-2 transition-colors">
            {site.email}
          </a>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link to="/writing" className="hover:text-accent transition-colors">Writing</Link>
          <Link to="/work" className="hover:text-accent transition-colors">Work</Link>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
          <Link to="/resume" className="hover:text-accent transition-colors">Resume</Link>
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              GitHub
            </a>
          )}
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
          )}
        </nav>
      </div>

      <div className="mt-6 flex flex-col gap-1 border-t border-line/50 pt-4 text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {site.fullName || site.name}. All rights reserved.</span>
        <span>Built with React & Anthropic-inspired aesthetic</span>
      </div>
    </footer>
  );
}
