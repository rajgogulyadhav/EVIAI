import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Search,
  Sparkles,
  X,
  Loader2,
  Globe,
  Compass,
  ArrowRight,
  Bot,
  User,
  RotateCcw,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AskResponse, EvidenceItem, SearchResponse, SearchMatch, ChatMessage } from '../types/index.js';
import { AnswerCard } from './AnswerCard.js';
import { SearchResults } from './SearchResults.js';
import { UploadMenu } from './UploadMenu.js';

interface ChatPanelProps {
  onAsk: (question: string) => Promise<void>;
  onSearch: (keyword: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  searchResponse: SearchResponse | null;
  selectedEvidence: EvidenceItem | null;
  onSelectEvidence: (evidence: EvidenceItem) => void;
  onSelectSearchMatch: (match: SearchMatch) => void;
  regionContext: { type: string; id: string; page: number; preview: string } | null;
  onClearRegionContext: () => void;
  messages: ChatMessage[];
  onClearChat: () => void;
  activeDocumentName?: string;
  activeDocumentPages?: number;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onAsk,
  onSearch,
  onFileUpload,
  isLoading,
  searchResponse,
  selectedEvidence,
  onSelectEvidence,
  onSelectSearchMatch,
  regionContext,
  onClearRegionContext,
  messages,
  onClearChat,
  activeDocumentName,
  activeDocumentPages,
}) => {
  const [activeMode, setActiveMode] = useState<'ask' | 'search'>('ask');
  const [queryInput, setQueryInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Comprehensive categorized questions (Business, Problem, Architecture, Multilingual, Guardrails)
  const questionCategories = [
    {
      name: 'Business & Financials',
      questions: [
        'What is the main business problem discussed in this document?',
        'What solution is proposed?',
        'What are the main benefits mentioned?',
        'What is the cost mentioned in the document?',
        'What are the risks?',
        'Which company/product/customer is mentioned?',
        'What does the document say about revenue?',
        'What is the market size?',
      ],
    },
    {
      name: 'Document Elements & Charts',
      questions: [
        'How many pages are in this document?',
        'How many images are there?',
        'How many tables are in this document?',
        'Explain the chart on page 7.',
        'Where is the architecture diagram?',
        'What technologies are used for text extraction?',
      ],
    },
    {
      name: 'Follow-Up Questions (Context Test)',
      questions: [
        'Who are affected by this problem?',
        'Which page says that?',
      ],
    },
    {
      name: 'Tamil & Tanglish Queries',
      questions: [
        'இந்த documentல business problem என்ன?',
        'இந்த PDFல எத்தனை images இருக்கு?',
        'இந்த PDFல revenue எவ்வளவு?',
        'Indha document la customer problem enna?',
        'Technical Feasibility section enga iruku?',
        'Table iruka? irundha entha page?',
      ],
    },
    {
      name: 'Hallucination & Guardrails Test',
      questions: [
        'What is the stock price of Apple?',
        'What is the capital of France?',
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isLoading) return;

    if (activeMode === 'ask') {
      const q = queryInput.trim();
      setQueryInput('');
      onAsk(q);
    } else {
      onSearch(queryInput.trim());
    }
  };

  const handleSelectSampleQuestion = (q: string) => {
    setQueryInput('');
    setActiveMode('ask');
    onAsk(q);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Mode Switcher & Active Document Context Header */}
      <div className="flex items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="mode-ask-btn"
            onClick={() => setActiveMode('ask')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'ask'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask EVIAI</span>
          </button>

          <button
            id="mode-search-btn"
            onClick={() => setActiveMode('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'search'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Keyword Search</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && activeMode === 'ask' && (
            <button
              onClick={onClearChat}
              className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Grounded</span>
          </span>
        </div>
      </div>

      {/* Main Chat Stream / Search Results Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Active Region Context Banner if present */}
        {regionContext && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold font-mono text-cyan-400 mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Active Region Constraint (Page {regionContext.page})</span>
              </div>
              <p className="text-slate-300 line-clamp-2 italic">
                "{regionContext.preview}"
              </p>
            </div>
            <button
              onClick={onClearRegionContext}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors"
              title="Clear Region Context"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mode: Search Keyword Results */}
        {activeMode === 'search' && searchResponse && (
          <SearchResults
            results={searchResponse}
            onSelectMatch={onSelectSearchMatch}
          />
        )}

        {/* Mode: Chat Stream Messages (Multi-Turn Conversation) */}
        {activeMode === 'ask' && (
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-inner shadow-cyan-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    EVIAI Document Intelligence
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Ask any business, financial, technical, or structural question about {activeDocumentName || 'this document'}. Every answer is backed by verifiable visual evidence.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in duration-200 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-md'
                      : 'flex-1 space-y-3'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="leading-relaxed font-sans">{msg.text}</p>
                  ) : (
                    msg.response && (
                      <AnswerCard
                        response={msg.response}
                        selectedEvidence={selectedEvidence}
                        onSelectEvidence={onSelectEvidence}
                      />
                    )
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 text-xs shrink-0 mt-1 border border-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* In-Flight Thinking Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching in-memory document evidence & synthesizing...</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full w-3/4 animate-pulse" />
                  <div className="h-2 bg-slate-800/60 rounded-full w-1/2 animate-pulse" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Categorized Test & Sample Questions Accordion */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Suggested & Test Queries</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Click to test</span>
          </div>

          <div className="space-y-3">
            {questionCategories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-1.5">
                <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                  {cat.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSelectSampleQuestion(q)}
                      className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800/60 transition-all font-sans leading-snug group flex items-center gap-1.5"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Input Box Form WITH "+" DOCUMENT UPLOAD BUTTON */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900/95 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          {/* THE "+" UPLOAD BUTTON (STRICTLY PDF & DOCX ONLY) */}
          <UploadMenu
            onFileSelected={onFileUpload}
            disabled={isLoading}
          />

          {/* Text Input */}
          <div className="relative flex-1 flex items-center">
            <input
              id="query-input-field"
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={
                activeMode === 'ask'
                  ? regionContext
                    ? 'Ask about this selected region...'
                    : 'Ask any question (business, technical, revenue, charts)...'
                  : 'Enter exact keyword to locate occurrences...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
              disabled={isLoading}
            />

            <button
              id="submit-query-btn"
              type="submit"
              disabled={!queryInput.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20"
              title={activeMode === 'ask' ? 'Ask Question' : 'Search Keyword'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : activeMode === 'ask' ? (
                <Send className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>English • தமிழ் • Tanglish Supported</span>
          </span>
          <span className="font-mono">
            Click <strong className="text-cyan-400 font-bold">+</strong> to upload PDF or Word
          </span>
        </div>
      </form>
    </div>
  );
};
