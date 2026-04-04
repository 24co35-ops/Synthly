import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[var(--color-lock-tint)] text-teal-800 dark:text-teal-100 p-4 rounded-xl flex items-center justify-between mb-6 border border-teal-100 dark:border-teal-900/30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--color-surface)] rounded-lg shadow-sm">
          <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h4 className="font-bold text-[14px]">Privacy mode is active</h4>
          <p className="text-[12px] opacity-80">Your text is processed securely and never stored on our servers.</p>
        </div>
      </div>
      <button onClick={() => setVisible(false)} className="p-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
