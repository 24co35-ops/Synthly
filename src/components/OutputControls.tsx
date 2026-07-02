import React, { useState } from 'react';
import { Copy, Download, Bookmark, RefreshCw, Check } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { downloadText } from '../lib/utils';
import { nanoid } from 'nanoid';

export const OutputControls: React.FC = () => {
  const { outputText, isStreaming, inputText, selectedAction, selectedTone, outputLength, sourceHighlights, addToHistory, history } = useSynthlyStore();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const isAlreadySaved = history.some(h => h.output === outputText);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'md') => {
    const filename = `synthly-output-${new Date().toISOString().split('T')[0]}.${format}`;
    downloadText(filename, outputText);
  };

  const handleSave = () => {
    if (isAlreadySaved) return;
    
    addToHistory({
      id: nanoid(),
      action: selectedAction!,
      tone: selectedTone,
      length: outputLength,
      inputPreview: inputText.slice(0, 80),
      fullInput: inputText,
      output: outputText,
      highlights: sourceHighlights,
      timestamp: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRegenerate = () => {
    if (isStreaming) return;
    // We need to trigger the run logic from App.tsx
    // Since we don't have a direct way to trigger it, we'll use a custom event or just export the function
    // For simplicity, let's just dispatch a custom event
    window.dispatchEvent(new CustomEvent('synthly-regenerate'));
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        id="copy-btn"
        onClick={handleCopy}
        disabled={isStreaming}
        className="flex items-center gap-1.5 px-3 h-[36px] border border-[var(--color-border)] rounded-lg text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all duration-300"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied' : 'Copy'}
      </button>

      <div className="relative group">
        <button
          id="download-btn"
          disabled={isStreaming}
          className="flex items-center gap-1.5 px-3 h-[36px] border border-[var(--color-border)] rounded-lg text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-10">
          <button id="download-txt-btn" onClick={() => handleDownload('txt')} className="w-full px-4 py-2 text-left text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800">.txt</button>
          <button id="download-md-btn" onClick={() => handleDownload('md')} className="w-full px-4 py-2 text-left text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800">.md</button>
        </div>
      </div>

      <button
        id="save-btn"
        onClick={handleSave}
        disabled={isStreaming || isAlreadySaved}
        className="flex items-center gap-1.5 px-3 h-[36px] border border-[var(--color-border)] rounded-lg text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all duration-300"
      >
        <Bookmark className={isAlreadySaved ? "w-4 h-4 fill-current text-[var(--color-primary)]" : "w-4 h-4"} />
        {saved ? 'Saved' : isAlreadySaved ? 'Saved' : 'Save'}
      </button>

      <button
        id="regenerate-btn"
        onClick={handleRegenerate}
        disabled={isStreaming}
        className="flex items-center gap-1.5 px-3 h-[36px] border border-[var(--color-border)] rounded-lg text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all duration-300"
      >
        <RefreshCw className="w-4 h-4" />
        Regenerate
      </button>
    </div>
  );
};
