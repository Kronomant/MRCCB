/// <reference types="vitest" />
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  // Build outputs to src/renderer/dist (matches tauri.conf.json frontendDist)
  build: {
    outDir: resolve(__dirname, 'src/renderer/dist'),
    emptyOutDir: true,
    minify: process.env.TAURI_ENV_DEBUG !== '1',
    sourcemap: process.env.TAURI_ENV_DEBUG === '1'
  },
  // The entry point is the renderer's index.html
  root: resolve(__dirname, 'src/renderer'),
  publicDir: false,
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src')
    }
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
  },
  // dev server (used by `tauri dev`)
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  test: {
    setupFiles: ['./src/setupTests.tsx'],
    globals: true,
  },
  clearScreen: false
})
