export default defineNuxtConfig({
  extends: "@nuxt-themes/docus",
  css: [
    'vue-mafs/core.css'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
