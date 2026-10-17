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
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
    links.github && { label: "GitHub", href: links.github },
  ].filter(Boolean);

  return (
    <section id="contact" className="mt-16 border-t-2 border-line pt-10 print-hidden font-sans">
      <p className="label">Advisory & Contact</p>
      <h2 className="mt-1 font-serif text-2xl font-medium text-text">
        Got a hard problem? Let's talk.
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        I'm most useful on distributed systems, AI inference platforms, p99 tail latency investigations, and
        architecture reviews where the easy answers have already been exhausted.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {email && (
          <div className="inline-flex rounded border border-line bg-surface p-0.5">
            <a href={`mailto:${email}`} className="btn-primary !py-1 !px-3 font-mono text-xs">
              <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {email}
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="ml-1 inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-mono text-muted transition hover:text-text hover:bg-raised"
              title="Copy email address"
            >
              {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3 text-faint" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}

        <Link to="/resume" className="btn-ghost font-mono text-xs !py-1 !px-3">
          <FileText className="h-3.5 w-3.5 text-faint" strokeWidth={1.75} aria-hidden="true" />
          View Resume
        </Link>

        {external.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost font-mono text-xs !py-1 !px-3"
          >
            {l.label}
            <ArrowUpRight className="h-3 w-3 text-faint" strokeWidth={2} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
