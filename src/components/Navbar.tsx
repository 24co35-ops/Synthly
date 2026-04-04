import React from 'react';
import { Lock, LockOpen, Clock, Settings, Moon, Sun } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';

export const Navbar: React.FC = () => {
  const { privacyMode, togglePrivacyMode, toggleHistory, toggleSettings, theme, toggleTheme } = useSynthlyStore();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] h-[56px] transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[var(--color-primary)] text-[20px]">Synthly</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[var(--color-text-secondary)]"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          onClick={togglePrivacyMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle Privacy Mode"
        >
          {privacyMode ? (
            <>
              <Lock className="w-4 h-4 text-teal-500" />
              <span className="text-[var(--color-text-secondary)] text-[13px] font-medium">Private</span>
            </>
          ) : (
            <>
              <LockOpen className="w-4 h-4 text-gray-400" />
              <span className="text-[var(--color-text-secondary)] text-[13px] font-medium">Public</span>
            </>
          )}
        </button>

        <button
          onClick={toggleHistory}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-text-secondary)]"
          aria-label="View History"
        >
          <Clock className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSettings}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-text-secondary)]"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
