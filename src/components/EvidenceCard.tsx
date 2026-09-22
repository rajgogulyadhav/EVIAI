import React from 'react';
import {
  ExternalLink,
  Table as TableIcon,
  Image as ImageIcon,
  BarChart3,
  AlignLeft,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { EvidenceItem } from '../types/index.js';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  isSelected?: boolean;
  onSelect: (evidence: EvidenceItem) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  isSelected,
  onSelect,
}) => {
  const getTypeBadge = (type: EvidenceItem['elementType']) => {
    switch (type) {
      case 'table':
        return {
          icon: <TableIcon className="w-3 h-3 text-emerald-400" />,
          label: 'Table',
          bg: 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300',
        };
      case 'image':
        return {
          icon: <ImageIcon className="w-3 h-3 text-sky-400" />,
          label: 'Image',
          bg: 'bg-sky-950/80 border-sky-800/60 text-sky-300',
        };
      case 'chart':
        return {
          icon: <BarChart3 className="w-3 h-3 text-indigo-400" />,
          label: 'Chart',
          bg: 'bg-indigo-950/80 border-indigo-800/60 text-indigo-300',
        };
      default:
        return {
          icon: <AlignLeft className="w-3 h-3 text-cyan-400" />,
          label: 'Text',
          bg: 'bg-cyan-950/80 border-cyan-800/60 text-cyan-300',
        };
    }
  };

  const badge = getTypeBadge(evidence.elementType);

  return (
    <div
      onClick={() => onSelect(evidence)}
      className={`rounded-xl border p-3.5 transition-all cursor-pointer shadow-sm relative group ${
        isSelected
          ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/20'
          : 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/90'
      }`}
    >
      {/* Top Header: ID, Page, Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-mono font-bold text-[10px] border border-slate-800">
            {evidence.evidenceId}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-medium text-[10px]">
            Page {evidence.pageNumber}
          </span>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono ${badge.bg}`}>
            {badge.icon}
            <span>{evidence.elementRef || badge.label}</span>
          </div>
        </div>

        {/* Relevance Score */}
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400">
          <span>{evidence.relevanceScore}%</span>
        </div>
      </div>

      {/* Section tag */}
      <p className="text-[11px] text-slate-400 font-mono mb-2 truncate">
        Section: {evidence.section}
      </p>

      {/* Verbatim Supporting Quote */}
      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans mb-3 italic">
        "{evidence.supportingEvidence}"
      </div>

      {/* Relevance progress bar */}
      <div className="w-full bg-slate-800/60 rounded-full h-1 overflow-hidden mb-2.5">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${evidence.relevanceScore}%` }}
        />
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 group-hover:text-cyan-400 transition-colors pt-1">
        <span className="flex items-center gap-1 font-mono">
          <FileCheck className="w-3 h-3 text-cyan-400" />
          <span>Click to verify on Page {evidence.pageNumber}</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
