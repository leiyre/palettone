import { beforeEach, describe, expect, it, vi } from "vitest";
import { GroqPaletteGenerator } from "~/server/infrastructure/groq/groq-palette-generator";

const { createMock } = vi.hoisted(() => {
  return {
    createMock: vi.fn(),
  };
});

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroqClient {
      chat = {
        completions: {
          create: createMock,
        },
      };
    },
  };
});

describe("GroqPaletteGenerator", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("throws when API key is missing", async () => {
    const generator = new GroqPaletteGenerator();
    delete process.env.GROQ_API_KEY;

    await expect(generator.generatePalette("ocean sunset")).rejects.toThrowError(
      "Missing GROQ_API_KEY runtime configuration",
    );
  });

  it("parses wrapped JSON with fallback and normalizes colors", async () => {
    const generator = new GroqPaletteGenerator({ groqApiKey: "test-key" });

    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content:
              'prefix {"paletteHsl":[{"h":361.4,"s":-5,"l":102},{"h":120.2,"s":40.6,"l":50.5},{"h":"200","s":"90","l":"10"}],"reasoning":{"emotion":"vibrant","intensity":0.7}} suffix',
          },
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      },
    });

    const result = await generator.generatePalette("  ocean sunset  ", {
      harmony: "split_complementary",
    });

    expect(result.paletteHsl).toEqual([
      { h: 359, s: 0, l: 100 },
      { h: 120, s: 41, l: 51 },
      { h: 200, s: 90, l: 10 },
    ]);
    expect(result.trace?.parsedWithFallback).toBe(true);
    expect(result.trace?.resolvedHarmony).toBe("split-complementary");
    expect(result.trace?.steps).toHaveLength(3);
    expect(result.reasoning?.emotion).toBe("vibrant");
    expect(result.reasoning?.intensity).toBe(0.7);
  });

  it("fails when parsed palette has fewer than 3 colors", async () => {
    const generator = new GroqPaletteGenerator({ groqApiKey: "test-key" });

    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              paletteHsl: [{ h: 10, s: 20, l: 30 }, { h: 30, s: 40, l: 50 }],
            }),
          },
        },
      ],
    });

    await expect(generator.generatePalette("sun")).rejects.toThrowError(
      "Model response does not contain enough HSL colors",
    );
  });
});
