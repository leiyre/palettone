import { GeneratePaletteFromDescriptionUseCase } from "~/application/use-cases/generate-palette-from-description";
import { LoadPalettesUseCase } from "~/application/use-cases/load-palettes";
import { RemovePaletteUseCase } from "~/application/use-cases/remove-palette";
import { SavePaletteUseCase } from "~/application/use-cases/save-palette";
import { NuxtPaletteApi } from "~/infrastructure/http/nuxt-palette-api";
import { LocalStoragePalettesRepository } from "~/infrastructure/storage/local-storage-palettes";

export default defineNuxtPlugin(() => {
  const paletteApi = new NuxtPaletteApi();
  const palettesRepo = new LocalStoragePalettesRepository();

  return {
    provide: {
      generatePalette: new GeneratePaletteFromDescriptionUseCase(paletteApi),
      savePalette: new SavePaletteUseCase(palettesRepo),
      loadPalettes: new LoadPalettesUseCase(palettesRepo),
      removePalette: new RemovePaletteUseCase(palettesRepo),
    },
  };
});
