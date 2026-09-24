import { site } from "../content/site";
import { work } from "../content/work";
import WorkList from "../components/WorkList";

export default function Work() {
  return (
    <>
      <title>{`Work · ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight text-text">Work</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Problems that didn't give way to the obvious fix. Each one covers the problem, what I
        did, and what changed.
      </p>
      <div className="mt-10">
        <WorkList items={work} />
      </div>
    </>
  );
}
