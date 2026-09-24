import { site } from "../content/site";

// Only links filled in under site.js are shown.
function socialLinks() {
  const { email, links } = site;
  return [
    email && { label: "Email", href: `mailto:${email}` },
    links.github && { label: "GitHub", href: links.github },
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
    links.resume && { label: "Résumé", href: links.resume },
  ].filter(Boolean);
}

export default function SocialLinks({ className = "" }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {socialLinks().map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            className="link"
            {...(l.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
