import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function WorkGrid({ items }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((w, idx) => (
        <Link
          key={w.slug}
          to={`/work/${w.slug}`}
          className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs font-semibold text-faint">
                0{idx + 1}
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-accent transition-colors">
                {w.title}
              </h3>
            </div>
            <div className="font-mono text-xs font-semibold text-accent shrink-0 sm:text-right">
              {w.metric.label}: <span className="font-bold">{w.metric.value}</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl font-sans">
            {w.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/50 pt-3">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="tag-pill text-accent">{w.category}</span>
              <span className="tag-pill text-faint">{w.year}</span>
              {w.stack.slice(0, 4).map((tech) => (
                <span key={tech} className="tag-pill">{tech}</span>
              ))}
            </div>

            <span className="font-mono text-xs text-accent inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect Architecture</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
