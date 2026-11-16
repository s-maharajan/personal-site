import { Link } from "react-router-dom";
import { site } from "../content/site";
import { learningSections } from "../content/learning";
import { navLinks } from "../content/nav";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line pt-10 pb-12 print-hidden font-sans text-sm text-muted">
      <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <span className="font-serif text-lg text-text">
            {site.initials}<span className="text-accent">.</span>
          </span>
          <p className="max-w-xs leading-relaxed">{site.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">Site</p>
          <ul className="flex flex-col gap-1.5">
            {navLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link></li>
            ))}
            <li><a href="/feed.xml" className="hover:text-accent transition-colors">RSS</a></li>
            {site.links.github && (
              <li><a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">GitHub</a></li>
            )}
          </ul>
        </nav>

        <nav aria-label="Learning sections">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">Learning</p>
          <ul className="flex flex-col gap-1.5">
            {learningSections.map((s) => (
              <li key={s.slug}>
                <Link to={`/learning/${s.slug}`} className="hover:text-accent transition-colors">{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-10 border-t border-line pt-4 font-mono text-xs text-faint">
        © {new Date().getFullYear()} {site.fullName}. Built with React and Vite, hosted on Vercel.
      </p>
    </footer>
  );
}
