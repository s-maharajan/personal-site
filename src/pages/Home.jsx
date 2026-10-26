import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { site } from "../content/site";
import { sortedArticles } from "../content/writing";
import { GithubIcon } from "../components/Icons";

const topics = ["All", ...new Set(sortedArticles.map((a) => a.topic))];

export default function Home() {
  const [topic, setTopic] = useState("All");
  const posts = topic === "All" ? sortedArticles : sortedArticles.filter((a) => a.topic === topic);

  return (
    <div className="flex flex-col gap-12 sm:gap-14 pt-2">
      <title>{`${site.fullName || site.name} · ${site.role}`}</title>

      {/* A short, personal opener */}
      <section className="max-w-prose">
        <p className="font-serif text-xl sm:text-2xl leading-snug text-text">
          {site.tagline}
        </p>
        <p className="mt-2 text-sm text-muted leading-relaxed font-sans">
          {site.role} · {site.location}. Notes below, newest first.
        </p>
      </section>

      {/* Posts */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-line/70 pb-3 gap-3">
          <h2 className="font-serif text-2xl font-normal text-text">Writing</h2>

          {topics.length > 2 && (
            <nav className="flex flex-wrap items-center gap-4 font-mono text-xs" aria-label="Filter by topic">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`transition-colors py-0.5 ${
                    topic === t
                      ? "text-accent font-semibold border-b border-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex flex-col divide-y divide-line/50">
          {posts.map((a) => (
            <Link
              key={a.slug}
              to={`/writing/${a.slug}`}
              className="group py-6 first:pt-2 transition-colors block cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-xs text-faint mb-1.5">
                <span className="text-accent">#{a.topic.toLowerCase()}</span>
                <span>{a.date} · {a.readTime}</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-text group-hover:text-accent transition-colors leading-snug">
                {a.title}
              </h3>

              <p className="mt-1.5 text-sm text-muted leading-relaxed font-sans line-clamp-2 max-w-prose">
                {a.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Say hi */}
      <section className="border-t border-line/70 pt-8 pb-4 font-sans">
        <div className="flex items-center gap-4 text-xs font-mono text-muted">
          <a href={`mailto:${site.email}`} className="text-accent hover:underline font-medium inline-flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{site.email}</span>
          </a>
          {site.links.github && (
            <>
              <span>·</span>
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors inline-flex items-center gap-1"
              >
                <GithubIcon className="h-3 w-3" />
                <span>GitHub</span>
              </a>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
