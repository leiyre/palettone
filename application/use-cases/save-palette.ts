import type { SavedPalettesPort } from "~/application/ports/saved-palettes.port";
import type { SavedPalette } from "~/domain/palette";

export class SavePaletteUseCase {
  constructor(private readonly savedPalettesPort: SavedPalettesPort) {}

  execute(items: SavedPalette[]): void {
    this.savedPalettesPort.save(items);
  }
}
