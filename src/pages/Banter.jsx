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
      <div className="border-b border-line/70 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text">
          Byte-Sized Banter & Systems Truths
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted font-sans">
          Unvarnished observations from 10+ years in distributed systems, high-concurrency runtimes,
          and production AI infrastructure.
        </p>

        {/* Tag Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => {
            const isSelected = selectedTag === t;
            const count = t === "All" ? banterPosts.length : banterPosts.filter((b) => b.tag === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  isSelected
                    ? "bg-accent text-white font-medium"
                    : "border border-line bg-surface text-muted hover:border-text hover:text-text"
                }`}
              >
                {t} <span className="opacity-70 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banter Feed */}
      <div className="flex flex-col divide-y divide-line/60 rounded-xl border border-line bg-surface">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            id={post.slug}
            className="p-6 transition-colors hover:bg-raised/30 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-faint mb-2.5">
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

            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text mb-2.5">
              {post.title}
            </h2>

            <p className="text-sm leading-relaxed text-muted font-sans max-w-prose">
              {post.take}
            </p>
          </article>
        ))}
      </div>

      <Contact />
    </div>
  );
}
