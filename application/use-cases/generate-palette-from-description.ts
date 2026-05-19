import { validatePaletteDescription } from "~/shared/palette/description";
import type {
  PaletteApiPort,
  PaletteApiResult,
} from "~/application/ports/palette-api.port";

export interface GeneratePaletteInput {
  rawText: string;
  harmony?: string;
}

export interface GeneratePaletteOutput extends PaletteApiResult {
  description: string;
}

export class GeneratePaletteFromDescriptionUseCase {
  constructor(private readonly paletteApi: PaletteApiPort) {}

  async execute(input: GeneratePaletteInput): Promise<GeneratePaletteOutput> {
    const description = validatePaletteDescription(input.rawText);
    const result = await this.paletteApi.generatePalette(description, input.harmony);
    return {
      ...result,
      description,
    };
  }
}
