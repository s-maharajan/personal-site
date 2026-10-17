import { Link } from "react-router-dom";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { site } from "../content/site";
import { principles, toolbox, experience } from "../content/about";
import Contact from "../components/Contact";

export default function About() {
  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      <title>{`About & Philosophy · ${site.fullName || site.name}`}</title>

      <div className="border-b border-line/70 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text">
          About & Philosophy
        </h1>

        <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-muted max-w-prose font-sans">
          <p>
            Distributed state consistency, model behavior at p99, and the engineering trade-offs nobody writes down.
            That's where I've spent the past decade.
          </p>
          <p>
            I've spent years on large-scale backend infrastructure: debugging anomalies buried deep in distributed call graphs,
            breaking up brittle monoliths without dropping traffic, and cutting cloud compute spend. More recently I've focused
            on production AI: low-latency inference runtimes, hybrid retrieval architectures, and continuous evaluation harnesses.
          </p>
          <p>I work {site.location.toLowerCase()}.</p>

          <div className="pt-2 flex flex-wrap gap-2.5 text-sm font-sans">
            <Link to="/resume" className="btn-primary">
              <FileText className="h-3.5 w-3.5" />
              <span>View Resume</span>
            </Link>
            <Link to="/writing" className="btn-ghost">
              <span>Read Writing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Advisory & Consulting Section */}
      <section className="rounded-xl border border-line/80 bg-raised/50 p-6 sm:p-7 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
              {site.advisory.title}
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {site.advisory.description}
            </p>
            <p className="mt-2.5 font-mono text-xs text-accent font-medium">
              ● {site.advisory.availability}
            </p>
          </div>

          <a
            href={`mailto:${site.email}?subject=Architecture Review / Advisory Inquiry`}
            className="btn-primary shrink-0 self-start sm:self-auto"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Directly</span>
          </a>
        </div>
      </section>

      {/* Core Principles */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line/70 pb-2">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Core Principles
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map(([title, detail], idx) => (
            <div key={title} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">0{idx + 1}.</span>
                <h3 className="text-base font-serif text-text">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted font-sans">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career Trajectory */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line/70 pb-2">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Career Trajectory
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {experience.map((e) => (
            <div key={e.period} className="py-4 first:pt-1 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <span className="font-mono text-xs font-medium text-accent w-24 shrink-0">{e.period}</span>
              <div>
                <h3 className="text-sm font-medium text-text">{e.title}</h3>
                <p className="mt-0.5 text-xs text-muted font-sans">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Arsenal */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-line/70 pb-2">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
            Technical Stack
          </h2>
        </div>

        <div className="rounded-xl border border-line bg-surface divide-y divide-line/60 font-mono text-xs">
          {toolbox.map(([group, items]) => (
            <div key={group} className="grid gap-1.5 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 items-baseline">
              <span className="font-medium text-text">{group}</span>
              <span className="text-muted leading-relaxed font-sans">{items}</span>
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </div>
  );
}
