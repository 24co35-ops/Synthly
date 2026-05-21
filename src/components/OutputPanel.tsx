import React, { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Info, Columns, Layout, Clock, BarChart3, Copy } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { cn, getWordCount } from '../lib/utils';

export const OutputPanel: React.FC = () => {
  const { 
    outputText, 
    isStreaming, 
    selectedAction, 
    outputLength, 
    sourceHighlights, 
    error,
    currentChunk,
    totalChunks,
    isCompareMode,
    toggleCompareMode,
    inputText
  } = useSynthlyStore();

  const readingStats = useMemo(() => {
    if (!outputText) return null;
    const words = getWordCount(outputText);
    const minutes = Math.ceil(words / 200);
    const originalWords = getWordCount(inputText);
    const ratio = originalWords > 0 ? Math.round((words / originalWords) * 100) : 0;
    return { minutes, ratio };
  }, [outputText, inputText]);

  if (!outputText && !isStreaming && !error) return null;

  const progress = totalChunks > 0 ? (currentChunk / totalChunks) * 100 : 0;

  const handleCopyHighlight = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border-l-4 border-[var(--color-primary)] shadow-[var(--shadow-card)] overflow-hidden animate-slide-up">
      {/* Progress Bar */}
      {isStreaming && totalChunks > 1 && (
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-[12px] rounded-full font-medium capitalize">
                {selectedAction?.replace('-', ' ')}
              </span>
              <span className="px-3 py-1 border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] text-[12px] rounded-full font-medium capitalize">
                {outputLength}
              </span>
            </div>
            {selectedAction === 'rewrite-tone' && outputText && (
              <button
                onClick={toggleCompareMode}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-all",
                  isCompareMode 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--color-text-secondary)]"
                )}
              >
                {isCompareMode ? <Layout className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
                {isCompareMode ? 'Focus View' : 'Compare Original'}
              </button>
            )}
          </div>
          {isStreaming && (
            <div className="flex items-center gap-2">
              {totalChunks > 1 && (
                <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase">
                  Step {currentChunk} of {totalChunks}
                </span>
              )}
              <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
            </div>
          )}
        </div>

        {error && error !== 'empty-input' && (
          <div className="p-4 bg-[var(--color-error)] text-red-100 rounded-lg border border-red-900/20">
            {error}
          </div>
        )}

        <div className={cn(
          "grid gap-8 transition-all duration-500",
          isCompareMode && selectedAction === 'rewrite-tone' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          {isCompareMode && selectedAction === 'rewrite-tone' && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-[var(--color-border)] opacity-80">
              <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Original Text</label>
              <div className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap">
                {inputText}
              </div>
            </div>
          )}

          <div className={cn(
            "markdown-body text-[var(--font-size-output)] leading-[1.7] text-[var(--color-text-primary)]",
            selectedAction === 'action-items' && "action-items-list"
          )}>
            <Markdown 
              remarkPlugins={[remarkGfm]}
              components={{
                li: ({ children, ...props }) => {
                  if (selectedAction === 'action-items') {
                    return (
                      <li className="flex items-start gap-3 list-none mb-3 group cursor-pointer" {...props}>
                        <div className="mt-1 flex-shrink-0">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" />
                        </div>
                        <span className="group-hover:text-[var(--color-primary)] transition-colors">{children}</span>
                      </li>
                    );
                  }
                  return <li {...props}>{children}</li>;
                }
              }}
            >
              {outputText}
            </Markdown>
            {isStreaming && <span className="inline-block w-[2px] h-[1.2em] bg-[var(--color-primary)] ml-1 animate-blink align-middle" />}
          </div>
        </div>

        {readingStats && !isStreaming && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-[12px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingStats.minutes} min read</span>
            </div>
            {selectedAction === 'summarize' && (
              <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-[12px]">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{readingStats.ratio}% of original size</span>
              </div>
            )}
          </div>
        )}

        {sourceHighlights.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
            <label className="text-[var(--color-text-secondary)] text-[11px] uppercase font-bold tracking-wider">
              Key Evidence From Source:
            </label>
            <div className="flex flex-wrap gap-2">
              {sourceHighlights.map((highlight, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyHighlight(highlight)}
                  className="group relative flex items-center gap-2 px-3 py-1.5 bg-[var(--color-highlight)] text-[#92400E] dark:text-amber-200 text-[13px] font-medium rounded-lg hover:brightness-95 transition-all text-left max-w-full"
                  title="Click to copy source text"
                >
                  <span className="line-clamp-2 italic">"{highlight}"</span>
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)] text-[var(--color-text-secondary)] text-[12px] italic">
          <Info className="w-3.5 h-3.5" />
          <span>AI output may miss nuance in technical or legal text. Review before sharing.</span>
        </div>
      </div>
    </div>
  );
};
