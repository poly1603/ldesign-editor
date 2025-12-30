import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ldesign/editor-core': resolve(__dirname, '../packages/core/src'),
      '@ldesign/editor-vue': resolve(__dirname, '../packages/vue/src')
    }
  },
  optimizeDeps: {
    exclude: ['@ldesign/editor-core', '@ldesign/editor-vue']
  }
})
