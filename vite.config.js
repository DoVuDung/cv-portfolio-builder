import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import federationConfig from './module-federation.config.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss(), federation(federationConfig)],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components/'),
    },
  },
  build: {
    target: 'esnext', // Ensure esnext to support top-level await
    esbuild: {
      target: 'esnext', // Make sure the target is compatible with modern features
    },
  },
})
