import { ArrowUpRight, Mail, Copy, Check, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function Contact() {
  const { email, links } = site;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const external = [
    links.github && { label: "GitHub", href: links.github },
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
  ].filter(Boolean);

  return (
    <section id="contact" className="card relative mt-24 scroll-mt-8 overflow-hidden p-8 sm:mt-32 sm:p-12 print:hidden">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      <p className="label">Contact & Advisory</p>
      <h2 className="mt-2 max-w-xl text-xl font-semibold tracking-tight text-text sm:text-2xl">
        Got a hard problem? Let's talk.
      </h2>
      <p className="mt-4 max-w-prose leading-relaxed text-muted">
        I'm most useful on distributed systems, AI inference infrastructure, p99 tail latency investigations, and
        architecture reviews where the easy answers have already been exhausted.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {email && (
          <div className="inline-flex rounded-full border border-line bg-surface p-1">
            <a href={`mailto:${email}`} className="btn-primary !py-1.5">
              <Mail className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {email}
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted transition hover:text-text"
              title="Copy email address"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}

        <Link to="/resume" className="btn-ghost">
          <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          View Resume
        </Link>

        {external.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            {l.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
