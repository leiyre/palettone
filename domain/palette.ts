import { validatePaletteDescription } from "~/shared/palette/description";

export interface SavedPalette {
  palette: string[];
  description: string;
  timestamp: string;
}

export function validateDescription(rawText: string): string {
  return validatePaletteDescription(rawText);
}
