import React from 'react';
import { ShieldCheck, FileText, DatabaseZap, Trash2, Cpu, HelpCircle } from 'lucide-react';
import { DocumentMetadata } from '../types/index.js';

interface HeaderProps {
  activeTab: 'dashboard' | 'documents' | 'ask' | 'evidence' | 'about';
  setActiveTab: (tab: 'dashboard' | 'documents' | 'ask' | 'evidence' | 'about') => void;
  metadata: DocumentMetadata | null;
  onClearDocument: () => void;
  onOpenAbout: () => void;
}

export const EVIAIHeader: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  metadata,
  onClearDocument,
  onOpenAbout,
}) => {
  return (
    <header id="eviai-header" className="relative z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EVIAI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                Evidence + AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Evidence Intelligence AI • Zero-Hallucination QA
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-ask"
            onClick={() => setActiveTab('ask')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'ask'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Ask EVIAI
          </button>

          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-tab-evidence"
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'evidence'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Evidence Gallery
          </button>

          <button
            id="nav-tab-documents"
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'documents'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Upload
          </button>

          <button
            id="nav-tab-about"
            onClick={onOpenAbout}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 rounded-lg transition-colors ml-1"
            title="About EVIAI & Architecture"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </nav>

        {/* Active Document Status / Memory badge */}
        <div className="hidden md:flex items-center gap-3">
          {metadata ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="max-w-[140px] truncate text-xs text-slate-300 font-mono" title={metadata.fileName}>
                {metadata.fileName}
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                In-Memory
              </span>
              <button
                id="header-clear-doc-btn"
                onClick={onClearDocument}
                className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors ml-1"
                title="Purge document from memory session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <DatabaseZap className="w-3.5 h-3.5 text-slate-500" />
              <span>RAM Only (No DB)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
