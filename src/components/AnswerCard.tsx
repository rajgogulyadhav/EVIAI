import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Sparkles,
  Volume2,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { AskResponse, EvidenceItem, ConfidenceLevel } from '../types/index.js';
import { EvidenceCard } from './EvidenceCard.js';

interface AnswerCardProps {
  response: AskResponse;
  selectedEvidence?: EvidenceItem | null;
  onSelectEvidence: (evidence: EvidenceItem) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  response,
  selectedEvidence,
  onSelectEvidence,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(response.answer);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH EVIDENCE':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'HIGH EVIDENCE',
          badgeClass: 'bg-emerald-950/90 text-emerald-400 border-emerald-800/80',
        };
      case 'MEDIUM EVIDENCE':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'MEDIUM EVIDENCE',
          badgeClass: 'bg-cyan-950/90 text-cyan-400 border-cyan-800/80',
        };
      case 'LOW EVIDENCE':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'LOW EVIDENCE',
          badgeClass: 'bg-amber-950/90 text-amber-400 border-amber-800/80',
        };
      case 'INSUFFICIENT EVIDENCE':
      default:
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: 'INSUFFICIENT EVIDENCE',
          badgeClass: 'bg-rose-950/90 text-rose-400 border-rose-800/80',
        };
    }
  };

  const confidence = getConfidenceBadge(response.confidence);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 backdrop-blur-md">
      {/* Top Meta: Question & Badges */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${confidence.badgeClass}`}
            >
              {confidence.icon}
              <span>{confidence.label}</span>
            </span>

            {response.detectedLanguage && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 text-[11px] font-mono border border-slate-700/60">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>{response.detectedLanguage}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors ${
                isSpeaking ? 'text-cyan-400 bg-cyan-950/40' : ''
              }`}
              title="Read answer aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Answer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h3 className="text-white font-medium text-sm sm:text-base font-sans mt-2">
          "{response.question}"
        </h3>

        {/* Region context pill if asked from region */}
        {response.regionContext && (
          <div className="mt-2 p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              Targeted Query: {response.regionContext.type} on Page {response.regionContext.page}
            </span>
          </div>
        )}
      </div>

      {/* Synthesized Answer Text */}
      <div className="space-y-3">
        <div className="text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
          {response.answer}
        </div>

        {/* Primary Source Location Badge */}
        {response.sourceLocation && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              Primary Location: Page {response.sourceLocation.pageNumber} • {response.sourceLocation.section} (
              {response.sourceLocation.element})
            </span>
          </div>
        )}
      </div>

      {/* Visual Evidence Cards Section */}
      {response.evidenceList && response.evidenceList.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>Visual Evidence Citations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px]">
                {response.evidenceList.length}
              </span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Click card to highlight in document
            </span>
          </div>

          <div className="space-y-2.5">
            {response.evidenceList.map((ev) => (
              <EvidenceCard
                key={ev.evidenceId}
                evidence={ev}
                isSelected={selectedEvidence?.evidenceId === ev.evidenceId}
                onSelect={onSelectEvidence}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
