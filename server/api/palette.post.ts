interface PaletteRequestBody {
  text?: string;
  harmony?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PaletteRequestBody>(event);
  const text = body?.text;
  const harmony = body?.harmony;
  const generatePaletteFromText = event.context.generatePalette;

  try {
    if (typeof text !== "string") {
      throw new Error("Text is required");
    }
    if (!generatePaletteFromText) {
      throw new Error("Palette generator is not initialized");
    }
    const result = await generatePaletteFromText.execute(text, {
      harmony,
    });
    return {
      paletteHsl: result.paletteHsl,
      meta:
        result.trace || result.reasoning
          ? {
              trace: result.trace,
              reasoning: result.reasoning,
            }
          : undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message === "Text is required" ? 400 : 502;

    console.error(error);
    throw createError({
      statusCode,
      message:
        statusCode === 400
          ? message
          : `Failed to generate palette: ${message}`,
      data: import.meta.dev ? error : undefined,
    });
  }
});
