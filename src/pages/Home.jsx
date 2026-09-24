import { Link } from "react-router-dom";
import { site } from "../content/site";
import { work } from "../content/work";
import { experience, writing } from "../content/about";
import Section from "../components/Section";
import WorkList from "../components/WorkList";
import SocialLinks from "../components/SocialLinks";

export default function Home() {
  return (
    <>
      <title>{`${site.name} · ${site.role}`}</title>

      <section>
        <p className="label">{site.role}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          {site.tagline}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{site.intro}</p>
        <SocialLinks className="mt-6 text-sm text-text" />
      </section>

      <Section label="Now">
        <ul className="flex flex-col gap-2 text-muted">
          {site.now.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        label="Selected work"
        action={
          <Link to="/work" className="link text-sm text-muted">
            All case studies
          </Link>
        }
      >
        <WorkList items={work.slice(0, 3)} />
      </Section>

      <Section label="Experience">
        <ol className="flex flex-col gap-5">
          {experience.map((e) => (
            <li key={e.period} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <span className="font-mono text-sm tabular-nums text-faint">{e.period}</span>
              <div>
                <h3 className="font-medium text-text">{e.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{e.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Writing">
        <ul className="flex flex-col divide-y divide-line border-y border-line">
          {writing.map((post) => (
            <li key={post.title} className="flex items-baseline justify-between gap-4 py-3">
              {post.href ? (
                <a href={post.href} className="link text-text">{post.title}</a>
              ) : (
                <span className="text-text">{post.title}</span>
              )}
              <span className="shrink-0 font-mono text-xs text-faint">
                {post.href ? post.topic : "Drafting"}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
