import { site } from "../content/site";
import { work } from "../content/work";
import WorkGrid from "../components/WorkGrid";
import Contact from "../components/Contact";

export default function Work() {
  return (
    <>
      <title>{`Work · ${site.name}`}</title>
      <p className="label">Work</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Case studies
      </h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
        Problems that didn't give way to the obvious fix. Each one covers the problem, what I did,
        and what changed.
      </p>
      <div className="mt-12">
        <WorkGrid items={work} featureFirst={work.length % 2 === 1} />
      </div>
      <Contact />
    </>
  );
}
