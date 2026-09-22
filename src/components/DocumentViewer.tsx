import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3,
  Sparkles,
  Search,
  Check,
  Compass,
} from 'lucide-react';
import {
  DocumentPage,
  DocumentImage,
  DocumentTable,
  DocumentChart,
  EvidenceItem,
} from '../types/index.js';

interface DocumentViewerProps {
  currentPageNum: number;
  onPageChange: (pageNum: number) => void;
  pages: DocumentPage[];
  images: DocumentImage[];
  tables: DocumentTable[];
  charts: DocumentChart[];
  highlightedEvidence?: EvidenceItem | null;
  highlightedKeyword?: string | null;
  onAskFromRegion: (region: { type: string; id: string; page: number; preview: string }) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  currentPageNum,
  onPageChange,
  pages,
  images,
  tables,
  charts,
  highlightedEvidence,
  highlightedKeyword,
  onAskFromRegion,
}) => {
  const [selectedText, setSelectedText] = useState<{ text: string; rect: { top: number; left: number } | null }>({
    text: '',
    rect: null,
  });

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const activePage = pages.find((p) => p.pageNumber === currentPageNum) || pages[0];

  // Get elements on this page
  const pageImages = images.filter((img) => img.pageNumber === currentPageNum);
  const pageTables = tables.filter((tbl) => tbl.pageNumber === currentPageNum);
  const pageCharts = charts.filter((c) => c.pageNumber === currentPageNum);

  // Auto-switch to page when highlightedEvidence changes
  useEffect(() => {
    if (highlightedEvidence && highlightedEvidence.pageNumber !== currentPageNum) {
      onPageChange(highlightedEvidence.pageNumber);
    }
  }, [highlightedEvidence]);

  // Handle text selection for "Ask From Any Region"
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 5) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = pageContainerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setSelectedText({
          text,
          rect: {
            top: rect.top - containerRect.top - 40,
            left: Math.max(10, rect.left - containerRect.left + rect.width / 2 - 80),
          },
        });
      }
    } else {
      setSelectedText({ text: '', rect: null });
    }
  };

  const handleAskSelectedText = () => {
    if (!selectedText.text) return;
    onAskFromRegion({
      type: 'Selected Paragraph Region',
      id: `region-text-p${currentPageNum}`,
      page: currentPageNum,
      preview: selectedText.text,
    });
    setSelectedText({ text: '', rect: null });
    window.getSelection()?.removeAllRanges();
  };

  // Helper to highlight search keywords
  const renderHighlightedText = (text: string) => {
    if (!highlightedKeyword || highlightedKeyword.trim().length === 0) {
      return text;
    }
    const regex = new RegExp(`(${highlightedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-400 text-slate-950 px-1 py-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!activePage) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-mono">
        No document page selected.
      </div>
    );
  }

  const isEvidenceTarget = highlightedEvidence?.pageNumber === currentPageNum;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Viewer Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
            Page {currentPageNum} of {pages.length}
          </span>
          <span className="text-xs font-medium text-slate-300 truncate max-w-[200px] sm:max-w-xs">
            {activePage.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="viewer-prev-page-btn"
            onClick={() => onPageChange(Math.max(1, currentPageNum - 1))}
            disabled={currentPageNum <= 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-2">
            {currentPageNum} / {pages.length}
          </span>

          <button
            id="viewer-next-page-btn"
            onClick={() => onPageChange(Math.min(pages.length, currentPageNum + 1))}
            disabled={currentPageNum >= pages.length}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Action for "Ask From Selected Region" */}
      {selectedText.rect && (
        <div
          className="absolute z-30 transition-all transform animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${selectedText.rect.top}px`, left: `${selectedText.rect.left}px` }}
        >
          <button
            id="ask-from-selection-btn"
            onClick={handleAskSelectedText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-xl shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 border border-cyan-300/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Ask EVIAI From This Region</span>
          </button>
        </div>
      )}

      {/* Active Evidence Highlight Banner */}
      {isEvidenceTarget && (
        <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 border-b border-cyan-500/40 px-4 py-2 flex items-center justify-between text-xs text-cyan-300 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold font-mono text-[10px]">
              {highlightedEvidence.evidenceId}
            </span>
            <span className="font-semibold">
              Grounding Source: {highlightedEvidence.elementRef} ({highlightedEvidence.section})
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {highlightedEvidence.relevanceScore}% Match
          </span>
        </div>
      )}

      {/* Document Page Canvas / Content Area */}
      <div
        ref={pageContainerRef}
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 select-text custom-scrollbar relative bg-slate-950/70"
      >
        {/* Page Title & Section Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activePage.sections.join(' • ')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {activePage.title}
          </h2>
        </div>

        {/* Rendered Images / System Diagrams on this page */}
        {pageImages.length > 0 && (
          <div className="space-y-4">
            {pageImages.map((img) => (
              <div
                key={img.id}
                id={`document-image-${img.imageNumber}`}
                className={`p-4 rounded-xl border transition-all ${
                  highlightedEvidence?.elementType === 'image' && highlightedEvidence.elementNumber === img.imageNumber
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-white font-mono">
                      Image {img.imageNumber}: {img.description}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onAskFromRegion({
                        type: 'Image / Diagram',
                        id: img.id,
                        page: img.pageNumber,
                        preview: `Image ${img.imageNumber}: ${img.description}. ${img.ocrText}`,
                      })
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700/60 text-[11px] font-mono transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask about this image</span>
                  </button>
                </div>

                {/* SVG Visual Diagram Rendering */}
                {img.svgData ? (
                  <div
                    className="w-full overflow-x-auto rounded-lg bg-slate-950 p-2 border border-slate-800 flex justify-center"
                    dangerouslySetInnerHTML={{ __html: img.svgData }}
                  />
                ) : img.base64Data ? (
                  <img
                    src={img.base64Data}
                    alt={img.description}
                    className="max-h-80 mx-auto rounded-lg object-contain border border-slate-800"
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                    <p className="text-cyan-400 font-semibold mb-1">Visual Figure Object Detected:</p>
                    <p>{img.description}</p>
                    {img.ocrText && <p className="mt-2 text-slate-500 italic">OCR: {img.ocrText}</p>}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Classification: {img.imageType}</span>
                  <span>Extracted with PyMuPDF & Multimodal Vision</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rendered Charts on this page */}
        {pageCharts.length > 0 && (
          <div className="space-y-4">
            {pageCharts.map((chart) => (
              <div
                key={chart.id}
                id={`document-chart-${chart.chartNumber}`}
                className={`p-4 rounded-xl border transition-all ${
                  highlightedEvidence?.elementType === 'chart' && highlightedEvidence.elementNumber === chart.chartNumber
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                      <BarChart3 className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-white font-mono">
                      Chart {chart.chartNumber}: {chart.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                      {chart.chartType}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onAskFromRegion({
                        type: 'Chart / Graph',
                        id: chart.id,
                        page: chart.pageNumber,
                        preview: `Chart ${chart.chartNumber} (${chart.chartType}): ${chart.title}. ${chart.summary}`,
                      })
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-700/60 text-[11px] font-mono transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask about this chart</span>
                  </button>
                </div>

                {chart.svgData ? (
                  <div
                    className="w-full overflow-x-auto rounded-lg bg-slate-950 p-2 border border-slate-800 flex justify-center"
                    dangerouslySetInnerHTML={{ __html: chart.svgData }}
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <p className="font-semibold text-indigo-400 mb-1">{chart.title}</p>
                    <p>{chart.summary}</p>
                    {chart.visibleValues && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {chart.visibleValues.map((v, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rendered Tables on this page */}
        {pageTables.length > 0 && (
          <div className="space-y-4">
            {pageTables.map((tbl) => (
              <div
                key={tbl.id}
                id={`document-table-${tbl.tableNumber}`}
                className={`p-4 rounded-xl border transition-all ${
                  highlightedEvidence?.elementType === 'table' && highlightedEvidence.elementNumber === tbl.tableNumber
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      <TableIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-white font-mono">
                      Table {tbl.tableNumber}: {tbl.section}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {tbl.rows} rows × {tbl.columns} cols
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onAskFromRegion({
                        type: 'Document Table',
                        id: tbl.id,
                        page: tbl.pageNumber,
                        preview: `Table ${tbl.tableNumber}: ${tbl.summary}. Headers: ${tbl.headers.join(', ')}`,
                      })
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700/60 text-[11px] font-mono transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask about this table</span>
                  </button>
                </div>

                {/* Structured Table UI */}
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse font-sans">
                    <thead className="bg-slate-950 text-slate-200 font-semibold border-b border-slate-800">
                      <tr>
                        {tbl.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 border-r border-slate-800 last:border-none font-mono text-[11px]">
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

                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Extracted via pdfplumber & Camelot lattice parsers
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Page Text Paragraphs */}
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
          {activePage.text.split('\n\n').map((para, idx) => {
            const clean = para.trim();
            if (!clean) return null;

            // Check if this paragraph is the direct highlighted evidence
            const isTargetEvidence =
              isEvidenceTarget &&
              highlightedEvidence &&
              highlightedEvidence.supportingEvidence &&
              (clean.includes(highlightedEvidence.supportingEvidence.substring(0, 40)) ||
                highlightedEvidence.supportingEvidence.includes(clean.substring(0, 40)));

            const isHeading = (clean.length < 80 && clean.endsWith(':')) || /^Chapter|Section|\d+\./i.test(clean);

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg transition-all ${
                  isTargetEvidence
                    ? 'bg-cyan-950/40 border border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                    : 'hover:bg-slate-900/40'
                }`}
              >
                {isTargetEvidence && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 mb-1">
                    <Check className="w-3 h-3" />
                    <span>GROUNDING EVIDENCE MATCH</span>
                  </div>
                )}
                {isHeading ? (
                  <h3 className="text-base font-bold text-cyan-300 font-sans tracking-wide">
                    {renderHighlightedText(clean)}
                  </h3>
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {renderHighlightedText(clean)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
