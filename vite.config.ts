import { rmSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

rmSync('dist-electron', { recursive: true, force: true })
const sourcemap = !!process.env.VSCODE_DEBUG
const isBuild = process.argv.slice(2).includes('build')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG)
            console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
          else
            options.startup()
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
    ]),
    // // Use Node.js API in the Renderer-process
    // renderer({
    //   nodeIntegration: true,
    // }),
    // auto import APIs on demand
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    // auto import components and register for it
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
  ],
  server: process.env.VSCODE_DEBUG
    ? (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })()
    : undefined,
  clearScreen: false,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
