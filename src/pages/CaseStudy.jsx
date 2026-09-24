import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "../content/site";
import { work, findWork } from "../content/work";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug } = useParams();
  const w = findWork(slug);
  if (!w) return <NotFound />;

  const next = work[(work.indexOf(w) + 1) % work.length];

  return (
    <article>
      <title>{`${w.title} · ${site.name}`}</title>

      <Link to="/work" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        All case studies
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="label">
          {w.year} · {w.tags.join(" · ")}
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
          {w.title}
        </h1>
      </header>

      <dl className="card mt-10 grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {w.results.map(([label, value]) => (
          <div key={label} className="p-6">
            <dt className="text-sm text-faint">{label}</dt>
            <dd className="mt-2 font-mono text-2xl tabular-nums tracking-tight text-accent">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-prose">
          <h2 className="text-xl font-semibold text-text">The problem</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{w.problem}</p>

          <h2 className="mt-12 text-xl font-semibold text-text">What I did</h2>
          <ol className="mt-5 flex flex-col gap-5">
            {w.approach.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-faint">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:pt-1">
          <p className="label">Stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {w.stack.map((s) => (
              <li key={s} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
                {s}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <Link
        to={`/work/${next.slug}`}
        className="card group mt-20 flex items-center justify-between gap-6 p-6 hover:border-faint sm:p-8"
      >
        <div>
          <p className="label">Next case study</p>
          <p className="mt-2 text-lg font-medium text-text sm:text-xl">{next.title}</p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-faint transition group-hover:translate-x-1 group-hover:text-accent"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
