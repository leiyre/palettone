import { GeneratePaletteFromTextUseCase } from "~/server/application/use-cases/generate-palette-from-text";
import { createPaletteGenerator } from "~/server/infrastructure/palette-generator/create-palette-generator";

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();
  const generator = createPaletteGenerator({
    groqApiKey: config.groqApiKey,
    groqModel: config.groqModel,
  });
  const useCase = new GeneratePaletteFromTextUseCase(generator);

  nitroApp.hooks.hook("request", (event) => {
    event.context.generatePalette = useCase;
  });
});
