import { Link } from "react-router-dom";
import { isoMonth } from "../content/writing";

export default function PostList({ posts, numbered = false }) {
  return (
    <ol className="flex flex-col divide-y divide-line border-y border-line">
      {posts.map((a, i) => (
        <li key={a.slug}>
          <Link
            to={`/writing/${a.slug}`}
            className={`group grid gap-x-6 gap-y-1 py-6 ${numbered ? "sm:grid-cols-[3rem_1fr]" : ""}`}
          >
            {numbered && (
              <span className="font-mono text-sm text-faint" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            )}
            <div>
              <p className="font-mono text-xs text-faint">
                <time dateTime={isoMonth(a.date)}>{a.date}</time> · {a.readTime}
              </p>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl/8 leading-snug text-text group-hover:text-accent transition-colors">
                {a.title}
              </h3>
              <p className="mt-1.5 max-w-reading text-sm leading-relaxed text-muted line-clamp-2">{a.summary}</p>
              <p className="mt-2 font-mono text-xs text-accent">#{a.topic.toLowerCase().replace(/\s+/g, "-")}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
