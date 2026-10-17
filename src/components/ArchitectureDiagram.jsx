import { useState } from "react";
import { ArrowRight, Cpu, Database, Network, ShieldCheck, Zap } from "lucide-react";

export default function ArchitectureDiagram({ architecture, title }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!architecture || !architecture.steps) return null;
  const { steps } = architecture;

  const icons = [Network, Cpu, Database, Zap, ShieldCheck];

  return (
    <div className="card overflow-hidden p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <span className="label">Pipeline Architecture</span>
          <h3 className="mt-1 text-base font-medium text-text">{title || "System Topology & Execution Flow"}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-xs text-faint">Live Flow</span>
        </div>
      </div>

      {/* Pipeline Node Strip */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        {steps.map((step, idx) => {
          const Icon = icons[idx % icons.length];
          const isSelected = activeStep === idx;
          return (
            <div key={idx} className="flex flex-1 flex-col lg:flex-row lg:items-center">
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`group flex w-full flex-col rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-sm shadow-accent/10"
                    : "border-line bg-surface hover:border-faint hover:bg-raised"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded font-mono text-[11px] font-medium ${
                      isSelected ? "bg-accent text-bg" : "bg-raised text-faint group-hover:text-muted"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${isSelected ? "text-accent" : "text-faint group-hover:text-muted"}`}
                    strokeWidth={1.75}
                  />
                </div>
                <div className={`mt-3 text-xs font-semibold ${isSelected ? "text-text" : "text-muted"}`}>
                  {step.title}
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center py-1 lg:px-2 lg:py-0">
                  <ArrowRight
                    className="hidden h-4 w-4 text-line lg:block"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <div className="h-3 w-px bg-line lg:hidden" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Deep Dive */}
      <div className="mt-6 rounded-xl border border-line bg-raised/50 p-4">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs text-accent">Stage 0{activeStep + 1} · {steps[activeStep].title}</span>
          <span className="font-mono text-[11px] text-faint">Click node to inspect</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{steps[activeStep].detail}</p>
      </div>
    </div>
  );
}
