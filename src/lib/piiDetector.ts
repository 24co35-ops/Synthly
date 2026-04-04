export function detectPII(text: string): { hasPII: boolean; types: string[] } {
  const patterns = [
    { label: "email address", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { label: "phone number", regex: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g },
    { label: "SSN", regex: /\d{3}-\d{2}-\d{4}/g },
    { label: "credit card number", regex: /\b(?:\d[ -]*?){13,16}\b/g },
    { label: "IP address", regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  ];

  const detectedTypes = new Set<string>();
  let hasPII = false;

  patterns.forEach(({ label, regex }) => {
    if (regex.test(text)) {
      hasPII = true;
      detectedTypes.add(label);
    }
  });

  return {
    hasPII,
    types: Array.from(detectedTypes),
  };
}
