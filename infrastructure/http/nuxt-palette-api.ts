import type {
  PaletteApiPort,
  PaletteApiResult,
} from "~/application/ports/palette-api.port";
import type {
  PaletteHslColor,
  PaletteReasoning,
  PaletteTrace,
} from "~/shared/palette/api-contract";

interface PaletteResponse {
  paletteHsl?: PaletteHslColor[];
  message?: string;
  meta?: {
    trace?: PaletteTrace;
    reasoning?: PaletteReasoning;
  };
}

const PALETTE_REQUEST_TIMEOUT_MS = 90000;

export class NuxtPaletteApi implements PaletteApiPort {
  async generatePalette(
    text: string,
    harmony?: string,
  ): Promise<PaletteApiResult> {
    try {
      const response = await $fetch<PaletteResponse>("/api/palette", {
        method: "POST",
        body: { text, harmony },
        headers: { "Content-Type": "application/json" },
        timeout: PALETTE_REQUEST_TIMEOUT_MS,
      });

      return {
        paletteHsl: response?.paletteHsl ?? [],
        trace: response?.meta?.trace,
        reasoning: response?.meta?.reasoning,
      };
    } catch (error: unknown) {
      throw new Error(extractPaletteErrorMessage(error));
    }
  }
}

function extractPaletteErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Could not generate the palette. Please try again.";
  }

  const maybeData = (error as { data?: unknown }).data;
  if (maybeData && typeof maybeData === "object") {
    const dataMessage = (maybeData as { message?: unknown }).message;
    if (typeof dataMessage === "string" && dataMessage.trim()) {
      return dataMessage;
    }
  }

  const errorMessage = (error as { message?: unknown }).message;
  if (typeof errorMessage === "string" && errorMessage.trim()) {
    return errorMessage;
  }

  return "Could not generate the palette. Please try again.";
}
