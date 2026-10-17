import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-text pt-8 pb-12 print-hidden">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg font-medium text-text">
            {site.fullName || site.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Principal Engineer, AI & Platform ·{" "}
            <a href={`mailto:${site.email}`} className="hover:text-accent underline underline-offset-2">
              {site.email}
            </a>
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>·</span>
          <Link to="/work" className="hover:text-accent transition-colors">Work</Link>
          <span>·</span>
          <Link to="/writing" className="hover:text-accent transition-colors">Writing</Link>
          <span>·</span>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
          <span>·</span>
          <Link to="/resume" className="hover:text-accent transition-colors">Resume</Link>
          {site.links.github && (
            <>
              <span>·</span>
              <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                GitHub
              </a>
            </>
          )}
          {site.links.linkedin && (
            <>
              <span>·</span>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                LinkedIn
              </a>
            </>
          )}
        </nav>
      </div>

      <div className="mt-6 flex flex-col gap-1 border-t border-line pt-4 text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {site.fullName || site.name}. All rights reserved.</span>
        <span>Distributed Systems & AI Infrastructure</span>
      </div>
    </footer>
  );
}
