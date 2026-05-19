import { validateDescription } from "~/domain/palette";
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
    const description = validateDescription(input.rawText);
    const result = await this.paletteApi.generatePalette(description, input.harmony);
    return {
      ...result,
      description,
    };
  }
}
