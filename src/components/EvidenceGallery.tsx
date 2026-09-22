import React, { useState } from 'react';
import {
  Table as TableIcon,
  Image as ImageIcon,
  BarChart3,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DocumentImage, DocumentTable, DocumentChart } from '../types/index.js';

interface EvidenceGalleryProps {
  images: DocumentImage[];
  tables: DocumentTable[];
  charts: DocumentChart[];
  onSelectElement: (pageNumber: number) => void;
  onAskAboutElement: (type: string, id: string, page: number, preview: string) => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  images,
  tables,
  charts,
  onSelectElement,
  onAskAboutElement,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'tables' | 'images' | 'charts'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = tables.filter(
    (t) =>
      filterType === 'all' || filterType === 'tables'
  ).filter(
    (t) =>
      !searchQuery ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.headers.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredImages = images.filter(
    (img) =>
      filterType === 'all' || filterType === 'images'
  ).filter(
    (img) =>
      !searchQuery ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.ocrText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharts = charts.filter(
    (c) =>
      filterType === 'all' || filterType === 'charts'
  ).filter(
    (c) =>
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-mono font-semibold">
              EVIDENCE VAULT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              In-Memory Extracted Objects
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Visual & Structured Evidence Gallery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect all extracted tables, system architecture diagrams, charts, and OCR figures across document pages.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({tables.length + images.length + charts.length})
            </button>
            <button
              onClick={() => setFilterType('tables')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'tables'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tables ({tables.length})
            </button>
            <button
              onClick={() => setFilterType('images')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'images'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Images ({images.length})
            </button>
            <button
              onClick={() => setFilterType('charts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'charts'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Charts ({charts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Extracted Items */}
      <div className="space-y-8">
        {/* Tables Section */}
        {filteredTables.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2 font-mono">
              <TableIcon className="w-4 h-4" />
              <span>Extracted Tables ({filteredTables.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {filteredTables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono text-xs font-bold">
                        Table {tbl.tableNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Page {tbl.pageNumber} • {tbl.section}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onAskAboutElement(
                            'Document Table',
                            tbl.id,
                            tbl.pageNumber,
                            `Table ${tbl.tableNumber}: ${tbl.summary}`
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-mono transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask EVIAI about table</span>
                      </button>
                      <button
                        onClick={() => onSelectElement(tbl.pageNumber)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                      >
                        <span>View on Page {tbl.pageNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead className="bg-slate-950 text-slate-200 font-semibold border-b border-slate-800">
                        <tr>
                          {tbl.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2 border-r border-slate-800 last:border-none font-mono">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                        {tbl.cells.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 border-r border-slate-800/60 last:border-none font-mono text-[11px]">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images & Diagrams Section */}
        {filteredImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-sky-400 flex items-center gap-2 font-mono">
              <ImageIcon className="w-4 h-4" />
              <span>Extracted Images & System Diagrams ({filteredImages.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-mono text-xs font-bold">
                          Image {img.imageNumber}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Page {img.pageNumber} • {img.imageType}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white">
                      {img.description}
                    </h3>

                    {img.svgData ? (
                      <div
                        className="rounded-xl bg-slate-950 p-2 border border-slate-800 overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: img.svgData }}
                      />
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                        {img.summary}
                      </div>
                    )}

                    {img.ocrText && (
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-xs font-mono text-slate-400">
                        <span className="text-sky-400 font-bold block mb-0.5">OCR Text Extract:</span>
                        {img.ocrText}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() =>
                        onAskAboutElement(
                          'Image / Diagram',
                          img.id,
                          img.pageNumber,
                          `Image ${img.imageNumber}: ${img.description}. ${img.ocrText}`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/50 text-xs font-mono transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask about diagram</span>
                    </button>
                    <button
                      onClick={() => onSelectElement(img.pageNumber)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                    >
                      <span>View on Page {img.pageNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        {filteredCharts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-indigo-400 flex items-center gap-2 font-mono">
              <BarChart3 className="w-4 h-4" />
              <span>Extracted Charts & Flowcharts ({filteredCharts.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono text-xs font-bold">
                          Chart {chart.chartNumber}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Page {chart.pageNumber} • {chart.chartType}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white">
                      {chart.title}
                    </h3>

                    {chart.svgData ? (
                      <div
                        className="rounded-xl bg-slate-950 p-2 border border-slate-800 overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: chart.svgData }}
                      />
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                        {chart.summary}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() =>
                        onAskAboutElement(
                          'Chart / Graph',
                          chart.id,
                          chart.pageNumber,
                          `Chart ${chart.chartNumber} (${chart.chartType}): ${chart.title}. ${chart.summary}`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 text-xs font-mono transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask about chart</span>
                    </button>
                    <button
                      onClick={() => onSelectElement(chart.pageNumber)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                    >
                      <span>View on Page {chart.pageNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
