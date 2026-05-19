import { describe, expect, it, vi } from "vitest";

type PalettePostHandler = (event: {
  context: {
    generatePalette?: {
      execute: (
        text: string,
        options?: { harmony?: string },
      ) => Promise<{
        paletteHsl: Array<{ h: number; s: number; l: number }>;
        trace?: { totalDurationMs: number; steps: Array<unknown> };
      }>;
    };
  };
}) => Promise<{
  paletteHsl: Array<{ h: number; s: number; l: number }>;
  meta?: { trace?: { totalDurationMs: number; steps: Array<unknown> } };
}>;

describe("palette.post endpoint", () => {
  it("returns palette payload when request is valid", async () => {
    vi.resetModules();
    vi.stubGlobal("defineEventHandler", (handler: unknown) => handler);
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: "aurora", harmony: "triadic" }));
    vi.stubGlobal(
      "createError",
      vi.fn((payload: { message?: string; statusCode?: number }) => {
        const err = new Error(payload.message ?? "error");
        return Object.assign(err, payload);
      }),
    );

    const module = await import("~/server/api/palette.post");
    const handler = module.default as PalettePostHandler;
    const event = {
      context: {
        generatePalette: {
          execute: vi.fn().mockResolvedValue({
            paletteHsl: [
              { h: 10, s: 20, l: 30 },
              { h: 40, s: 50, l: 60 },
              { h: 70, s: 80, l: 90 },
            ],
            trace: { totalDurationMs: 12, steps: [] },
          }),
        },
      },
    };

    const result = await handler(event);

    expect(event.context.generatePalette.execute).toHaveBeenCalledWith("aurora", {
      harmony: "triadic",
    });
    expect(result.paletteHsl).toHaveLength(3);
    expect(result.meta?.trace?.totalDurationMs).toBe(12);
  });

  it("throws 400 when text is missing", async () => {
    vi.resetModules();
    vi.stubGlobal("defineEventHandler", (handler: unknown) => handler);
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ harmony: "triadic" }));
    vi.stubGlobal(
      "createError",
      vi.fn((payload: { message?: string; statusCode?: number }) => {
        const err = new Error(payload.message ?? "error");
        return Object.assign(err, payload);
      }),
    );

    const module = await import("~/server/api/palette.post");
    const handler = module.default as PalettePostHandler;

    await expect(handler({ context: {} })).rejects.toMatchObject({
      statusCode: 400,
      message: "Text is required",
    });
  });
});
