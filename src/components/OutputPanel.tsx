import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Info } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { cn } from '../lib/utils';

export const OutputPanel: React.FC = () => {
  const { outputText, isStreaming, selectedAction, outputLength, sourceHighlights, error } = useSynthlyStore();

  if (!outputText && !isStreaming && !error) return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border-l-4 border-[var(--color-primary)] shadow-[var(--shadow-card)] p-6 space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-[12px] rounded-full font-medium capitalize">
            {selectedAction?.replace('-', ' ')}
          </span>
          <span className="px-3 py-1 border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] text-[12px] rounded-full font-medium capitalize">
            {outputLength}
          </span>
        </div>
        {isStreaming && <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />}
      </div>

      {error && error !== 'empty-input' && (
        <div className="p-4 bg-[var(--color-error)] text-red-100 rounded-lg border border-red-900/20">
          {error}
        </div>
      )}

      <div className="markdown-body text-[var(--font-size-output)] leading-[1.7] text-[var(--color-text-primary)]">
        <Markdown remarkPlugins={[remarkGfm]}>
          {outputText}
        </Markdown>
        {isStreaming && <span className="inline-block w-[2px] h-[1.2em] bg-[var(--color-primary)] ml-1 animate-blink align-middle" />}
      </div>

      {sourceHighlights.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
          <label className="text-[var(--color-text-secondary)] text-[12px] uppercase font-bold">
            From your text:
          </label>
          <div className="flex flex-wrap gap-2">
            {sourceHighlights.map((highlight, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[var(--color-highlight)] text-[#92400E] dark:text-amber-200 text-sm font-medium rounded-md max-w-[300px] overflow-hidden text-overflow-ellipsis whitespace-nowrap"
                title={highlight}
              >
                "{highlight}"
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)] text-[var(--color-text-secondary)] text-[12px] italic">
        <Info className="w-3.5 h-3.5" />
        <span>AI output may miss nuance in technical or legal text. Review before sharing.</span>
      </div>
    </div>
  );
};
