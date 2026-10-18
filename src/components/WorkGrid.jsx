import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function WorkGrid({ items }) {
  return (
    <div className="flex flex-col divide-y divide-line/60">
      {items.map((w) => (
        <Link
          key={w.slug}
          to={`/work/${w.slug}`}
          className="group py-5 first:pt-1 transition-colors block"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h2 className="font-serif text-lg sm:text-xl text-text group-hover:text-accent transition-colors leading-snug">
              {w.title}
            </h2>
            <div className="font-mono text-xs font-medium text-accent shrink-0 sm:text-right">
              {w.metric.label}: {w.metric.value}
            </div>
          </div>

          <p className="mt-2 text-sm text-muted leading-relaxed font-sans max-w-prose">
            {w.summary}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-faint">
              <span className="text-accent font-medium">{w.category}</span>
              <span>·</span>
              <span>{w.year}</span>
              <span>·</span>
              <span>{w.stack.slice(0, 4).join(", ")}</span>
            </div>

            <span className="font-mono text-xs text-accent inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Read dossier</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
