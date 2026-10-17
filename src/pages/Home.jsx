import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Copy, Check, Mail } from "lucide-react";
import { site } from "../content/site";
import { articles } from "../content/writing";
import { work } from "../content/work";
import { banterPosts } from "../content/banter";
import { GithubIcon, LinkedinIcon } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      <title>{`${site.fullName || site.name} · ${site.role}`}</title>

      {/* Hero Intro */}
      <section className="flex flex-col gap-5 pt-2">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-normal tracking-tight text-text leading-[1.2]">
          Architecting distributed platforms & AI infrastructure that hold up at p99.
        </h1>

        {/* Links row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm font-sans">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover font-medium underline underline-offset-4 decoration-accent/40 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{site.email}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-text transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent" />
                <span className="text-accent font-medium">Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <span className="text-line hidden sm:inline">|</span>

          {site.links.github && (
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-text transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3 text-faint" />
            </a>
          )}

          {site.links.linkedin && (
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-text transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
              <ArrowUpRight className="h-3 w-3 text-faint" />
            </a>
          )}

          <Link
            to="/resume"
            className="inline-flex items-center gap-1 text-muted hover:text-text transition-colors"
          >
            <span>Resume</span>
            <ArrowUpRight className="h-3 w-3 text-faint" />
          </Link>
        </div>
      </section>

      {/* Selected Writing */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line/70 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Writing & Field Notes
          </h2>
          <Link
            to="/writing"
            className="text-xs font-mono text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
          >
            <span>All {articles.length} essays</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {articles.slice(0, 5).map((article) => (
            <Link
              key={article.slug}
              to={`/writing/${article.slug}`}
              className="group py-4 sm:py-5 first:pt-1 transition-colors block"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <h3 className="font-serif text-lg sm:text-xl text-text group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="font-mono text-xs text-faint shrink-0 sm:text-right">
                  {article.date} · {article.readTime}
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed font-sans line-clamp-2 max-w-prose">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Selected Systems & Production Work */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line/70 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Selected Work & Architecture
          </h2>
          <Link
            to="/work"
            className="text-xs font-mono text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
          >
            <span>All dossiers</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {work.map((w) => (
            <Link
              key={w.slug}
              to={`/work/${w.slug}`}
              className="group py-4 sm:py-5 first:pt-1 transition-colors block"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="font-serif text-lg sm:text-xl text-text group-hover:text-accent transition-colors">
                  {w.title}
                </h3>
                <span className="font-mono text-xs font-medium text-accent shrink-0">
                  {w.metric.label}: {w.metric.value}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-muted leading-relaxed font-sans max-w-prose">
                {w.summary}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-faint">
                <span className="text-accent">{w.category}</span>
                <span>·</span>
                <span>{w.stack.slice(0, 4).join(", ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Observations / Short Takes */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line/70 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Notes & Observations
          </h2>
          <span className="font-mono text-xs text-faint">Field Takeaways</span>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {banterPosts.slice(0, 3).map((post) => (
            <article key={post.slug} className="py-4 first:pt-1">
              <div className="flex items-center gap-2 font-mono text-xs text-faint mb-1">
                <span className="text-accent font-medium">#{post.tag.toLowerCase()}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-sans font-medium text-base text-text mb-1">
                {post.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed font-sans max-w-prose">
                {post.take}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact & Advisory Note */}
      <section className="rounded-xl border border-line/80 bg-raised/50 p-6 sm:p-8 font-sans">
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
          Architecture Reviews & Inquiries
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-prose">
          I partner with engineering teams and technical founders on critical architectural challenges:
          debugging p99 tail latency spikes, designing resilient model serving infrastructure, and establishing continuous evaluation harnesses.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <a
            href={`mailto:${site.email}?subject=Architecture Review / Inquiry`}
            className="btn-primary"
          >
            Get in touch
          </a>
          <span className="font-mono text-xs text-faint">
            Direct response within 24h
          </span>
        </div>
      </section>
    </div>
  );
}
