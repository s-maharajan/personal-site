import { Link } from "react-router-dom";
import { site } from "../content/site";
import { articles } from "../content/writing";

const byDate = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Home() {
  return (
    <>
      <p>{site.blurb}</p>
      <p>
        <a href={`mailto:${site.email}`}>Email</a> · <a href={site.github}>GitHub</a>
      </p>
      <h2>Writing</h2>
      <ul className="posts">
        {byDate.map((a) => (
          <li key={a.slug}>
            <time>{a.date}</time>
            <Link to={`/writing/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
