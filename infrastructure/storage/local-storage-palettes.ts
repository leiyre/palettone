import type { SavedPalette } from "~/domain/palette";
import type { SavedPalettesPort } from "~/application/ports/saved-palettes.port";

const STORAGE_KEY = "savedPalettes";

function isSavedPalette(value: unknown): value is SavedPalette {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as SavedPalette;

  return (
    Array.isArray(candidate.palette) &&
    candidate.palette.every((color) => typeof color === "string") &&
    typeof candidate.description === "string" &&
    typeof candidate.timestamp === "string"
  );
}

export class LocalStoragePalettesRepository implements SavedPalettesPort {
  load(): SavedPalette[] {
    if (typeof localStorage === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter(isSavedPalette) : [];
    } catch {
      return [];
    }
  }

  save(items: SavedPalette[]): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
