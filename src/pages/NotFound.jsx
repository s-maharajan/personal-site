import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function NotFound() {
  return (
    <section className="py-20 text-center flex flex-col items-center">
      <title>{`Page not found · ${site.fullName || site.name}`}</title>
      <meta name="robots" content="noindex" />
      <p className="font-mono text-5xl sm:text-6xl font-normal text-accent">404</p>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-normal text-text">Page Not Found</h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-muted font-sans leading-relaxed">
        This page doesn't exist or has moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 font-sans text-xs">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <Link to="/about" className="btn-ghost">
          About
        </Link>
      </div>
    </section>
  );
}
