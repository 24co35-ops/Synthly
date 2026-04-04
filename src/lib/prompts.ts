import { ProcessRequest } from '../types';

export function getPrompt(req: ProcessRequest): string {
  const { text, action, tone, length } = req;
  
  const lengthInstructions: Record<string, string> = {
    short: "Respond in 2–4 sentences or 3–5 bullet points maximum.",
    balanced: "Respond with moderate depth — enough to cover key points clearly.",
    detailed: "Respond comprehensively. Preserve nuance and cover all key points.",
  };

  const lengthInstruction = lengthInstructions[length];

  const prompts: Record<string, string> = {
    summarize: `Summarize the following text as a concise prose paragraph. Focus on the main argument and most important points. Do not include minor details. ${lengthInstruction}\n\nText:\n${text}`,
    bullets: `Extract the key points from the following text as a clean markdown bullet list. Each bullet should be a complete, standalone point. ${lengthInstruction}\n\nText:\n${text}`,
    'action-items': `Extract all action items, tasks, decisions, and follow-ups from the following text. Format as a markdown bullet list. Each item should start with an action verb. If no action items exist, respond with: "No action items found in this text." ${lengthInstruction}\n\nText:\n${text}`,
    questions: `Extract all open questions, unknowns, and follow-up questions from the following text. Include both explicit questions and implied ones. Format as a numbered markdown list. If no questions are found, say so clearly. ${lengthInstruction}\n\nText:\n${text}`,
    'rewrite-tone': `Rewrite the following text in a ${tone} tone. Preserve all meaning, facts, and key points. Do not add or remove information. ${lengthInstruction}\n\nTone definitions:\n- formal: professional, precise, no contractions, structured\n- casual: conversational, warm, contractions allowed, approachable\n- simplified: plain language, short sentences, no jargon, accessible to all readers\n- professional: clear, confident, business-appropriate, action-oriented\n\nText:\n${text}`,
  };

  return prompts[action];
}
