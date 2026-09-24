import { Link } from "react-router-dom";
import { site } from "../content/site";

export default function NotFound() {
  return (
    <>
      <title>{`Page not found · ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <p className="label">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text">Page not found</h1>
      <p className="mt-4 text-lg text-muted">
        This page doesn't exist, or it moved. The home page links to everything else.
      </p>
      <Link to="/" className="link mt-6 inline-block text-text">
        Go to the home page
      </Link>
    </>
  );
}
