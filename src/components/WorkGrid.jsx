import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Cards lead with each case study's headline number. With `featureFirst`,
// the first card spans the full row so an odd count still fills the grid.
export default function WorkGrid({ items, featureFirst = false }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((w, i) => {
        const featured = featureFirst && i === 0;
        return (
          <li key={w.slug} className={featured ? "md:col-span-2" : ""}>
            <Link
              to={`/work/${w.slug}`}
              className="card group flex h-full flex-col p-6 hover:border-faint sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-3xl font-medium tracking-tight text-accent sm:text-4xl">
                    {w.metric.value}
                  </div>
                  <div className="mt-1 text-sm text-faint">{w.metric.label}</div>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <h3 className={`mt-8 font-semibold tracking-tight text-text ${featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>
                {w.title}
              </h3>
              <p className={`mt-2 leading-relaxed text-muted ${featured ? "max-w-prose" : "text-sm"}`}>
                {w.summary}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                <span className="font-mono text-xs tabular-nums text-faint">{w.year}</span>
                {w.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
