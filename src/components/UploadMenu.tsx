import React, { useState, useRef, useEffect } from 'react';
import { Plus, FileText, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadMenuProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const UploadMenu: React.FC<UploadMenuProps> = ({ onFileSelected, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePdfClick = () => {
    setIsOpen(false);
    pdfInputRef.current?.click();
  };

  const handleDocxClick = () => {
    setIsOpen(false);
    docxInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    // Reset value so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Hidden File Inputs - STRICTLY PDF and DOCX ONLY */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={docxInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* The "+" Button in Chat Input */}
      <button
        id="chat-upload-plus-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
          isOpen
            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-cyan-500/50'
        } disabled:opacity-40 disabled:pointer-events-none`}
        title="Upload Document (PDF or Word .docx)"
      >
        <Plus className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-45 text-slate-950' : 'text-cyan-400'}`} />
      </button>

      {/* Document Upload Popover Modal - ONLY PDF & DOCX */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 w-72 bg-slate-900 border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 font-mono uppercase">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Upload Document
              </span>
              <p className="text-[11px] text-slate-400">
                Select document format to analyze:
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {/* PDF Option */}
            <button
              id="upload-opt-pdf"
              type="button"
              onClick={handlePdfClick}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/90 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors">
                    PDF Document
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 font-bold">
                    .pdf
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Adobe Portable Document Format
                </p>
              </div>
            </button>

            {/* Word DOCX Option */}
            <button
              id="upload-opt-docx"
              type="button"
              onClick={handleDocxClick}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/90 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/50 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
                    Word Document
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/60 font-bold">
                    .docx
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Microsoft Word OpenXML Document
                </p>
              </div>
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">Supported formats:</span>
              <span className="text-cyan-400 font-semibold">PDF, DOCX</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              Temporary in-memory session analysis. No permanent database storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
