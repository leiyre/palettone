import { GeneratePaletteFromTextUseCase } from "~/server/application/use-cases/generate-palette-from-text";
import { GroqPaletteGenerator } from "~/server/infrastructure/groq/groq-palette-generator";

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();
  const generator = new GroqPaletteGenerator({
    groqApiKey: config.groqApiKey,
    groqModel: config.groqModel,
  });
  const useCase = new GeneratePaletteFromTextUseCase(generator);

  nitroApp.hooks.hook("request", (event) => {
    event.context.generatePalette = useCase;
  });
});
