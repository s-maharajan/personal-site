import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { site } from "../content/site";
import { work } from "../content/work";
import { experience, writing } from "../content/about";
import Section from "../components/Section";
import WorkGrid from "../components/WorkGrid";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <title>{`${site.name} · ${site.role}`}</title>

      <section className="grid items-end gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {site.role}
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-6xl">
            Hi, I'm {site.name}.
            <span className="block text-muted">{site.tagline}</span>
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">{site.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/work" className="btn-primary">
              See my work
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
            <a href="#contact" className="btn-ghost">Get in touch</a>
          </div>
        </div>

        <aside className="card p-6">
          <p className="label">Now</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted">
            {site.now.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <Section
        label="Selected work"
        title="Problems that didn't give way to the obvious fix"
        action={
          <Link to="/work" className="link text-sm text-muted">
            All {work.length} case studies
          </Link>
        }
      >
        <WorkGrid items={work.slice(0, 4)} />
      </Section>

      <Section label="Experience" title="Ten years of backends, the last few in AI">
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

      <Section label="Writing" title="Notes in progress">
        <ul className="card divide-y divide-line">
          {writing.map((post) => (
            <li key={post.title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-5">
              {post.href ? (
                <a href={post.href} className="link font-medium text-text">{post.title}</a>
              ) : (
                <span className="font-medium text-text">{post.title}</span>
              )}
              <span className="font-mono text-xs text-faint">
                {post.topic} · {post.href ? "Read" : "Drafting"}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Contact />
    </>
  );
}
