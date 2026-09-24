import { site } from "../content/site";
import { principles, toolbox } from "../content/about";
import Section from "../components/Section";
import Contact from "../components/Contact";

export default function About() {
  return (
    <>
      <title>{`About · ${site.name}`}</title>
      <p className="label">About</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
        I work on the parts of systems that resist obvious answers.
      </h1>

      <div className="mt-8 flex max-w-prose flex-col gap-5 text-lg leading-relaxed text-muted">
        <p>
          Distributed state, model behaviour at p99, and the trade-offs nobody wants to write down.
          That's where I've spent most of my career.
        </p>
        <p>
          I've spent years on large-scale backends, debugging issues buried a thousand stack frames
          deep and rewriting the parts everyone said were fine. More recently I've focused on AI in
          production: serving models, evaluating them, and knowing when to trust them.
        </p>
        <p>I work {site.location.toLowerCase()}.</p>
      </div>

      <Section label="Principles" title="How I work">
        <dl className="grid gap-4 sm:grid-cols-2">
          {principles.map(([title, detail]) => (
            <div key={title} className="card p-6">
              <dt className="font-medium text-text">{title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Toolbox" title="What I reach for">
        <dl className="card divide-y divide-line">
          {toolbox.map(([group, items]) => (
            <div key={group} className="grid gap-2 px-6 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="font-mono text-sm text-faint">{group}</dt>
              <dd className="flex flex-wrap gap-2">
                {items.split(", ").map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Contact />
    </>
  );
}
