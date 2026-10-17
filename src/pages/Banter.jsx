import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { site } from "../content/site";
import { banterPosts } from "../content/banter";
import Contact from "../components/Contact";

export default function Banter() {
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = ["All", ...new Set(banterPosts.map((b) => b.tag))];

  const filteredPosts = selectedTag === "All"
    ? banterPosts
    : banterPosts.filter((b) => b.tag === selectedTag);

  const handleCopy = async (take, slug) => {
    await navigator.clipboard.writeText(`"${take}" — Som Maharajan (${site.email})`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <title>{`Byte-Sized Banter & Systems Truths · ${site.fullName || site.name}`}</title>

      {/* Header */}
      <div className="border-b border-line pb-6">
        <span className="label-mono">Field Notes & Sharp Takes</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Byte-Sized Banter
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted font-sans">
          Unvarnished observations from 10+ years in distributed systems, high-concurrency runtimes,
          and production AI infrastructure.
        </p>

        {/* Tag Filters */}
        <div className="mt-6 flex flex-wrap gap-1.5 font-mono text-xs">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTag(t)}
              className={`rounded-lg px-3 py-1.5 transition ${
                selectedTag === t
                  ? "bg-text text-bg font-semibold"
                  : "bg-surface border border-line text-muted hover:border-text hover:text-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Banter Feed */}
      <div className="flex flex-col divide-y divide-line/60 rounded-2xl border border-line bg-surface">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="p-6 transition-colors hover:bg-raised/30">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-faint mb-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-raised px-2 py-0.5 text-accent font-semibold">
                  #{post.tag.toLowerCase()}
                </span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(post.take, post.slug)}
                className="inline-flex items-center gap-1 text-[11px] text-faint hover:text-text transition"
                title="Copy take to clipboard"
              >
                {copiedSlug === post.slug ? (
                  <>
                    <Check className="h-3 w-3 text-accent" />
                    <span className="text-accent font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-lg font-bold text-text mb-2.5">
              {post.title}
            </h2>

            <p className="text-sm leading-relaxed text-muted font-sans">
              {post.take}
            </p>
          </article>
        ))}
      </div>

      <Contact />
    </div>
  );
}
