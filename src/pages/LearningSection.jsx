import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { learningSections } from "../content/learning";
import { findSection, formatDay, latestDate, sourceHost } from "../lib/learning";
import { inline } from "../components/Prose";
import Diagram from "../components/Diagram";
import NotFound from "./NotFound";

function Entry({ entry, number }) {
  return (
    <article id={entry.slug} className="learning-entry flex flex-col gap-4 border-t border-line pt-10">
      <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-faint">
        <span className="text-accent">{String(number).padStart(2, "0")}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={entry.date}>{formatDay(entry.date)}</time>
        {entry.source && (
          <>
            <span aria-hidden="true">·</span>
            <span>{entry.source}</span>
          </>
        )}
      </p>

      <h2 className="font-serif text-2xl sm:text-3xl/9 leading-tight tracking-tight text-text">
        <a href={`#${entry.slug}`} className="hover:text-accent transition-colors">{entry.title}</a>
      </h2>

      <p className="border-l-2 border-accent pl-4 font-serif text-lg italic leading-relaxed text-text">
        {entry.takeaway}
      </p>

      {entry.summary && <p className="text-base leading-relaxed text-muted">{inline(entry.summary)}</p>}

      {(entry.flow || entry.points.length > 0) && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-faint">How it works</h3>
          {entry.flow && <Diagram {...entry.flow} label={`How ${entry.title} works, step by step`} />}
          {entry.points.length > 0 && <ul className="list-disc stack-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
            {entry.points.map((p, i) => <li key={i} className="pl-1">{inline(p)}</li>)}
          </ul>}
        </div>
      )}

      {entry.tryIt && (
        <div className="rounded-xl border border-line bg-raised px-4 py-3">
          <h3 className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Try it</h3>
          <p className="text-sm leading-relaxed text-text wrap-break-word">{inline(entry.tryIt)}</p>
        </div>
      )}

      {entry.caveat && (
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-medium text-text">Caveats: </span>{inline(entry.caveat)}
        </p>
      )}

      <a
        href={entry.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 text-sm text-accent hover:text-accent-hover"
      >
        Read the source on {sourceHost(entry.url)}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </article>
  );
}

export default function LearningSection() {
  const { section: slug } = useParams();
  const section = findSection(slug);
  if (!section) return <NotFound />;

  const index = learningSections.indexOf(section);
  const previous = learningSections[index - 1];
  const next = learningSections[index + 1];

  return (
    <div className="mx-auto flex max-w-reading flex-col gap-10 pt-6">
      <Link to="/learning" className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" /> All sections
      </Link>

      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          Learning · {String(index + 1).padStart(2, "0")} of {learningSections.length}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text">{section.title}</h1>
        <p className="font-serif text-xl italic text-muted">{section.kicker}</p>
        <p className="text-base leading-relaxed text-muted">{section.description}</p>
        <p className="font-mono text-xs text-faint">
          {section.entries.length} notes · {section.readTime} · updated {formatDay(latestDate(section))}
        </p>
      </header>

      <nav aria-label="In this section" className="rounded-2xl border border-line bg-surface p-5">
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-faint">In this section</p>
        <ol className="flex flex-col gap-2 text-sm">
          {section.entries.map((e, i) => (
            <li key={e.slug} className="grid grid-cols-[2rem_1fr]">
              <span className="font-mono text-xs text-faint pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <a href={`#${e.slug}`} className="text-muted hover:text-accent">{e.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex flex-col gap-10">
        {section.entries.map((e, i) => <Entry key={e.slug} entry={e} number={i + 1} />)}
      </div>

      <nav aria-label="More sections" className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {previous ? (
          <Link to={`/learning/${previous.slug}`} className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-faint"><ArrowLeft className="h-3 w-3 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" /> Previous</span>
            <span className="mt-1 block font-serif text-lg text-text transition-colors group-hover:text-accent">{previous.title}</span>
          </Link>
        ) : <span className="hidden sm:block" aria-hidden="true" />}
        {next && (
          <Link to={`/learning/${next.slug}`} className="group rounded-2xl border border-line bg-surface p-4 text-right transition-colors hover:border-accent">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-faint">Next <ArrowRight className="h-3 w-3 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" /></span>
            <span className="mt-1 block font-serif text-lg text-text transition-colors group-hover:text-accent">{next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
