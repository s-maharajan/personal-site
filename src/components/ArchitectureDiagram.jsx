import { useState } from "react";
import { ArrowRight, Cpu, Database, Network, ShieldCheck, Zap } from "lucide-react";

export default function ArchitectureDiagram({ architecture, title }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!architecture || !architecture.steps) return null;
  const { steps } = architecture;

  const icons = [Network, Cpu, Database, Zap, ShieldCheck];

  return (
    <div className="rounded border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
        <div>
          <span className="label">Pipeline Topology</span>
          <h3 className="mt-0.5 font-serif text-lg font-medium text-text">{title || "System Topology & Execution Flow"}</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>Click node to inspect</span>
        </div>
      </div>

      {/* Pipeline Node Strip */}
      <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-center">
        {steps.map((step, idx) => {
          const Icon = icons[idx % icons.length];
          const isSelected = activeStep === idx;
          return (
            <div key={idx} className="flex flex-1 flex-col lg:flex-row lg:items-center">
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`group flex w-full flex-col rounded border p-3 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-line bg-surface hover:border-text hover:bg-raised"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded font-mono text-[10px] font-semibold ${
                      isSelected ? "bg-accent text-white" : "bg-raised text-faint group-hover:text-text"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <Icon
                    className={`h-3.5 w-3.5 ${isSelected ? "text-accent" : "text-faint group-hover:text-text"}`}
                    strokeWidth={1.75}
                  />
                </div>
                <div className={`mt-2 text-xs font-mono font-medium ${isSelected ? "text-text font-semibold" : "text-muted"}`}>
                  {step.title}
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center py-1 lg:px-1.5 lg:py-0">
                  <ArrowRight
                    className="hidden h-3.5 w-3.5 text-line lg:block"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <div className="h-2 w-px bg-line lg:hidden" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Deep Dive */}
      <div className="mt-4 rounded border border-line bg-raised/60 p-3.5">
        <div className="flex items-baseline justify-between font-mono text-xs">
          <span className="text-accent font-semibold">Stage 0{activeStep + 1} · {steps[activeStep].title}</span>
          <span className="text-faint text-[10px]">Architecture detail</span>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted font-sans">{steps[activeStep].detail}</p>
      </div>
    </div>
  );
}
