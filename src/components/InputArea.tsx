import React, { useState, useEffect, useCallback } from 'react';
import { Lock, AlertTriangle, X, Info } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { detectPII } from '../lib/piiDetector';
import { getWordCount, cn } from '../lib/utils';

export const InputArea: React.FC = () => {
  const { inputText, setInputText, clearInput, privacyMode, error } = useSynthlyStore();
  const [piiInfo, setPiiInfo] = useState<{ hasPII: boolean; types: string[] }>({ hasPII: false, types: [] });
  const [showPiiBanner, setShowPiiBanner] = useState(false);

  const wordCount = getWordCount(inputText);
  const charCount = inputText.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      const info = detectPII(inputText);
      setPiiInfo(info);
      if (info.hasPII && privacyMode) {
        setShowPiiBanner(true);
      } else {
        setShowPiiBanner(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, privacyMode]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your text here — an article, note, email, meeting transcript, or any content you want to process."
          className={cn(
            "w-full min-h-[200px] p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-[var(--font-size-body)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 resize-y transition-all",
            privacyMode && "border-2 border-teal-200",
            error === 'empty-input' && "animate-shake"
          )}
          aria-label="Input text"
          aria-describedby="word-count-info"
        />
        {privacyMode && (
          <div className="absolute bottom-4 right-4">
            <Lock className="w-3 h-3 text-teal-500" />
          </div>
        )}
      </div>

      {showPiiBanner && (
        <div className="flex items-center justify-between p-3 bg-[var(--color-pii-warning)] text-orange-900 dark:text-orange-100 rounded-[var(--radius-md)] animate-slide-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[13px] font-medium">
              Heads up — we detected {piiInfo.types.join(', ')} in your text. Review before processing.
            </span>
          </div>
          <button onClick={() => setShowPiiBanner(false)} className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {charCount > 50000 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-[var(--radius-md)]">
          <Info className="w-4 h-4" />
          <span className="text-[13px]">Long text will be processed in sections and merged automatically.</span>
        </div>
      )}

      <div id="word-count-info" className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[var(--color-text-secondary)] text-[13px]">
            {wordCount} words · {charCount} chars
          </span>
          {wordCount > 0 && wordCount < 30 && (
            <span className="text-[var(--color-text-secondary)] text-[13px] italic">
              This text is very short — results may be limited
            </span>
          )}
        </div>
        {inputText && (
          <button
            onClick={clearInput}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[13px] font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
