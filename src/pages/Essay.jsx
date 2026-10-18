import { Link, useParams } from "react-router-dom";
import { findArticle } from "../content/writing";

// Renders the small markdown subset the essays use: paragraphs and **bold**.
function Paragraphs({ text }) {
  return text.split(/\n\s*\n/).map((para, i) => (
    <p key={i}>
      {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part
      )}
    </p>
  ));
}

export default function Essay() {
  const article = findArticle(useParams().slug);
  if (!article) return <p>Essay not found. <Link to="/">Go home</Link>.</p>;

  return (
    <article>
      <h1>{article.title}</h1>
      <time>{article.date}</time>
      {article.content.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <Paragraphs text={section.body} />
        </section>
      ))}
    </article>
  );
}
