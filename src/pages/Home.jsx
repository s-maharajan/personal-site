import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { site } from "../content/site";
import { profile } from "../content/profile";
import { sortedArticles } from "../content/writing";
import { learningSections } from "../content/learning";
import { allEntries, entryCount, entryPath, formatDay } from "../lib/learning";
import { GithubIcon, LinkedinIcon } from "../components/Icons";
import { ArrowUpRight } from "lucide-react";
import SectionCard from "../components/SectionCard";
import PostList from "../components/PostList";

function SectionHeading({ title, intro, to, linkLabel, external = false }) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-text">{title}</h2>
        {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
      </div>
      {to && external && (
        <a href={to} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover">
          {linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {to && !external && (
        <Link to={to} className="group inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover">
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const [featured, ...rest] = sortedArticles;
  const recent = allEntries.slice(0, 5);

  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/* Hero */}
      <section className="flex flex-col gap-6 pt-6 sm:pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{site.title}</p>
        <h1 className="font-serif text-3xl sm:text-5xl leading-[1.1] tracking-tight text-text">
          {site.headline}
        </h1>
        <p className="font-serif text-xl sm:text-2xl leading-snug text-muted italic">{site.tagline}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          <Link to="/learning" className="btn-primary">Browse the learning log</Link>
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <GithubIcon className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
            </a>
          )}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-4 border-y border-line py-5 font-sans">
          {[
            [profile.years, "years in integration"],
            [sortedArticles.length, "essays"],
            [entryCount, "curated notes"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-3xl text-text">{value}</dd>
              <dd className="font-mono text-xs text-faint">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured long read + latest learning */}
      <section aria-labelledby="featured-heading" className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <h2 id="featured-heading" className="sr-only">Featured</h2>
        <Link
          to={`/writing/${featured.slug}`}
          className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 sm:p-8 transition-colors hover:border-accent"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-accent">Long read · {featured.topic}</span>
          <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-text group-hover:text-accent transition-colors">
            {featured.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{featured.summary}</p>
          <span className="mt-auto pt-2 font-mono text-xs text-faint">{featured.date} · {featured.readTime}</span>
        </Link>

        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-raised p-6">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">Latest learning</span>
          <ul className="flex flex-col divide-y divide-line">
            {recent.slice(0, 3).map((e) => (
              <li key={`${e.section.slug}-${e.slug}`} className="py-2.5 first:pt-0">
                <Link to={entryPath(e)} className="group block">
                  <span className="font-mono text-[11px] text-faint">{formatDay(e.date)} · {e.section.title}</span>
                  <span className="mt-0.5 block font-serif text-base leading-snug text-text group-hover:text-accent transition-colors">
                    {e.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/learning" className="mt-auto text-sm text-accent hover:text-accent-hover">All {entryCount} notes →</Link>
        </div>
      </section>

      {/* Learning sections */}
      <section aria-labelledby="sections-heading">
        <SectionHeading
          title={<span id="sections-heading">Learning, by section</span>}
          intro="Notes from what I read and try, kept only when they proved useful."
          to="/learning"
          linkLabel="All sections"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {learningSections.map((s, i) => <SectionCard key={s.slug} section={s} index={i} />)}
        </div>
      </section>

      {/* Writing */}
      <section aria-labelledby="writing-heading">
        <SectionHeading
          title={<span id="writing-heading">Latest writing</span>}
          intro="Longer essays on integration, cloud and AI."
          to="/writing"
          linkLabel="All posts"
        />
        <PostList posts={rest.slice(0, 4)} numbered />
      </section>

      {/* Open source */}
      <section aria-labelledby="open-source-heading">
        <SectionHeading
          title={<span id="open-source-heading">Open source</span>}
          intro="Small tools I build and use every day."
          to={site.links.github}
          linkLabel="More on GitHub"
          external
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.openSource.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="flex items-center justify-between font-mono text-sm text-text group-hover:text-accent">
                  {project.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-muted">{project.description}</span>
                <span className="mt-auto pt-1 font-mono text-xs text-faint">{project.stack}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
