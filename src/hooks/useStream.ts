import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProcessRequest } from '../types';
import { getPrompt } from '../lib/prompts';
import { chunkText } from '../lib/utils';

interface UseStreamOptions {
  onChunk: (chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export function useStream(options: UseStreamOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<boolean>(false);

  const startStream = useCallback(async (body: ProcessRequest) => {
    setIsStreaming(true);
    abortControllerRef.current = false;

    try {
      const chunks = await chunkText(body.text);
      let fullMergedResult = '';

      if (chunks.length > 1) {
        options.onChunk(`*Processing text in ${chunks.length} sections...*\n\n---\n\n`);
      }

      for (let i = 0; i < chunks.length; i++) {
        if (abortControllerRef.current) break;

        const chunkPrompt = getPrompt({ ...body, text: chunks[i] });
        
        const response = await ai.models.generateContentStream({
          model: "gemini-1.5-flash",
          contents: chunkPrompt,
        });

        let chunkResult = '';
        for await (const chunk of response) {
          if (abortControllerRef.current) break;
          const text = chunk.text || "";
          chunkResult += text;
          options.onChunk(text);
        }

        fullMergedResult += chunkResult + '\n\n';
        
        if (i < chunks.length - 1 && !abortControllerRef.current) {
          options.onChunk('\n\n---\n\n');
        }
      }

      if (!abortControllerRef.current) {
        // If we have multiple chunks and it's a summary, we might want to do a final summary
        // But for MVP, simple concatenation with separators is often enough and saves tokens.
        // The PRD mentions "merged hierarchically", which implies a final pass.
        // Let's implement a simple hierarchical merge for 'summarize' only if there were multiple chunks.
        
        if (chunks.length > 1 && body.action === 'summarize') {
          options.onChunk('\n\n---\n\n*Generating final summary...*\n\n');
          
          const finalPrompt = `Summarize the following section-by-section summaries into one cohesive final summary. Maintain the requested ${body.length} depth.\n\nSummaries:\n${fullMergedResult}`;
          
          const finalResponse = await ai.models.generateContentStream({
            model: "gemini-1.5-flash",
            contents: finalPrompt,
          });

          let finalResult = '';
          for await (const chunk of finalResponse) {
            if (abortControllerRef.current) break;
            const text = chunk.text || "";
            finalResult += text;
            options.onChunk(text);
          }
          fullMergedResult = finalResult;
        }

        options.onComplete(fullMergedResult);
      }
    } catch (error: any) {
      options.onError(error.message || 'An error occurred');
    } finally {
      setIsStreaming(false);
    }
  }, [options]);

  const cancelStream = useCallback(() => {
    abortControllerRef.current = true;
    setIsStreaming(false);
  }, []);

  return {
    startStream,
    cancelStream,
    isStreaming,
  };
}
