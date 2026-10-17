import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { site } from "../content/site";
import { principles, toolbox, experience } from "../content/about";
import Contact from "../components/Contact";

export default function About() {
  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      <title>{`Philosophy & About · ${site.fullName || site.name}`}</title>

      <div className="border-b border-line pb-6">
        <span className="label-mono">Background & Scope</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Architectural Philosophy
        </h1>

        <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-muted max-w-2xl font-sans">
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

          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link to="/resume" className="btn-primary">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>View Dossier (Resume)</span>
            </Link>
            <Link to="/writing" className="btn-ghost">
              <span>Read Field Notes</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>

      {/* Principles */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line pb-2">
          <span className="label-mono">Methodology</span>
          <h2 className="mt-1 text-xl font-bold text-text">
            Core Principles
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map(([title, detail], idx) => (
            <div key={title} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">0{idx + 1}.</span>
                <h3 className="text-sm font-semibold text-text">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted font-sans">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career Timeline */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line pb-2">
          <span className="label-mono">Trajectory</span>
          <h2 className="mt-1 text-xl font-bold text-text">
            Career Timeline
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {experience.map((e) => (
            <div key={e.period} className="rounded-xl border border-line bg-surface p-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <span className="font-mono text-xs font-bold text-accent w-24 shrink-0">{e.period}</span>
                <div>
                  <h3 className="text-sm font-semibold text-text">{e.title}</h3>
                  <p className="mt-0.5 text-xs text-muted font-sans">{e.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toolbox */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line pb-2">
          <span className="label-mono">Arsenal</span>
          <h2 className="mt-1 text-xl font-bold text-text">
            Technical Stack
          </h2>
        </div>

        <div className="rounded-xl border border-line bg-surface divide-y divide-line font-mono text-xs">
          {toolbox.map(([group, items]) => (
            <div key={group} className="grid gap-1.5 p-4 sm:grid-cols-[12rem_1fr] sm:gap-4 items-baseline">
              <span className="font-semibold text-text">{group}</span>
              <span className="text-muted leading-relaxed font-sans">{items}</span>
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </div>
  );
}
