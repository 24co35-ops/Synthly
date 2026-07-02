import React from 'react';
import { Lock, LockOpen, Clock, Settings, Moon, Sun } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';

export const Navbar: React.FC = () => {
  const { privacyMode, togglePrivacyMode, toggleHistory, toggleSettings, theme, toggleTheme } = useSynthlyStore();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] h-[56px] transition-colors duration-300">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-[var(--color-primary)] text-[20px]">Synthly</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 text-[var(--color-text-secondary)]"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          id="privacy-toggle-btn"
          onClick={togglePrivacyMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
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
          id="history-toggle-btn"
          onClick={toggleHistory}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 text-[var(--color-text-secondary)]"
          aria-label="View History"
        >
          <Clock className="w-5 h-5" />
        </button>

        <button
          id="settings-toggle-btn"
          onClick={toggleSettings}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 text-[var(--color-text-secondary)]"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
