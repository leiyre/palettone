import type { GeneratePaletteFromDescriptionUseCase } from "~/application/use-cases/generate-palette-from-description";
import type { LoadPalettesUseCase } from "~/application/use-cases/load-palettes";
import type { RemovePaletteUseCase } from "~/application/use-cases/remove-palette";
import type { SavePaletteUseCase } from "~/application/use-cases/save-palette";
import type { GeneratePaletteFromTextUseCase } from "~/server/application/use-cases/generate-palette-from-text";

declare module "#app" {
  interface NuxtApp {
    $generatePalette: GeneratePaletteFromDescriptionUseCase;
    $savePalette: SavePaletteUseCase;
    $loadPalettes: LoadPalettesUseCase;
    $removePalette: RemovePaletteUseCase;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $generatePalette: GeneratePaletteFromDescriptionUseCase;
    $savePalette: SavePaletteUseCase;
    $loadPalettes: LoadPalettesUseCase;
    $removePalette: RemovePaletteUseCase;
  }
}

declare module "h3" {
  interface H3EventContext {
    generatePalette?: GeneratePaletteFromTextUseCase;
  }
}

export {};
