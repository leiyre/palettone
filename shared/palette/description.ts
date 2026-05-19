export const MAX_PROMPT_LENGTH = 500;

export function validatePaletteDescription(rawText: string): string {
  const text = rawText.trim();
  if (!text) {
    throw new Error("Text is required");
  }
  if (text.length > MAX_PROMPT_LENGTH) {
    throw new Error(`Text exceeds the maximum length (${MAX_PROMPT_LENGTH})`);
  }
  return text;
}
