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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/env.ts',
        'src/reportWebVitals.ts',
        'node_modules',
        'dist',
        'coverage',
      ],
      thresholds: {
        global: {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70,
        },
      },
    },
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
