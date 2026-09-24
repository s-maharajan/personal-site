import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function WorkList({ items }) {
  return (
    <ul className="-mx-3 flex flex-col">
      {items.map((w) => (
        <li key={w.slug}>
          <Link
            to={`/work/${w.slug}`}
            className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-lg px-3 py-4 transition-colors hover:bg-surface"
          >
            <h3 className="font-medium text-text group-hover:text-accent">{w.title}</h3>
            <span className="font-mono text-sm tabular-nums text-faint">{w.year}</span>
            <p className="text-sm text-muted">{w.summary}</p>
            <ArrowUpRight
              className="h-4 w-4 self-center justify-self-end text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
