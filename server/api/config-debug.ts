// server/api/config-debug.ts
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return {
    cloudflareConfig: {
      accountId: config.cloudflare?.accountId
        ? "***" + config.cloudflare.accountId.slice(-4)
        : "NO DEFINIDO",
      aiToken: config.cloudflare?.aiToken
        ? "***" + config.cloudflare.aiToken.slice(-4)
        : "NO DEFINIDO",
    },
    envVars: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID
        ? "***" + process.env.CLOUDFLARE_ACCOUNT_ID.slice(-4)
        : "NO DEFINIDO",
      aiToken: process.env.CLOUDFLARE_AI_TOKEN
        ? "***" + process.env.CLOUDFLARE_AI_TOKEN.slice(-4)
        : "NO DEFINIDO",
    },
  };
});
