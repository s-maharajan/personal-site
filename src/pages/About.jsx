import { Link } from "react-router-dom";
import { site } from "../content/site";
import { learningSections } from "../content/learning";

const focus = [
  ["Integration", "APIs, events and messaging that connect systems and keep data consistent across them."],
  ["AI", "Agents, retrieval and evaluation, and how teams build with AI every day."],
  ["Cloud", "Cloud-native platforms, delivery pipelines and the security around them."],
];

export default function About() {
  return (
    <div className="flex max-w-prose flex-col gap-10 pt-6">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">About</p>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text">Hi, I&apos;m {site.name}.</h1>
        <p className="font-serif text-xl italic leading-snug text-muted">{site.role}</p>
      </header>

      <div className="flex flex-col gap-4 text-base leading-relaxed text-muted">
        <p>
          I&apos;m {site.fullName}. I work on integration, AI and cloud, and I write
          here about the parts of that work that are worth thinking through in public.
        </p>
        <p>
          Alongside the essays I keep a <Link to="/learning" className="text-accent underline underline-offset-2">learning log</Link>:
          a curated set of notes on the posts, talks and tools that changed how I work, grouped into{" "}
          {learningSections.length} sections.
        </p>
        <p>Based: {site.location}.</p>
      </div>

      <section aria-labelledby="focus-heading">
        <h2 id="focus-heading" className="mb-4 font-serif text-2xl text-text">What I focus on</h2>
        <ul className="flex flex-col divide-y divide-line border-y border-line">
          {focus.map(([title, text]) => (
            <li key={title} className="py-4">
              <p className="font-medium text-text">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <a href={`mailto:${site.email}`} className="btn-primary">Email me</a>
        {site.links.github && (
          <a href={site.links.github} target="_blank" rel="noreferrer" className="btn-ghost">GitHub</a>
        )}
      </div>
    </div>
  );
}
