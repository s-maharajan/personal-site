import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function NotFound() {
  return (
    <section className="py-16">
      <title>{`Page not found · ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <p className="font-mono text-6xl font-medium text-accent">404</p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-text sm:text-3xl">Page not found</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        This page doesn't exist, or it moved. The home page links to everything else.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Go to the home page
      </Link>
    </section>
  );
}
