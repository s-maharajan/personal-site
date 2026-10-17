import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function WorkGrid({ items }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((w) => (
        <article key={w.slug} className="py-6 transition-colors hover:bg-raised/40 -mx-3 px-3 rounded">
          <Link to={`/work/${w.slug}`} className="group block">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div className="flex items-baseline gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1 sm:mt-0" />
                <h3 className="font-serif text-xl font-medium text-text group-hover:text-accent transition-colors">
                  {w.title}
                </h3>
              </div>
              <div className="font-mono text-xs font-semibold text-accent shrink-0 sm:text-right">
                {w.metric.label}: {w.metric.value}
              </div>
            </div>

            <p className="mt-2 text-sm text-muted leading-relaxed pl-4 max-w-2xl font-sans">
              {w.summary}
            </p>

            <div className="mt-3 pl-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint">
                <span>{w.year}</span>
                <span>·</span>
                <span className="text-accent">#{w.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}</span>
                <span>·</span>
                <span>{w.stack.slice(0, 4).join(", ")}</span>
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read case study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
