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
    <section id="contact" className="rounded-xl border border-line/80 bg-raised/40 p-6 sm:p-8 print-hidden font-sans">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-text">
          Have an architecture challenge? Let's connect.
        </h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">
          I'm most useful on distributed systems, AI inference platforms, p99 tail latency investigations, and
          architecture reviews where obvious solutions have already been exhausted.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {email && (
          <div className="flex items-center gap-1.5">
            <a href={`mailto:${email}`} className="btn-primary">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{email}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-ghost"
              title="Copy email address"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}

        <Link to="/resume" className="btn-ghost">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Resume</span>
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
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
