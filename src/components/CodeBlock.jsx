import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({ title, language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded border border-line overflow-hidden bg-surface">
      <div className="flex items-center justify-between border-b border-line bg-raised/50 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-xs text-text">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded border border-line bg-surface px-2 py-0.5 text-xs font-mono text-muted transition hover:border-text hover:text-text"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent" />
                <span className="text-accent">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-text selection:bg-accent/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}
