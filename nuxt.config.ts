import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  $development: undefined, $env: undefined, $meta: undefined, $production: undefined, $test: undefined,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth'],
  typescript: {
    strict: true,
    shim: false
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})