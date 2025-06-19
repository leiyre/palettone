// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  runtimeConfig: {
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
      aiToken: process.env.CLOUDFLARE_AI_TOKEN || "",
    },
  },
  googleFonts: {
    families: {
      Agbalumo: [400],
    },
  },
  modules: ["nitro-cloudflare-dev", "@nuxtjs/google-fonts"],
});
