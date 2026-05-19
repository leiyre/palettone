import { validatePaletteDescription } from "~/shared/palette/description";
import type {
  PaletteHslColor,
  PaletteGenerationTrace,
  PaletteGeneratorResult,
  PaletteGeneratorPort,
} from "../ports/palette-generator.port";
import type { PaletteReasoning } from "~/shared/palette/api-contract";

export interface GeneratedPaletteResult {
  paletteHsl: PaletteHslColor[];
  trace?: PaletteGenerationTrace;
  reasoning?: PaletteReasoning;
}

export class GeneratePaletteFromTextUseCase {
  constructor(private readonly paletteGenerator: PaletteGeneratorPort) {}

  async execute(
    rawText: string,
    options?: { harmony?: string },
  ): Promise<GeneratedPaletteResult> {
    const description = validatePaletteDescription(rawText);
    const modelResponse = await this.paletteGenerator.generatePalette(
      description,
      options,
    );
    if (!Array.isArray(modelResponse.paletteHsl)) {
      throw new Error("Model response is missing paletteHsl");
    }
    const paletteHsl = modelResponse.paletteHsl;

    if (paletteHsl.length < 3) {
      throw new Error("Model response does not contain enough HSL colors");
    }

    return {
      paletteHsl,
      trace: modelResponse.trace,
      reasoning:
        typeof modelResponse.reasoning === "object" &&
        modelResponse.reasoning !== null
          ? (modelResponse.reasoning as PaletteGeneratorResult["reasoning"])
          : undefined,
    };
  }
}
