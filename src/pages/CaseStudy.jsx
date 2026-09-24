import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { site } from "../content/site";
import { work, findWork } from "../content/work";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug } = useParams();
  const w = findWork(slug);
  if (!w) return <NotFound />;

  const index = work.indexOf(w);
  const next = work[(index + 1) % work.length];

  return (
    <article>
      <title>{`${w.title} · ${site.name}`}</title>

      <Link to="/work" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        All work
      </Link>

      <p className="label mt-8">
        {w.year} · {w.tags.join(" · ")}
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
        {w.title}
      </h1>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {w.results.map(([label, value]) => (
          <div key={label} className="bg-bg p-4">
            <dt className="text-xs text-faint">{label}</dt>
            <dd className="mt-1 font-mono text-lg tabular-nums text-text">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-lg font-semibold text-text">The problem</h2>
      <p className="mt-3 leading-relaxed text-muted">{w.problem}</p>

      <h2 className="mt-10 text-lg font-semibold text-text">What I did</h2>
      <ol className="mt-3 flex flex-col gap-3">
        {w.approach.map((step, i) => (
          <li key={step} className="flex gap-4 leading-relaxed text-muted">
            <span className="font-mono text-sm tabular-nums text-faint">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-lg font-semibold text-text">Stack</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {w.stack.map((s) => (
          <li key={s} className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-muted">
            {s}
          </li>
        ))}
      </ul>

      <Link
        to={`/work/${next.slug}`}
        className="group mt-16 block rounded-lg border border-line p-5 transition-colors hover:border-accent"
      >
        <span className="label">Next case study</span>
        <span className="mt-2 block font-medium text-text group-hover:text-accent">{next.title}</span>
      </Link>
    </article>
  );
}
