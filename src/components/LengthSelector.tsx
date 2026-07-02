import React from 'react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { LengthType } from '../types';
import { cn } from '../lib/utils';

const LENGTHS: { id: LengthType; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'detailed', label: 'Detailed' },
];

export const LengthSelector: React.FC = () => {
  const { outputLength, setOutputLength } = useSynthlyStore();

  return (
    <div className="space-y-2">
      <label className="text-[var(--color-text-secondary)] text-[12px] uppercase tracking-wide">
        Output Length
      </label>
      <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden w-full max-w-sm">
        {LENGTHS.map((len, index) => (
          <React.Fragment key={len.id}>
            <button
              id={`length-${len.id}`}
              onClick={() => setOutputLength(len.id)}
              className={cn(
                "flex-1 h-[36px] text-[13px] transition-all duration-300",
                outputLength === len.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {len.label}
            </button>
            {index < LENGTHS.length - 1 && (
              <div className="w-[1px] bg-[var(--color-border)]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
