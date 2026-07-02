import React from 'react';
import { AlignLeft, List, CheckSquare, HelpCircle, Pencil } from 'lucide-react';
import { useSynthlyStore } from '../store/useSynthlyStore';
import { ActionType, ToneType } from '../types';
import { cn } from '../lib/utils';

const ACTIONS: { id: ActionType; label: string; icon: any }[] = [
  { id: 'summarize', label: 'SUMMARIZE', icon: AlignLeft },
  { id: 'bullets', label: 'BULLETS', icon: List },
  { id: 'action-items', label: 'ACTION ITEMS', icon: CheckSquare },
  { id: 'questions', label: 'QUESTIONS', icon: HelpCircle },
  { id: 'rewrite-tone', label: 'REWRITE TONE', icon: Pencil },
];

const TONES: { id: ToneType; label: string }[] = [
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
  { id: 'simplified', label: 'Simplified' },
  { id: 'professional', label: 'Professional' },
];

export const ActionBar: React.FC = () => {
  const { selectedAction, setSelectedAction, selectedTone, setSelectedTone } = useSynthlyStore();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 w-full">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isSelected = selectedAction === action.id;
          return (
            <button
              id={`action-${action.id}`}
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-[40px] rounded-lg border text-[13px] font-medium tracking-wider transition-all duration-300",
                isSelected
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
              aria-label={action.label}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{action.label}</span>
            </button>
          );
        })}
      </div>

      {selectedAction === 'rewrite-tone' && (
        <div className="flex justify-center gap-2 overflow-hidden animate-slide-up">
          {TONES.map((tone) => (
            <button
              id={`tone-${tone.id}`}
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              className={cn(
                "px-4 py-1.5 h-[28px] rounded-full border text-[13px] transition-all duration-300",
                selectedTone === tone.id
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
              )}
            >
              {tone.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
