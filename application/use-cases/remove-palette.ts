import type { SavedPalettesPort } from "~/application/ports/saved-palettes.port";
import type { SavedPalette } from "~/domain/palette";

export class RemovePaletteUseCase {
  constructor(private readonly savedPalettesPort: SavedPalettesPort) {}

  execute(items: SavedPalette[], index: number): SavedPalette[] {
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      return items;
    }
    const next = [...items];
    next.splice(index, 1);
    this.savedPalettesPort.save(next);
    return next;
  }
}
