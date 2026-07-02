import React from 'react';
import { X, Clock, Trash2, RotateCcw } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export const HistoryDrawer: React.FC = () => {
  const { isHistoryOpen, toggleHistory, history, clearHistory, removeFromHistory, setInputText, setOutputText, setSourceHighlights } = useSynthlyStore();

  if (!isHistoryOpen) return null;

  const handleRestore = (entry: any) => {
    setInputText(entry.fullInput);
    setOutputText(entry.output);
    setSourceHighlights(entry.highlights);
    toggleHistory();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={toggleHistory} />
      
      <div className="relative w-[380px] h-full bg-[var(--color-surface)] shadow-2xl flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold">History</h2>
          <button onClick={toggleHistory} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
              <Clock className="w-8 h-8" />
              <p>No saved outputs yet</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="group p-4 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[var(--color-primary)] text-[10px] font-bold uppercase rounded">
                    {entry.action}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {formatDistanceToNow(new Date(entry.timestamp))} ago
                  </span>
                </div>
                
                <p className="text-[13px] text-[var(--color-text-secondary)] italic line-clamp-1">
                  "{entry.inputPreview}..."
                </p>
                
                <p className="text-[14px] text-[var(--color-text-primary)] line-clamp-2">
                  {entry.output}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleRestore(entry)}
                    className="flex items-center gap-1 text-[var(--color-primary)] text-[13px] font-semibold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>
                  <button
                    onClick={() => removeFromHistory(entry.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-[var(--color-border)]">
            <button
              id="clear-history-btn"
              onClick={clearHistory}
              className="w-full py-2.5 text-gray-500 hover:text-red-500 text-[14px] font-medium transition-colors duration-300"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
