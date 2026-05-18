export const MAX_PROMPT_LENGTH = 500;

export function validatePaletteDescription(rawText: string): string {
  const text = rawText.trim();
  if (!text) {
    throw new Error("Text is required");
  }
  return text.slice(0, MAX_PROMPT_LENGTH);
}
