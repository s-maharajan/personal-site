import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { site } from "../content/site";
import { sortedArticles } from "../content/writing";
import { learningSections } from "../content/learning";
import { allEntries, entryCount, entryPath, formatDay } from "../lib/learning";
import { GithubIcon } from "../components/Icons";
import SectionCard from "../components/SectionCard";
import PostList from "../components/PostList";

function SectionHeading({ title, intro, to, linkLabel }) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-text">{title}</h2>
        {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
      </div>
      {to && (
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
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{site.role}</p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight text-text">
          {site.headline}
        </h1>
        <p className="font-serif text-xl sm:text-2xl leading-snug text-muted italic">{site.tagline}</p>
        <p className="max-w-prose text-base leading-relaxed text-muted">{site.bio}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          <Link to="/learning" className="btn-primary">Browse the learning log</Link>
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <GithubIcon className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-4 border-y border-line py-5 font-sans">
          {[
            [sortedArticles.length, "essays"],
            [entryCount, "curated notes"],
            [learningSections.length, "learning sections"],
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
          intro="Longer essays on integration, AI and cloud."
          to="/writing"
          linkLabel="All posts"
        />
        <PostList posts={rest.slice(0, 4)} numbered />
      </section>
    </div>
  );
}
