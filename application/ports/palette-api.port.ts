import type {
  PaletteHslColor,
  PaletteReasoning,
  PaletteTrace,
} from "~/shared/palette/api-contract";

export type PaletteRequestTrace = PaletteTrace;

export interface PaletteApiResult {
  paletteHsl: PaletteHslColor[];
  trace?: PaletteRequestTrace;
  reasoning?: PaletteReasoning;
}

export interface PaletteApiPort {
  generatePalette(text: string, harmony?: string): Promise<PaletteApiResult>;
}
