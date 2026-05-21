import React, { useCallback } from 'react';
import { Zap, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Navbar } from './components/Navbar';
import { InputArea } from './components/InputArea';
import { ActionBar } from './components/ActionBar';
import { LengthSelector } from './components/LengthSelector';
import { OutputPanel } from './components/OutputPanel';
import { OutputControls } from './components/OutputControls';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyBanner } from './components/PrivacyBanner';
import { useSynthlyStore } from './store/useSynthlyStore';
import { useStream } from './hooks/useStream';
import { extractHighlights } from './lib/highlighter';
import { cn } from './lib/utils';

export default function App() {
  const {
    inputText,
    selectedAction,
    selectedTone,
    outputLength,
    outputText,
    setOutputText,
    appendOutputText,
    clearOutput,
    isStreaming,
    setIsStreaming,
    setSourceHighlights,
    setError,
    privacyMode,
    addToHistory,
  } = useSynthlyStore();

  const onChunk = useCallback((chunk: string) => {
    appendOutputText(chunk);
  }, [appendOutputText]);

  const onComplete = useCallback((fullText: string) => {
    setIsStreaming(false);
    const highlights = extractHighlights(inputText, fullText);
    setSourceHighlights(highlights);

    // Auto-save to history
    if (selectedAction) {
      addToHistory({
        id: nanoid(),
        action: selectedAction,
        tone: selectedTone,
        length: outputLength,
        inputPreview: inputText.slice(0, 80),
        fullInput: inputText,
        output: fullText,
        highlights: highlights,
        timestamp: new Date().toISOString(),
      });
    }
  }, [inputText, setIsStreaming, setSourceHighlights, selectedAction, selectedTone, outputLength, addToHistory]);

  const onError = useCallback((message: string) => {
    setIsStreaming(false);
    setError(message);
  }, [setIsStreaming, setError]);

  const { startStream, cancelStream } = useStream({
    onChunk,
    onComplete,
    onError,
  });

  const handleRun = useCallback(async () => {
    if (!inputText.trim()) {
      setError('empty-input');
      setTimeout(() => setError(null), 400);
      return;
    }

    if (!selectedAction) return;

    clearOutput();
    setError(null);
    setIsStreaming(true);

    await startStream({
      text: inputText,
      action: selectedAction,
      tone: selectedTone,
      length: outputLength,
    });
  }, [inputText, selectedAction, selectedTone, outputLength, clearOutput, setError, setIsStreaming, startStream]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isStreaming) handleRun();
      }
      if (e.key === 'Escape') {
        if (isStreaming) cancelStream();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, isStreaming, cancelStream]);

  React.useEffect(() => {
    const handleRegenerate = () => handleRun();
    window.addEventListener('synthly-regenerate', handleRegenerate);
    return () => window.removeEventListener('synthly-regenerate', handleRegenerate);
  }, [handleRun]);

  const actionLabel = selectedAction ? selectedAction.replace('-', ' ').toUpperCase() : '';
  const theme = useSynthlyStore((state) => state.theme);

  return (
    <div className={cn("min-h-screen bg-[var(--color-bg)] transition-colors duration-300", theme === 'dark' && "dark")}>
      <Navbar />
      
      <main className="max-w-[800px] mx-auto px-4 pt-[88px] pb-24">
        {privacyMode && <PrivacyBanner />}
        
        <InputArea />
        
        <div className="mt-4">
          <ActionBar />
        </div>
        
        <div className="mt-6">
          <LengthSelector />
        </div>
        
        <div className="mt-8 text-right">
          <button
            onClick={isStreaming ? cancelStream : handleRun}
            disabled={!inputText.trim() || !selectedAction}
            className={cn(
              "w-full h-[48px] rounded-[var(--radius-lg)] flex items-center justify-center gap-2 text-white font-bold transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
              isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
            )}
          >
            {isStreaming ? (
              <>
                <X className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run · {actionLabel || 'Select Action'}
              </>
            )}
          </button>
        </div>
        
        <div className="mt-8 space-y-6">
          <OutputPanel />
          {outputText && !isStreaming && <OutputControls />}
        </div>
      </main>

      <HistoryDrawer />
      <SettingsModal />
    </div>
  );
}
