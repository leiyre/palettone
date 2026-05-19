// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  css: ["@/assets/styles/main.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  },
  googleFonts: {
    families: {
      Agbalumo: [400],
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/google-fonts"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "@/assets/styles/variables" as *; @use "@/assets/styles/media" as *;',
        },
      },
    },
  },
});
