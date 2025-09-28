import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB に拡大
      },
      manifest: {
        name: "yf我が投資術",
        short_name: "yf我が投資術",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1d4ed8",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64",
            type: "image/ico",
          },
        ],
      },
      registerType: "autoUpdate",
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
    }),],
  base: process.env.NODE_ENV === 'production' ? '/waga-toushijutsu/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          papaparse: ['papaparse']
        }
      }
    }
  }
})
