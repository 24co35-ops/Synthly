import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProcessRequest } from '../types';
import { getPrompt } from '../lib/prompts';

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
      const prompt = getPrompt(body);
      
      const response = await ai.models.generateContentStream({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
      });

      let fullText = '';

      for await (const chunk of response) {
        if (abortControllerRef.current) break;
        const text = chunk.text || "";
        fullText += text;
        options.onChunk(text);
      }

      if (!abortControllerRef.current) {
        options.onComplete(fullText);
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
