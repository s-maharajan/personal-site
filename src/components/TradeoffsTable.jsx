export default function TradeoffsTable({ tradeoffs }) {
  if (!tradeoffs || tradeoffs.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tradeoffs.map((item, i) => (
        <div key={i} className="rounded border border-line bg-surface flex flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-faint">Alternative Considered</h4>
          </div>
          <p className="mt-1.5 font-serif text-base font-medium text-text">{item.alternative}</p>

          <div className="mt-3 flex-1 border-t border-line pt-3 font-sans">
            <div className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">Why Rejected</div>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.rejectedBecause}</p>

            <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-accent-secondary font-semibold">Accepted Trade-off</div>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.acceptedTradeoff}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
