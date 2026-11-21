import { Link } from "react-router-dom";
import { learningSections } from "../content/learning";
import { allEntries, entryCount, entryPath, formatDay } from "../lib/learning";
import SectionCard from "../components/SectionCard";

export default function Learning() {
  return (
    <div className="flex flex-col gap-14 pt-6">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Learning log</p>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text">What I learned, by section</h1>
        <p className="max-w-reading text-base leading-relaxed text-muted">
          Every day I save posts, talks and repositories worth a closer look, research them, and
          write a note. Most do not survive a second read. These {entryCount} did: each one has the
          idea, how it works, a way to try it and the caveats, with a link to the original source.
        </p>
      </header>

      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="sr-only">Sections</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {learningSections.map((s, i) => <SectionCard key={s.slug} section={s} index={i} />)}
        </div>
      </section>

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="mb-4 font-serif text-2xl text-text">Recently added</h2>
        <ol className="flex flex-col divide-y divide-line border-y border-line">
          {allEntries.slice(0, 10).map((e) => (
            <li key={`${e.section.slug}-${e.slug}`}>
              <Link to={entryPath(e)} className="group grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <time dateTime={e.date} className="font-mono text-xs text-faint sm:pt-1">{formatDay(e.date)}</time>
                <div>
                  <span className="font-mono text-xs text-accent">{e.section.title}</span>
                  <p className="font-serif text-lg leading-snug text-text group-hover:text-accent transition-colors">{e.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{e.takeaway}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
