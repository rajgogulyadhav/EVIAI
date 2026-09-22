import React from 'react';
import { X, ShieldCheck, DatabaseZap, Cpu, Layers, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              EVIAI • Technical Architecture & Principles
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Team Tech Warriors • AI-Powered Mixed-Format Document QA System
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Core Vision */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
            <h3 className="text-cyan-300 font-semibold text-sm mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Tagline & Core Principle</span>
            </h3>
            <p className="italic text-slate-200">
              "Ask questions. Get answers with visual evidence you can verify."
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Standard RAG systems treat documents as flat text, losing critical spatial context, tables, charts, and diagrams. EVIAI preserves layout and binds every answer to verifiable visual cards.
            </p>
          </div>

          {/* Landmark Problem Statement: Air Canada Lawsuit */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>The Hallucination Crisis & The Air Canada Precedent</span>
            </h3>
            <p className="text-xs text-slate-400">
              In <em>Moffatt v. Air Canada (2024)</em>, the Civil Resolution Tribunal ruled that enterprises are legally liable for their AI chatbot's hallucinations. Without visual verification back to the source page, AI answers carry massive compliance and operational risk. EVIAI eliminates this via source-grounded visual cards.
            </p>
          </div>

          {/* Zero Persistent DB Guarantee */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <DatabaseZap className="w-4 h-4 text-emerald-400" />
              <span>Zero-Database In-Memory Architecture</span>
            </h3>
            <p className="text-xs text-slate-400">
              EVIAI operates strictly in runtime memory (RAM session store). It does not depend on MongoDB, PostgreSQL, Supabase, Firebase, Pinecone, or Chroma. Documents and their vectorized embeddings live in isolated memory sessions and are automatically purged upon session completion or explicit user deletion, ensuring strict enterprise document privacy.
            </p>
          </div>

          {/* Multimodal Extraction Stack */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Multi-Format Extraction Engines</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-sky-400 font-bold block mb-0.5">Text & Layout:</span>
                PyMuPDF (fitz) for structural reading order and bounding coordinates.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-0.5">Table Extraction:</span>
                pdfplumber & Camelot lattice parsers for clean row/cell grids.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-indigo-400 font-bold block mb-0.5">Charts & Graphs:</span>
                Multimodal AI vision models extracting trendlines and visible values.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-0.5">Scanned Images & OCR:</span>
                Tesseract OCR engine & Multimodal visual entity recognition.
              </div>
            </div>
          </div>

          {/* 4-Tier Confidence Scoring */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>4-Tier Evidence Confidence Guardrail</span>
            </h3>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                <strong>HIGH EVIDENCE (&gt;85%):</strong> Multiple direct citations, verified table cells or chart data.
              </div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
                <strong>MEDIUM EVIDENCE (65%-85%):</strong> Single direct source or partial textual evidence.
              </div>
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
                <strong>LOW EVIDENCE (45%-65%):</strong> Weak semantic overlap; user advised to verify.
              </div>
              <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300">
                <strong>INSUFFICIENT EVIDENCE (&lt;45%):</strong> Explicitly outputs "The document does not provide enough evidence to answer this question." Zero hallucination.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
