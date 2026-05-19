// server/api/config-debug.ts
export default defineEventHandler(() => {
  if (!import.meta.dev) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  const config = useRuntimeConfig();
  return {
    paletteProvider: "groq",
    envVars: {
      model: config.groqModel || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      hasGroqApiKey: Boolean(config.groqApiKey || process.env.GROQ_API_KEY),
      strategy: "groq-chat-completions-json",
    },
    runtimeKeys: Object.keys(config),
  };
});
