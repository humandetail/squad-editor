/// <reference types="vitest" />

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    Vue()
  ],
  test: {
    globals: true,
    environment: 'happy-dom'
  },

  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        sourcemap: false,
        globals: {
          vue: 'Vue'
        }
      }
    },
    lib: {
      entry: './packages/index.ts',
      name: 'squad-editor'
    }
  }
})
