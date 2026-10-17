import { Printer, Mail, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { resumeData } from "../content/resume";
import { GithubIcon, LinkedinIcon } from "../components/Icons";

export default function Resume() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(resumeData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl font-sans">
      <title>{`Resume · ${resumeData.name}`}</title>

      {/* Screen-only top action bar */}
      <div className="print-hidden mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Back to site
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1 text-xs font-mono text-text transition hover:border-text"
          >
            {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3 text-faint" />}
            <span>{copied ? "Copied Email" : "Copy Email"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded bg-text px-3 py-1 text-xs font-mono text-bg transition hover:bg-accent hover:text-white"
          >
            <Printer className="h-3 w-3" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Document Wrapper */}
      <div className="border border-line rounded bg-surface print:border-none print:bg-white print:text-black print:p-0 p-8 sm:p-12">
        {/* Header */}
        <header className="border-b border-line print:border-neutral-300 pb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-text print:text-black sm:text-4xl">
                {resumeData.name}
              </h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent print:text-neutral-800 font-semibold">
                {resumeData.title}
              </p>
              <p className="mt-0.5 text-xs text-muted print:text-neutral-600">
                {resumeData.location}
              </p>
            </div>

            <div className="flex flex-col gap-1 font-mono text-xs text-muted print:text-neutral-700 sm:text-right">
              <a
                href={`mailto:${resumeData.email}`}
                className="inline-flex items-center gap-1.5 hover:text-accent print:text-black"
              >
                <Mail className="h-3 w-3 print-hidden" />
                <span>{resumeData.email}</span>
              </a>
              <a
                href={resumeData.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent print:text-black"
              >
                <GithubIcon className="h-3 w-3 print-hidden" />
                <span>github.com/s-maharajan</span>
              </a>
              <a
                href={resumeData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent print:text-black"
              >
                <LinkedinIcon className="h-3 w-3 print-hidden" />
                <span>linkedin.com/in/s-maharajan</span>
              </a>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted print:text-neutral-700">
            {resumeData.summary}
          </p>
        </header>

        {/* Core Competencies */}
        <section className="mt-8 border-b border-line print:border-neutral-300 pb-8 font-mono">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent print:text-black">
            Core Competencies & Technical Arsenal
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {resumeData.skills.map((s) => (
              <div key={s.category}>
                <div className="text-xs font-semibold text-text print:text-black">
                  {s.category}
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-line bg-raised print:border-neutral-300 print:bg-neutral-100 px-2 py-0.5 text-[11px] text-muted print:text-neutral-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-8 border-b border-line print:border-neutral-300 pb-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent print:text-black">
            Professional Experience
          </h2>

          <div className="mt-6 flex flex-col gap-8">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg font-medium text-text print:text-black">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs text-faint print:text-neutral-600">
                    {exp.period}
                  </span>
                </div>
                <p className="font-mono text-xs text-accent print:text-neutral-700 font-semibold">
                  {exp.company}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex gap-2 text-xs leading-relaxed text-muted print:text-neutral-700">
                      <span className="text-accent print:text-black font-mono shrink-0" aria-hidden="true">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mt-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent print:text-black">
            Education
          </h2>
          <div className="mt-3">
            <h3 className="font-serif text-base font-medium text-text print:text-black">
              {resumeData.education.degree}
            </h3>
            <p className="mt-0.5 text-xs text-muted print:text-neutral-600">
              {resumeData.education.detail}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
