export type ActionType =
  | 'summarize'
  | 'bullets'
  | 'action-items'
  | 'questions'
  | 'rewrite-tone';

export type ToneType = 'formal' | 'casual' | 'simplified' | 'professional';

export type LengthType = 'short' | 'balanced' | 'detailed';

export interface HistoryEntry {
  id: string;
  action: ActionType;
  tone?: ToneType;
  length: LengthType;
  inputPreview: string;
  fullInput: string;
  output: string;
  highlights: string[];
  timestamp: string; // ISO string
}

export interface ProcessRequest {
  text: string;
  action: ActionType;
  tone?: ToneType;
  length: LengthType;
  isChunk?: boolean;
}
