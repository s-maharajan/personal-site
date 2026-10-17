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
    <section id="contact" className="rounded-2xl border border-line bg-surface p-6 sm:p-8 print-hidden font-sans">
      <div className="flex flex-col gap-2">
        <span className="label-mono">Connect & Advisory</span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
          Have an architecture challenge? Let's talk.
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          I'm most useful on distributed systems, AI inference platforms, p99 tail latency investigations, and
          architecture reviews where obvious solutions have already been exhausted.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {email && (
          <div className="flex items-center gap-1">
            <a href={`mailto:${email}`} className="btn-primary">
              <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{email}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-ghost"
              title="Copy email address"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5 text-faint" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}

        <Link to="/resume" className="btn-ghost">
          <FileText className="h-3.5 w-3.5 text-faint" strokeWidth={1.75} aria-hidden="true" />
          <span>Dossier</span>
        </Link>

        {external.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <span>{l.label}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-faint" strokeWidth={2} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
