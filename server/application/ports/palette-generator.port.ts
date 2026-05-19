import type {
  PaletteHslColor,
  PaletteReasoning,
  PaletteTrace,
} from "~/shared/palette/api-contract";

export type PaletteGenerationTrace = PaletteTrace;
export type { PaletteHslColor };

export interface PaletteGeneratorResult {
  paletteHsl?: PaletteHslColor[];
  trace?: PaletteGenerationTrace;
  reasoning?: PaletteReasoning;
}

export interface PaletteGeneratorPort {
  generatePalette(
    input: string,
    options?: { harmony?: string },
  ): Promise<PaletteGeneratorResult>;
}
