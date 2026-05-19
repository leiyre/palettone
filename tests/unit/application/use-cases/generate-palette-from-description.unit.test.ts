import { describe, expect, it, vi } from "vitest";
import type { PaletteApiPort } from "~/application/ports/palette-api.port";
import { GeneratePaletteFromDescriptionUseCase } from "~/application/use-cases/generate-palette-from-description";

describe("GeneratePaletteFromDescriptionUseCase", () => {
  it("validates input and delegates to API port", async () => {
    const generatePalette = vi.fn().mockResolvedValue({
      paletteHsl: [
        { h: 10, s: 20, l: 30 },
        { h: 40, s: 50, l: 60 },
        { h: 70, s: 80, l: 90 },
      ],
      trace: { totalDurationMs: 15, steps: [] },
    });
    const apiPort: PaletteApiPort = { generatePalette };
    const useCase = new GeneratePaletteFromDescriptionUseCase(apiPort);

    const result = await useCase.execute({
      rawText: "  moonlight valley  ",
      harmony: "complementary",
    });

    expect(generatePalette).toHaveBeenCalledWith("moonlight valley", "complementary");
    expect(result.description).toBe("moonlight valley");
    expect(result.paletteHsl).toHaveLength(3);
  });

  it("throws when input exceeds max length", async () => {
    const apiPort: PaletteApiPort = {
      generatePalette: vi.fn(),
    };
    const useCase = new GeneratePaletteFromDescriptionUseCase(apiPort);

    await expect(
      useCase.execute({
        rawText: "a".repeat(501),
      }),
    ).rejects.toThrowError("Text exceeds the maximum length (500)");
  });
});
