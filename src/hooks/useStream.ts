import { useState, useCallback, useRef } from 'react';
import { ProcessRequest } from '../types';
import { getPrompt } from '../lib/prompts';
import { chunkText } from '../lib/utils';
import { useSynthlyStore } from '../store/useSynthlyStore';

interface UseStreamOptions {
  onChunk: (chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
}

async function streamFromServer(
  prompt: string,
  onChunk: (text: string) => void,
  abortRef: { current: boolean }
): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({ error: 'stream failed' }));
    throw new Error(err.error || 'stream failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done || abortRef.current) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return result;
      try {
        const parsed = JSON.parse(payload);
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.text) {
          result += parsed.text;
          onChunk(parsed.text);
        }
      } catch (e: any) {
        throw new Error(e.message || 'parse error');
      }
    }
  }

  return result;
}

export function useStream(options: UseStreamOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<boolean>(false);
  const setChunkProgress = useSynthlyStore((state) => state.setChunkProgress);

  const startStream = useCallback(async (body: ProcessRequest) => {
    setIsStreaming(true);
    abortControllerRef.current = false;

    try {
      const chunks = await chunkText(body.text);
      let fullMergedResult = '';
      const totalSteps = chunks.length + (chunks.length > 1 && body.action === 'summarize' ? 1 : 0);
      let currentStep = 0;

      setChunkProgress(0, totalSteps);

      if (chunks.length > 1) {
        options.onChunk(`*Processing text in ${chunks.length} sections...*\n\n---\n\n`);
      }

      for (let i = 0; i < chunks.length; i++) {
        if (abortControllerRef.current) break;

        currentStep++;
        setChunkProgress(currentStep, totalSteps);

        const chunkPrompt = getPrompt({ ...body, text: chunks[i] });
        const chunkResult = await streamFromServer(chunkPrompt, options.onChunk, abortControllerRef);

        fullMergedResult += chunkResult + '\n\n';

        if (i < chunks.length - 1 && !abortControllerRef.current) {
          options.onChunk('\n\n---\n\n');
        }
      }

      if (!abortControllerRef.current) {
        if (chunks.length > 1 && body.action === 'summarize') {
          options.onChunk('\n\n---\n\n*Generating final summary...*\n\n');

          const finalPrompt = `Summarize the following section-by-section summaries into one cohesive final summary. Maintain the requested ${body.length} depth.\n\nSummaries:\n${fullMergedResult}`;
          const finalResult = await streamFromServer(finalPrompt, options.onChunk, abortControllerRef);
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
