import { describe, expect, it, vi } from "vitest";
import { NuxtPaletteApi } from "~/infrastructure/http/nuxt-palette-api";

describe("NuxtPaletteApi", () => {
  it("maps successful API response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      paletteHsl: [{ h: 10, s: 20, l: 30 }],
      meta: {
        trace: { totalDurationMs: 10, steps: [] },
        reasoning: { emotion: "cool", intensity: 0.4 },
      },
    });
    vi.stubGlobal("$fetch", fetchMock);
    const api = new NuxtPaletteApi();

    const result = await api.generatePalette("sea breeze", "analogous");

    expect(fetchMock).toHaveBeenCalledWith("/api/palette", {
      method: "POST",
      body: { text: "sea breeze", harmony: "analogous" },
      headers: { "Content-Type": "application/json" },
      timeout: 90000,
    });
    expect(result.paletteHsl).toEqual([{ h: 10, s: 20, l: 30 }]);
    expect(result.trace?.totalDurationMs).toBe(10);
    expect(result.reasoning?.emotion).toBe("cool");
  });

  it("uses backend message when fetch throws with data.message", async () => {
    vi.stubGlobal(
      "$fetch",
      vi.fn().mockRejectedValue({
        data: { message: "Upstream provider timeout" },
      }),
    );
    const api = new NuxtPaletteApi();

    await expect(api.generatePalette("city lights")).rejects.toThrowError(
      "Upstream provider timeout",
    );
  });

  it("falls back to generic message for unknown errors", async () => {
    vi.stubGlobal("$fetch", vi.fn().mockRejectedValue(null));
    const api = new NuxtPaletteApi();

    await expect(api.generatePalette("city lights")).rejects.toThrowError(
      "Could not generate the palette. Please try again.",
    );
  });
});
