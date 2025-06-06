import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    vue(),
    vueJsx(),
    vueDevTools(),
    compression({
      algorithm: 'gzip', // Options: 'gzip', 'brotliCompress'
      ext: '.gz',
      deleteOriginFile: false, // Keep original files
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    https: false,
    port: 5173,
  },
  base: process.env.NODE_ENV === 'production' ? '/wedding/' : '/',
  build: {
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'axios'],
        },
      },
    },
  },
})
