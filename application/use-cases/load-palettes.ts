import type { SavedPalettesPort } from "~/application/ports/saved-palettes.port";
import type { SavedPalette } from "~/domain/palette";

export class LoadPalettesUseCase {
  constructor(private readonly savedPalettesPort: SavedPalettesPort) {}

  execute(): SavedPalette[] {
    return this.savedPalettesPort.load();
  }
}
