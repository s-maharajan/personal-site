import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { site } from "../content/site";
import { principles, toolbox, experience } from "../content/about";
import Contact from "../components/Contact";

export default function About() {
  return (
    <>
      <title>{`About · ${site.fullName || site.name}`}</title>
      <div className="pb-8 border-b border-line">
        <p className="label">Background & Philosophy</p>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-text sm:text-4xl">
          I work on the parts of systems that resist easy answers.
        </h1>

        <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-muted max-w-2xl font-sans">
          <p>
            Distributed state consistency, model behavior at p99, and the trade-offs nobody writes down.
            That's where I've spent the past decade.
          </p>
          <p>
            I've spent years on large-scale backend infrastructure: debugging anomalies buried deep in distributed call graphs,
            breaking up brittle monoliths without dropping traffic, and cutting cloud compute spend. More recently I've focused
            on production AI: model serving runtimes, hybrid retrieval architectures, and continuous evaluation harnesses.
          </p>
          <p>I work {site.location.toLowerCase()}.</p>

          <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs">
            <Link to="/resume" className="btn-primary">
              <FileText className="h-4 w-4" strokeWidth={1.75} />
              View Printable Resume
            </Link>
            <Link to="/writing" className="btn-ghost">
              Read Architecture Notes
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>

      {/* Career Timeline */}
      <section className="py-10 border-b border-line">
        <p className="label">Timeline</p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-text">
          Career Trajectory
        </h2>
        <div className="mt-6 divide-y divide-line">
          {experience.map((e) => (
            <div key={e.period} className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold text-accent w-24 shrink-0">{e.period}</span>
                <div>
                  <h3 className="font-serif text-base font-medium text-text">{e.title}</h3>
                  <p className="mt-0.5 text-xs text-muted font-sans">{e.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="py-10 border-b border-line">
        <p className="label">Engineering Principles</p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-text">
          How I Work
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {principles.map(([title, detail]) => (
            <div key={title} className="border-l-2 border-accent pl-4">
              <h3 className="font-serif text-base font-medium text-text">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted font-sans">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Toolbox */}
      <section className="py-10">
        <p className="label">Technical Arsenal</p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-text">
          What I Reach For
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line font-mono text-xs">
          {toolbox.map(([group, items]) => (
            <div key={group} className="grid gap-2 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4 items-baseline">
              <span className="font-semibold text-text">{group}</span>
              <span className="text-muted leading-relaxed font-sans">{items}</span>
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </>
  );
}
