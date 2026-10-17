export default function TradeoffsTable({ tradeoffs }) {
  if (!tradeoffs || tradeoffs.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tradeoffs.map((item, i) => (
        <div key={i} className="card flex flex-col p-6">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">Alternative Considered</h4>
          </div>
          <p className="mt-2 text-base font-semibold text-text">{item.alternative}</p>

          <div className="mt-4 flex-1 border-t border-line/60 pt-4">
            <div className="text-xs font-medium text-rose-400/90">Why It Was Rejected</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.rejectedBecause}</p>

            <div className="mt-4 text-xs font-medium text-emerald-400/90">Accepted Trade-off</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.acceptedTradeoff}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
