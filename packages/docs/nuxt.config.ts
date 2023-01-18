export default defineNuxtConfig({
  extends: "@nuxt-themes/docus",
  css: ["~/assets/main.css"],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
