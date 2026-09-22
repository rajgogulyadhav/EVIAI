import React from 'react';
import {
  FileText,
  Layers,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3,
  AlignLeft,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  HardDriveDownload,
} from 'lucide-react';
import { DocumentMetadata, DocumentContentMapItem } from '../types/index.js';

interface DocumentOverviewProps {
  metadata: DocumentMetadata;
  contentMap: DocumentContentMapItem[];
  onSelectPage: (pageNumber: number) => void;
  onGoToAsk: () => void;
}

export const DocumentOverview: React.FC<DocumentOverviewProps> = ({
  metadata,
  contentMap,
  onSelectPage,
  onGoToAsk,
}) => {
  const totalImages = contentMap.reduce((acc, p) => acc + p.imagesCount, 0);
  const totalTables = contentMap.reduce((acc, p) => acc + p.tablesCount, 0);
  const totalCharts = contentMap.reduce((acc, p) => acc + p.chartsCount, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-mono font-semibold">
                DOCUMENT INSPECTOR
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {metadata.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {metadata.fileName}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Fully indexed in session memory. All visual elements, structural layout, text chunks, and tables ready for zero-hallucination querying.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="overview-ask-btn"
              onClick={onGoToAsk}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask EVIAI Now</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pages</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {metadata.pageCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Images & Diag.</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {totalImages}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tables</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {totalTables}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Charts / Graphs</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {totalCharts}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <AlignLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Words Extracted</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {metadata.wordCount.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Storage Mode</span>
            </div>
            <div className="text-sm font-semibold font-mono text-teal-300">
              RAM Session
            </div>
          </div>
        </div>
      </div>

      {/* Document Content Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Document Content Map
            </h2>
            <p className="text-xs text-slate-400">
              Structural layout index mapped page by page with detected media elements
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {contentMap.length} Pages Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentMap.map((page) => (
            <div
              key={page.pageNumber}
              onClick={() => onSelectPage(page.pageNumber)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[11px] font-mono font-medium">
                    Page {page.pageNumber}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    {page.imagesCount > 0 && (
                      <span className="flex items-center gap-1 text-sky-400 font-mono text-[11px]">
                        <ImageIcon className="w-3 h-3" />
                        {page.imagesCount}
                      </span>
                    )}
                    {page.tablesCount > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <TableIcon className="w-3 h-3" />
                        {page.tablesCount}
                      </span>
                    )}
                    {page.chartsCount > 0 && (
                      <span className="flex items-center gap-1 text-indigo-400 font-mono text-[11px]">
                        <BarChart3 className="w-3 h-3" />
                        {page.chartsCount}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {page.title}
                </h3>

                {page.sections && page.sections.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {page.sections.slice(0, 3).map((sec, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 font-mono"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {page.summaryPreview}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>Click to view page in Document Viewer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
