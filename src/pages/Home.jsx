import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { site } from "../content/site";
import { work } from "../content/work";
import { experience, writing } from "../content/about";
import Section from "../components/Section";
import WorkGrid from "../components/WorkGrid";
import Contact from "../components/Contact";
import LatencyCard from "../components/LatencyCard";
import LLMSimulator from "../components/LLMSimulator";

export default function Home() {
  const { onOpenPalette } = useOutletContext() || {};
  return (
    <>
      <title>{`${site.name} · ${site.role}`}</title>

      {/* Hero Section */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {site.role}
            </p>
            {onOpenPalette && (
              <button
                type="button"
                onClick={onOpenPalette}
                className="hidden items-center gap-1.5 rounded-full border border-line/80 bg-raised/70 px-2.5 py-1 text-xs text-faint transition hover:border-faint hover:text-muted sm:inline-flex"
                title="Search everything"
              >
                <kbd className="font-mono text-[10px]">⌘K</kbd> Quick Search
              </button>
            )}
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Hi, I'm {site.name}.
          </h1>
          <p className="mt-3 max-w-prose text-xl leading-snug text-muted sm:text-2xl">{site.tagline}</p>
          <p className="mt-5 max-w-prose leading-relaxed text-muted">{site.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/work" className="btn-primary">
              See case studies
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/resume" className="btn-ghost">
              <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Resume
            </Link>
            <a href="#contact" className="btn-ghost">Get in touch</a>
          </div>
        </div>
        <LatencyCard />
      </section>

      {/* Now Section */}
      <section className="mt-16" aria-labelledby="now">
        <p id="now" className="label">Focus Areas (Now)</p>
        <ul className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {site.now.map((item) => (
            <li key={item} className="flex gap-3 bg-bg p-5 text-sm leading-relaxed text-muted">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Selected Case Studies */}
      <Section
        label="Selected work"
        title="Problems that didn't give way to the obvious fix"
        action={
          <Link to="/work" className="link text-sm text-muted">
            All {work.length} case studies →
          </Link>
        }
      >
        <WorkGrid items={work.slice(0, 4)} />
      </Section>

      {/* Interactive Systems Lab */}
      <section className="mt-20 sm:mt-28">
        <div className="mb-8">
          <p className="label">Interactive Simulation</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-text sm:text-2xl">
            Explore P99 Tail Latency Dynamics
          </h2>
        </div>
        <LLMSimulator />
      </section>

      {/* Experience Timeline */}
      <Section
        label="Experience"
        title="A decade of distributed backends and production AI systems"
        action={
          <Link to="/resume" className="link text-sm text-muted">
            View full resume →
          </Link>
        }
      >
        <ol className="relative ml-1.5 flex flex-col gap-10 border-l border-line pl-8">
          {experience.map((e, i) => (
            <li key={e.period} className="relative">
              <span
                className={`absolute -left-[2.3rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg ${
                  i === 0 ? "bg-accent" : "bg-faint"
                }`}
                aria-hidden="true"
              />
              <p className="font-mono text-sm tabular-nums text-faint">{e.period}</p>
              <h3 className="mt-1 text-lg font-medium text-text">{e.title}</h3>
              <p className="mt-1 max-w-prose text-muted">{e.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Writing Section */}
      <Section
        label="Writing & Notes"
        title="Architecture breakdowns and failure post-mortems"
        action={
          <Link to="/writing" className="link text-sm text-muted">
            All 4 technical write-ups →
          </Link>
        }
      >
        <ul className="card divide-y divide-line">
          {writing.map((post) => (
            <li key={post.title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-5">
              <Link to={post.href} className="link font-medium text-text group-hover:text-accent">
                {post.title}
              </Link>
              <span className="font-mono text-xs text-faint">
                {post.topic} · {post.readTime} · {post.date}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Contact />
    </>
  );
}
