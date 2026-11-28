import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function SectionCard({ section, index }) {
  return (
    <Link
      to={`/learning/${section.slug}`}
      className="group card-hover flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-5"
    >
      <div className="flex items-center justify-between font-mono text-xs text-faint">
        <span>{String(index + 1).padStart(2, "0")} · {section.kicker}</span>
        <ArrowUpRight className="h-4 w-4 transition duration-200 group-hover:text-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-xl text-text group-hover:text-accent transition-colors">{section.title}</h3>
      <p className="text-sm leading-relaxed text-muted">{section.description}</p>
      <p className="mt-auto pt-2 font-mono text-xs text-faint">
        {section.entries.length} notes · {section.readTime}
      </p>
    </Link>
  );
}
