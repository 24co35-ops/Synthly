import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActionType, ToneType, LengthType, HistoryEntry } from '../types';

interface SynthlyState {
  // Input
  inputText: string;
  setInputText: (text: string) => void;
  clearInput: () => void;

  // Action selection
  selectedAction: ActionType | null;
  setSelectedAction: (action: ActionType) => void;
  selectedTone: ToneType;
  setSelectedTone: (tone: ToneType) => void;

  // Length
  outputLength: LengthType;
  setOutputLength: (length: LengthType) => void;

  // Output
  outputText: string;
  setOutputText: (text: string) => void;
  appendOutputText: (chunk: string) => void;
  clearOutput: () => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  sourceHighlights: string[];
  setSourceHighlights: (highlights: string[]) => void;

  // Chunk Progress
  currentChunk: number;
  totalChunks: number;
  setChunkProgress: (current: number, total: number) => void;

  // History
  history: HistoryEntry[];
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;

  // UI state
  isHistoryOpen: boolean;
  toggleHistory: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isCompareMode: boolean;
  toggleCompareMode: () => void;

  // Error
  error: string | null;
  setError: (msg: string | null) => void;
}

export const useSynthlyStore = create<SynthlyState>()(
  persist(
    (set) => ({
      inputText: '',
      setInputText: (text) => set({ inputText: text }),
      clearInput: () => set({ inputText: '' }),

      selectedAction: null,
      setSelectedAction: (action) => set({ selectedAction: action }),
      selectedTone: 'professional',
      setSelectedTone: (tone) => set({ selectedTone: tone }),

      outputLength: 'balanced',
      setOutputLength: (length) => set({ outputLength: length }),

      outputText: '',
      setOutputText: (text) => set({ outputText: text }),
      appendOutputText: (chunk) => set((state) => ({ outputText: state.outputText + chunk })),
      clearOutput: () => set({ outputText: '', sourceHighlights: [], currentChunk: 0, totalChunks: 0 }),
      isStreaming: false,
      setIsStreaming: (val) => set({ isStreaming: val }),
      sourceHighlights: [],
      setSourceHighlights: (highlights) => set({ sourceHighlights: highlights }),

      currentChunk: 0,
      totalChunks: 0,
      setChunkProgress: (current, total) => set({ currentChunk: current, totalChunks: total }),

      history: [],
      addToHistory: (entry) => set((state) => ({ 
        history: [entry, ...state.history].slice(0, 20) 
      })),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((e) => e.id !== id)
      })),

      isHistoryOpen: false,
      toggleHistory: () => set((state) => ({ isHistoryOpen: !state.isHistoryOpen })),
      isSettingsOpen: false,
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      privacyMode: true,
      togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      isCompareMode: false,
      toggleCompareMode: () => set((state) => ({ isCompareMode: !state.isCompareMode })),

      error: null,
      setError: (msg) => set({ error: msg }),
    }),
    {
      name: 'synthly-prefs',
      partialize: (state) => ({
        privacyMode: state.privacyMode,
        outputLength: state.outputLength,
        selectedAction: state.selectedAction,
        selectedTone: state.selectedTone,
        theme: state.theme,
      }),
    }
  )
);
