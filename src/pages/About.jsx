import { site } from "../content/site";
import { principles, toolbox } from "../content/about";
import Section from "../components/Section";
import SocialLinks from "../components/SocialLinks";

export default function About() {
  return (
    <>
      <title>{`About · ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight text-text">About</h1>

      <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-muted">
        <p>
          I'm drawn to the parts of systems that resist obvious answers: distributed state,
          model behaviour at p99, and the trade-offs nobody wants to write down.
        </p>
        <p>
          I've spent years on large-scale backends, debugging issues buried a thousand stack
          frames deep and rewriting the parts everyone said were fine. More recently I've
          focused on AI in production: serving models, evaluating them, and knowing when to
          trust them.
        </p>
        <p>
          I work {site.location.toLowerCase()}. I'm happy to talk about distributed systems,
          AI infrastructure, performance investigations, or architecture reviews.
        </p>
      </div>
      <SocialLinks className="mt-6 text-sm text-text" />

      <Section label="How I work">
        <dl className="grid gap-6 sm:grid-cols-2">
          {principles.map(([title, detail]) => (
            <div key={title}>
              <dt className="font-medium text-text">{title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Toolbox">
        <dl className="flex flex-col gap-4">
          {toolbox.map(([group, items]) => (
            <div key={group} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt className="font-mono text-sm text-faint">{group}</dt>
              <dd className="text-muted">{items}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
