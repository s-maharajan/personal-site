import { site } from "../content/site";

export default function About() {
  return (
    <div className="flex flex-col gap-6 max-w-prose">
      <title>{`About · ${site.fullName || site.name}`}</title>

      <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text">
        About
      </h1>

      <div className="flex flex-col gap-3 text-base leading-relaxed text-muted font-sans">
        <p>
          I'm {site.fullName}. I work on distributed systems and AI infrastructure, and I write
          here about the parts of that work that are worth thinking through in public.
        </p>
        <p>Location: {site.location}.</p>
      </div>

      <div className="pt-2 flex items-center gap-4 text-sm font-mono text-muted">
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        {site.links.github && (
          <>
            <span>·</span>
            <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              GitHub
            </a>
          </>
        )}
      </div>
    </div>
  );
}
