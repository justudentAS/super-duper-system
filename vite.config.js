import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'
import fs from "vite-plugin-fs";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), fs()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
})
