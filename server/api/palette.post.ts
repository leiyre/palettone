export default defineEventHandler(async (event) => {
  const { text } = await readBody(event);

  // Validación mínima pero efectiva
  if (!text?.trim()) {
    throw createError({ statusCode: 400, message: "Texto requerido" });
  }

  const { cloudflare } = useRuntimeConfig();

  try {
    // Paso único: Llama a la API de Cloudflare AI
    const response = await $fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cloudflare.aiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Genera exactamente 6 códigos HEX para "${text.substring(
            0,
            500
          )}. Devuelve SOLO un JSON array como: ["#FF0000","#00FF00",...]`,
          max_tokens: 150,
        }),
      }
    );

    // Extracción directa de colores HEX
    const palette = extractHexColors(response).slice(0, 6);

    if (palette.length < 6)
      throw new Error("No se generaron suficientes colores");

    return { palette };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Error generando paleta",
      data: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

// Función ultra-simplificada para extraer HEX
function extractHexColors(obj: any): string[] {
  try {
    const jsonString = JSON.stringify(obj);
    return (jsonString.match(/#[0-9A-Fa-f]{6}/gi) || [])
      .map((c) => c.toLowerCase())
      .filter((c, i, arr) => arr.indexOf(c) === i); // Elimina duplicados
  } catch {
    return [];
  }
}
