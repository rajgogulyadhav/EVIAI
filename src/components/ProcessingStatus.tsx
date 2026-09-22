import React from 'react';
import { CheckCircle2, Loader2, Cpu, ShieldCheck } from 'lucide-react';
import { DocumentMetadata } from '../types/index.js';

interface ProcessingStatusProps {
  metadata?: DocumentMetadata | null;
  progress: number;
  currentAction: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  metadata,
  progress,
  currentAction,
}) => {
  const steps = [
    { label: 'Document loaded into RAM buffer', threshold: 15 },
    { label: 'Pages & boundaries detected', threshold: 30 },
    { label: 'Layout & text hierarchy extracted', threshold: 45 },
    { label: 'Tables detected & cells extracted', threshold: 60 },
    { label: 'Images & diagrams scanned', threshold: 75 },
    { label: 'Charts analyzed & values identified', threshold: 88 },
    { label: 'In-memory vector & lexical index compiled', threshold: 100 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">
                Analyzing Document Structure
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {metadata?.fileName || 'Processing uploaded file'}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold font-mono text-cyan-400">
            {Math.min(100, Math.max(0, Math.round(progress)))}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out shadow-sm shadow-cyan-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current action pulse */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-6">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-cyan-400" />
          <span className="truncate">{currentAction || 'Initializing parsing pipeline...'}</span>
        </div>

        {/* Stepper checklist */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isCompleted = progress >= step.threshold;
            const isCurrent = progress < step.threshold && (idx === 0 || progress >= steps[idx - 1].threshold);

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs p-2 rounded-lg transition-colors ${
                  isCompleted
                    ? 'text-slate-300 bg-slate-950/40'
                    : isCurrent
                    ? 'text-cyan-300 bg-cyan-950/20 font-medium'
                    : 'text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Zero-DB Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Session-based RAM vectors • Zero permanent storage</span>
          </div>
          <span className="font-mono">EVIAI Engine</span>
        </div>
      </div>
    </div>
  );
};
