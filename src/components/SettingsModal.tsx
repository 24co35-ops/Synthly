import React from 'react';
import { X } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { LengthSelector } from './LengthSelector';
import { ActionType } from '../types';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, privacyMode, togglePrivacyMode, selectedAction, setSelectedAction } = useSynthlyStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={toggleSettings} />
      
      <div className="relative w-full max-w-[480px] bg-[var(--color-surface)] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-[13px] text-gray-500">Customize your Synthly experience</p>
          </div>
          <button onClick={toggleSettings} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-[14px] font-semibold">Privacy Mode</label>
              <p className="text-[12px] text-gray-500">Keep text private by default. Your text is processed only for this request and not stored.</p>
            </div>
            <button
              id="settings-privacy-toggle"
              onClick={togglePrivacyMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${privacyMode ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold">Default Action</label>
            <p className="text-[12px] text-gray-500">Default action when you open Synthly</p>
            <select
              id="settings-default-action"
              value={selectedAction || ''}
              onChange={(e) => setSelectedAction(e.target.value as ActionType)}
              className="w-full p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
            >
              <option value="summarize">Summarize</option>
              <option value="bullets">Bullets</option>
              <option value="action-items">Action Items</option>
              <option value="questions">Questions</option>
              <option value="rewrite-tone">Rewrite Tone</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold">Preferred output length</label>
            <LengthSelector />
          </div>
        </div>

        <div className="p-6 bg-[var(--color-bg)] flex justify-end gap-3 transition-colors duration-300">
          <button id="cancel-settings-btn" onClick={toggleSettings} className="px-4 py-2 text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300">
            Cancel
          </button>
          <button id="save-settings-btn" onClick={toggleSettings} className="px-4 py-2 text-[14px] font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] rounded-lg transition-all duration-300">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
