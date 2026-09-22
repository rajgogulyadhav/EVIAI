import React from 'react';
import { Search, FileText, CheckCircle, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { SearchResponse, SearchMatch } from '../types/index.js';

interface SearchResultsProps {
  results: SearchResponse;
  onSelectMatch: (match: SearchMatch) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSelectMatch,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Search status message */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
        {results.exactMatches.length > 0 ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : results.semanticMatches.length > 0 ? (
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        )}
        <p className="text-slate-300 font-sans leading-relaxed">{results.message}</p>
      </div>

      {/* Exact Matches */}
      {results.exactMatches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              Exact Keyword Matches ({results.exactMatches.length})
            </span>
          </div>
          <div className="space-y-2">
            {results.exactMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono">
                      Page {match.pageNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                      {match.section}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">100% Match</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 italic">
                  "{match.snippet}"
                </p>
                <div className="mt-2 flex items-center justify-end text-[10px] text-slate-500 group-hover:text-emerald-400 font-mono transition-colors">
                  <span className="flex items-center gap-1">
                    Jump to Page {match.pageNumber} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semantic Matches */}
      {results.semanticMatches.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              Semantically Related Matches ({results.semanticMatches.length})
            </span>
          </div>
          <div className="space-y-2">
            {results.semanticMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono">
                      Page {match.pageNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                      {match.section}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {match.relevanceScore}% Related
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                  "{match.snippet}"
                </p>
                <div className="mt-2 flex items-center justify-end text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono transition-colors">
                  <span className="flex items-center gap-1">
                    Jump to Page {match.pageNumber} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
