import diffMatchPatch from 'diff-match-patch';

const dmp = new diffMatchPatch();

export function extractHighlights(inputText: string, outputText: string): string[] {
  // Strip markdown (basic version)
  const plainOutput = outputText.replace(/[#*`_~\[\]()]/g, '');
  
  // Split into sentences
  const sentences = plainOutput.split(/[.?!]\s+/).filter(s => s.length > 20);
  
  const highlights: string[] = [];
  
  sentences.forEach(sentence => {
    const results = dmp.match_main(inputText, sentence, 0);
    if (results !== -1) {
      const match = inputText.substring(results, results + sentence.length);
      if (match.length > 15) {
        highlights.push(match);
      }
    }
  });

  // Deduplicate and return top 3-5
  return Array.from(new Set(highlights)).slice(0, 5);
}
