import React, { useState, useEffect } from 'react';
import {
  DocumentMetadata,
  DocumentPage,
  DocumentImage,
  DocumentTable,
  DocumentChart,
  DocumentContentMapItem,
  AskResponse,
  SearchResponse,
  EvidenceItem,
  SearchMatch,
  ChatMessage,
} from './types/index.js';
import { NeuralBackground } from './components/NeuralBackground.js';
import { EVIAIHeader } from './components/EVIAIHeader.js';
import { UploadZone } from './components/UploadZone.js';
import { ProcessingStatus } from './components/ProcessingStatus.js';
import { DocumentOverview } from './components/DocumentOverview.js';
import { DocumentViewer } from './components/DocumentViewer.js';
import { ChatPanel } from './components/ChatPanel.js';
import { EvidenceGallery } from './components/EvidenceGallery.js';
import { AboutModal } from './components/AboutModal.js';
import {
  Layers,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3,
  ChevronRight,
  Shield,
  FileText,
  Sparkles,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documents' | 'ask' | 'evidence' | 'about'>('ask');
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [pages, setPages] = useState<DocumentPage[]>([]);
  const [images, setImages] = useState<DocumentImage[]>([]);
  const [tables, setTables] = useState<DocumentTable[]>([]);
  const [charts, setCharts] = useState<DocumentChart[]>([]);
  const [contentMap, setContentMap] = useState<DocumentContentMapItem[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  // Upload & processing state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadAction, setUploadAction] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Query & Evidence state
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [askResponse, setAskResponse] = useState<AskResponse | null>(null);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(null);
  const [regionContext, setRegionContext] = useState<{ type: string; id: string; page: number; preview: string } | null>(null);

  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // User starts directly at the upload screen to dynamically upload their real document

  const loadDocumentDetails = async (docId: string) => {
    try {
      const [overviewRes, pagesRes, imagesRes, tablesRes, chartsRes] = await Promise.all([
        fetch(`/api/document/${docId}/overview`),
        fetch(`/api/document/${docId}/pages`),
        fetch(`/api/document/${docId}/images`),
        fetch(`/api/document/${docId}/tables`),
        fetch(`/api/document/${docId}/charts`),
      ]);

      if (!overviewRes.ok) {
        throw new Error('Could not load document overview');
      }

      const overviewData = await overviewRes.json();
      const pagesData = await pagesRes.json();
      const imagesData = await imagesRes.json();
      const tablesData = await tablesRes.json();
      const chartsData = await chartsRes.json();

      setMetadata(overviewData.metadata);
      setContentMap(overviewData.contentMap || []);
      setPages(pagesData.pages || []);
      setImages(imagesData.images || []);
      setTables(tablesData.tables || []);
      setCharts(chartsData.charts || []);
      setCurrentPageNum(1);
    } catch (err) {
      console.warn('Could not load initial demo document:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(15);
    setUploadAction(`Loading ${file.name} into in-memory buffer...`);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 85) return prev + 12;
        return prev;
      });
    }, 300);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process document');
      }

      setUploadProgress(100);
      setUploadAction('Document ready. Loading structure...');

      const data = await res.json();
      setMessages([]); // Reset chat for fresh document context
      await loadDocumentDetails(data.documentId);
      setIsUploading(false);
      setActiveTab('ask');
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsUploading(false);
      setUploadError(err.message || 'Error uploading document.');
    }
  };

  const handleLoadDemo = async () => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(20);
    setUploadAction('Loading Team Tech Warriors sample presentation into session memory...');

    try {
      const res = await fetch('/api/demo/load', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to load demo presentation');

      const data = await res.json();
      setUploadProgress(100);
      setUploadAction('Loaded successfully.');

      setMessages([]); // Reset chat for demo presentation
      await loadDocumentDetails(data.documentId);
      setIsUploading(false);
      setActiveTab('ask');
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Error loading demo.');
    }
  };

  const handleAsk = async (question: string) => {
    if (!metadata) return;
    setIsQuerying(true);
    setSearchResponse(null);

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch(`/api/document/${metadata.id}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          regionContext: regionContext || undefined,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer from EVIAI');
      }

      const response: AskResponse = await res.json();
      setAskResponse(response);

      const assistantMessage: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        text: response.answer,
        response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-focus top evidence if present
      if (response.evidenceList && response.evidenceList.length > 0) {
        const top = response.evidenceList[0];
        setSelectedEvidence(top);
        setCurrentPageNum(top.pageNumber);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        text: 'Error processing question: ' + (err.message || 'Could not reach EVIAI engine.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    if (!metadata) return;
    setIsQuerying(true);
    setAskResponse(null);
    setHighlightedKeyword(keyword);

    try {
      const res = await fetch(`/api/document/${metadata.id}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        throw new Error('Failed to search document');
      }

      const response: SearchResponse = await res.json();
      setSearchResponse(response);

      // If exact matches exist, auto jump to the first page
      if (response.exactMatches.length > 0) {
        setCurrentPageNum(response.exactMatches[0].pageNumber);
      } else if (response.semanticMatches.length > 0) {
        setCurrentPageNum(response.semanticMatches[0].pageNumber);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error searching document.');
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSelectEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidence(evidence);
    setCurrentPageNum(evidence.pageNumber);
  };

  const handleSelectSearchMatch = (match: SearchMatch) => {
    setCurrentPageNum(match.pageNumber);
  };

  const handleAskFromRegion = (region: { type: string; id: string; page: number; preview: string }) => {
    setRegionContext(region);
    setActiveTab('ask');
  };

  const handleClearDocument = async () => {
    if (!metadata) return;
    if (confirm('Are you sure you want to purge this document and all temporary in-memory vectors?')) {
      try {
        await fetch(`/api/document/${metadata.id}`, { method: 'DELETE' });
      } catch (e) {
        // ignore
      }
      setMetadata(null);
      setPages([]);
      setImages([]);
      setTables([]);
      setCharts([]);
      setContentMap([]);
      setAskResponse(null);
      setSearchResponse(null);
      setSelectedEvidence(null);
      setRegionContext(null);
      setActiveTab('documents');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background Neural Canvas */}
      <NeuralBackground />

      {/* Header */}
      <EVIAIHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metadata={metadata}
        onClearDocument={handleClearDocument}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 relative z-10 flex flex-col">
        {isUploading ? (
          <ProcessingStatus
            metadata={metadata}
            progress={uploadProgress}
            currentAction={uploadAction}
          />
        ) : !metadata || activeTab === 'documents' ? (
          <UploadZone
            onFileUpload={handleFileUpload}
            onLoadDemo={handleLoadDemo}
            isLoading={isUploading}
            errorMessage={uploadError}
          />
        ) : activeTab === 'dashboard' ? (
          <DocumentOverview
            metadata={metadata}
            contentMap={contentMap}
            onSelectPage={(pageNum) => {
              setCurrentPageNum(pageNum);
              setActiveTab('ask');
            }}
            onGoToAsk={() => setActiveTab('ask')}
          />
        ) : activeTab === 'evidence' ? (
          <EvidenceGallery
            images={images}
            tables={tables}
            charts={charts}
            onSelectElement={(pageNum) => {
              setCurrentPageNum(pageNum);
              setActiveTab('ask');
            }}
            onAskAboutElement={(type, id, page, preview) => {
              handleAskFromRegion({ type, id, page, preview });
            }}
          />
        ) : (
          /* Main 3-Column / Flexible Workspace: Ask EVIAI */
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            {/* Document Context Indicator Bar (Requirement #17) */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 overflow-x-auto text-xs py-0.5 custom-scrollbar">
                <div className="flex items-center gap-2 font-medium text-white shrink-0">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">{metadata.fileName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                    {metadata.fileType}
                  </span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-300 shrink-0">
                  <span className="text-slate-400"><strong className="text-white">{metadata.pageCount}</strong> pages</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400"><strong className="text-cyan-400">{images.length}</strong> images</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400"><strong className="text-emerald-400">{tables.length}</strong> tables</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400"><strong className="text-indigo-400">{charts.length}</strong> charts</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400"><strong className="text-slate-200">{metadata.wordCount.toLocaleString()}</strong> words</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Structure</span>
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evidence Vault</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 sm:p-4 gap-3 max-w-[1700px] w-full mx-auto">
              {/* Left Column: Document Page Navigator & Element Badges */}
              <div className="hidden xl:flex flex-col w-64 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shrink-0">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pages ({pages.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    RAM Indexed
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {pages.map((p) => {
                    const isCurrent = p.pageNumber === currentPageNum;
                    return (
                      <button
                        key={p.pageNumber}
                        onClick={() => setCurrentPageNum(p.pageNumber)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2 ${
                          isCurrent
                            ? 'bg-cyan-950/60 border border-cyan-500/50 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                        }`}
                      >
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isCurrent ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                              P.{p.pageNumber}
                            </span>
                            <span className="text-xs font-semibold truncate text-slate-200">
                              {p.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pl-1">
                            {p.imagesCount > 0 && <span>{p.imagesCount} img</span>}
                            {p.tablesCount > 0 && <span>{p.tablesCount} tbl</span>}
                            {p.chartsCount > 0 && <span>{p.chartsCount} chart</span>}
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 mt-1 shrink-0 ${isCurrent ? 'text-cyan-400' : 'text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: Document Viewer (Rendered Page & Elements) */}
              <div className="flex-1 flex flex-col min-w-0 h-[50vh] lg:h-full">
                <DocumentViewer
                  currentPageNum={currentPageNum}
                  onPageChange={setCurrentPageNum}
                  pages={pages}
                  images={images}
                  tables={tables}
                  charts={charts}
                  highlightedEvidence={selectedEvidence}
                  highlightedKeyword={highlightedKeyword}
                  onAskFromRegion={handleAskFromRegion}
                />
              </div>

              {/* Right Column: EVIAI Chat, Search & Evidence Panel */}
              <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col h-[50vh] lg:h-full shrink-0">
                <ChatPanel
                  onAsk={handleAsk}
                  onSearch={handleSearch}
                  onFileUpload={handleFileUpload}
                  isLoading={isQuerying}
                  searchResponse={searchResponse}
                  selectedEvidence={selectedEvidence}
                  onSelectEvidence={handleSelectEvidence}
                  onSelectSearchMatch={handleSelectSearchMatch}
                  regionContext={regionContext}
                  onClearRegionContext={() => setRegionContext(null)}
                  messages={messages}
                  onClearChat={() => setMessages([])}
                  activeDocumentName={metadata.fileName}
                  activeDocumentPages={metadata.pageCount}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* About & Technical Architecture Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}

export default App;
