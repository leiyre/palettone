import type { SavedPalette } from "~/domain/palette";

export interface SavedPalettesPort {
  load(): SavedPalette[];
  save(items: SavedPalette[]): void;
}
