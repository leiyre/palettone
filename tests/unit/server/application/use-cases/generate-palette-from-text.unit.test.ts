import { describe, expect, it, vi } from "vitest";
import type {
  PaletteGeneratorPort,
  PaletteGeneratorResult,
} from "~/server/application/ports/palette-generator.port";
import { GeneratePaletteFromTextUseCase } from "~/server/application/use-cases/generate-palette-from-text";

function createGeneratorMock(result: PaletteGeneratorResult): PaletteGeneratorPort {
  return {
    generatePalette: vi.fn().mockResolvedValue(result),
  };
}

describe("GeneratePaletteFromTextUseCase", () => {
  it("validates and forwards the normalized prompt", async () => {
    const generator = createGeneratorMock({
      paletteHsl: [
        { h: 10, s: 20, l: 30 },
        { h: 40, s: 50, l: 60 },
        { h: 70, s: 80, l: 90 },
      ],
      reasoning: { emotion: "calm", intensity: 0.3 },
    });
    const useCase = new GeneratePaletteFromTextUseCase(generator);

    const result = await useCase.execute("  aurora night  ", { harmony: "triadic" });

    expect(generator.generatePalette).toHaveBeenCalledWith("aurora night", {
      harmony: "triadic",
    });
    expect(result.paletteHsl).toHaveLength(3);
    expect(result.reasoning?.emotion).toBe("calm");
  });

  it("throws when model response does not include palette", async () => {
    const generator = createGeneratorMock({});
    const useCase = new GeneratePaletteFromTextUseCase(generator);

    await expect(useCase.execute("forest")).rejects.toThrowError(
      "Model response is missing paletteHsl",
    );
  });
});
