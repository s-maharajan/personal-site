import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { site } from "../content/site";
import { profile } from "../content/profile";
import { learningSections } from "../content/learning";

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-4 font-serif text-2xl text-text">{title}</h2>
      {children}
    </section>
  );
}

export default function About() {
  return (
    <div className="flex max-w-prose flex-col gap-12 pt-6">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">About</p>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text">Hi, I&apos;m {site.name}.</h1>
        <p className="font-serif text-xl italic leading-snug text-muted">{site.role}</p>
      </header>

      <div className="flex flex-col gap-4 text-base leading-relaxed text-muted">
        {profile.intro.map((text) => <p key={text}>{text}</p>)}
        <p>
          Here I write essays and keep a <Link to="/learning" className="text-accent underline underline-offset-2">learning log</Link>:
          curated notes on the posts, talks and tools that changed how I work, in {learningSections.length} sections.
          Based: {site.location}.
        </p>
      </div>

      <Section id="focus-heading" title="What I focus on">
        <ul className="flex flex-col divide-y divide-line border-y border-line">
          {profile.focus.map(([title, text]) => (
            <li key={title} className="py-4">
              <p className="font-medium text-text">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="highlights-heading" title="Highlights">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
          {profile.highlights.map((text) => <li key={text} className="pl-1">{text}</li>)}
        </ul>
      </Section>

      <Section id="experience-heading" title="Experience">
        <ol className="flex flex-col divide-y divide-line border-y border-line">
          {profile.timeline.map(([when, role, sector]) => (
            <li key={when} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr_auto] sm:gap-4">
              <span className="font-mono text-xs text-faint sm:pt-0.5">{when}</span>
              <span className="text-sm text-text">{role}</span>
              <span className="font-mono text-xs text-faint sm:pt-0.5">{sector}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="certifications-heading" title="Certifications">
        <ul className="grid gap-2 sm:grid-cols-2">
          {profile.certifications.map(([name, issuer]) => (
            <li key={name} className="rounded-xl border border-line bg-surface px-4 py-3">
              <p className="text-sm font-medium text-text">{name}</p>
              <p className="mt-0.5 font-mono text-xs text-faint">{issuer}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="open-source-heading" title="Open source">
        <ul className="flex flex-col gap-3">
          {profile.openSource.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent"
              >
                <span className="inline-flex items-center gap-1 font-mono text-sm text-text group-hover:text-accent">
                  {project.name} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-muted">{project.description}</span>
                <span className="font-mono text-xs text-faint">{project.stack}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {site.links.github && (
          <a href={site.links.github} target="_blank" rel="noreferrer" className="btn-primary">GitHub</a>
        )}
        {site.links.linkedin && (
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">LinkedIn</a>
        )}
      </div>
    </div>
  );
}
