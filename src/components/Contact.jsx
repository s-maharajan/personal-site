import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "../content/site";

export default function Contact() {
  const { email, links } = site;
  const external = [
    links.github && { label: "GitHub", href: links.github },
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
    links.resume && { label: "Résumé", href: links.resume },
  ].filter(Boolean);

  return (
    <section id="contact" className="card relative mt-24 scroll-mt-8 overflow-hidden p-8 sm:mt-32 sm:p-12">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      <p className="label">Contact</p>
      <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-text sm:text-4xl">
        Got a hard problem? Let's talk.
      </h2>
      <p className="mt-4 max-w-prose leading-relaxed text-muted">
        I'm most useful on distributed systems, AI infrastructure, performance investigations, and
        architecture reviews where the easy answers have already been tried.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {email && (
          <a href={`mailto:${email}`} className="btn-primary">
            <Mail className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {email}
          </a>
        )}
        {external.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={!email && i === 0 ? "btn-primary" : "btn-ghost"}
          >
            {l.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
