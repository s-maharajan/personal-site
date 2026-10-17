import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line pt-8 pb-12 print-hidden font-mono text-xs">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-6 w-6 place-items-center rounded bg-surface border border-line text-[10px] font-bold text-accent">
            SM
          </div>
          <div>
            <span className="font-semibold text-text">{site.fullName || site.name}</span>
            <span className="text-faint mx-2">·</span>
            <a href={`mailto:${site.email}`} className="text-muted hover:text-accent underline underline-offset-2">
              {site.email}
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
          <Link to="/" className="hover:text-text transition-colors">Overview</Link>
          <Link to="/work" className="hover:text-text transition-colors">Case Studies</Link>
          <Link to="/writing" className="hover:text-text transition-colors">Field Notes</Link>
          <Link to="/tools" className="hover:text-text transition-colors">Tools</Link>
          <Link to="/banter" className="hover:text-text transition-colors">Banter</Link>
          <Link to="/about" className="hover:text-text transition-colors">Philosophy</Link>
          <Link to="/resume" className="hover:text-text transition-colors">Resume</Link>
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
              GitHub
            </a>
          )}
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
              LinkedIn
            </a>
          )}
        </nav>
      </div>

      <div className="mt-6 flex flex-col gap-1 border-t border-line/60 pt-4 text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {site.fullName || site.name}. Distributed Systems & AI Platform.</span>
        <span>Engineered Studio · Deployed on Vercel</span>
      </div>
    </footer>
  );
}
