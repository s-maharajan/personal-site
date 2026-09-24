export default function Section({ label, action, children }) {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="label">{label}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
