export default function Section({ label, title, action, children }) {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">{label}</p>
          {title && (
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl">{title}</h2>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
