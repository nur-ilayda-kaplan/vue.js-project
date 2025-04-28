// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/tailwind.css'],
  compatibilityDate: '2025-04-14',
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000',
      apiLoginUrl: 'http://localhost:3000/login',
      apiProductsUrl: 'http://localhost:3000/urunler'
    }
  },
  devServer: {
    port: 8080
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE_URL,
        changeOrigin: true,
        prependPath: true
      }
    }
  }
})