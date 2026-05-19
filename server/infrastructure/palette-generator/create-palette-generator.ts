import type { PaletteGeneratorPort } from "~/server/application/ports/palette-generator.port";
import {
  GroqPaletteGenerator,
  type PaletteGeneratorConfig,
} from "~/server/infrastructure/groq/groq-palette-generator";

export function createPaletteGenerator(
  config: PaletteGeneratorConfig = {},
): PaletteGeneratorPort {
  return new GroqPaletteGenerator(config);
}
