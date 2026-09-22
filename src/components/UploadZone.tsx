import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, Shield, ArrowRight, Presentation } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  onLoadDemo,
  isLoading,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'pptx', 'ppt', 'docx', 'doc'];
    if (!ext || !validExtensions.includes(ext)) {
      alert('Please upload a PDF (.pdf), PowerPoint presentation (.pptx), or Word (.docx) file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds the 50MB limit.');
      return;
    }
    onFileUpload(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>IN-MEMORY ZERO-STORAGE DOCUMENT INTELLIGENCE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Upload Your Document.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Get Instant Grounded Answers.
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
          Upload your real PDF, PowerPoint presentation (PPTX), or Word document. EVIAI dynamically parses pages, text, tables, and visuals in memory—returning answers backed by strict visual citations from your file.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        id="document-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-2xl shadow-cyan-500/20'
            : 'border-slate-800 hover:border-cyan-500/60 bg-slate-900/50 hover:bg-slate-900/80 shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.pptx,.ppt,.docx,.doc,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />

        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-500/40 flex items-center justify-center mx-auto mb-5 text-cyan-400 shadow-lg shadow-cyan-500/10">
          <UploadCloud className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Drop your real PDF, PPTX presentation, or Word file here
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
          or <span className="text-cyan-400 font-semibold underline decoration-cyan-400/40 underline-offset-4">browse files</span> from your computer to analyze dynamically
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            PDF (.pdf)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5">
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            Presentation (.pptx, .ppt)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Word (.docx)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-mono">
            Max 50MB
          </span>
        </div>

        {errorMessage && (
          <div className="mt-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800/70 text-rose-200 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Optional Sample Document Quick-Load (Subtle Secondary) */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Don't have a document file right now?</span>
        </div>
        <button
          id="load-demo-presentation-btn"
          onClick={onLoadDemo}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 border border-slate-700 font-medium transition-all disabled:opacity-50"
        >
          <span>Explore Sample Presentation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Feature cards below upload */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Dynamic Visual Evidence</h4>
            <p className="text-xs text-slate-400 mt-1">
              Every answer links directly to its source page, slide, or table from your uploaded file.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Multimodal Parsing</h4>
            <p className="text-xs text-slate-400 mt-1">
              Parses slides, paragraphs, structured tables, and figures dynamically into memory.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Zero Hallucination</h4>
            <p className="text-xs text-slate-400 mt-1">
              Answers are constrained exclusively to your document's text and data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
