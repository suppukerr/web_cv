import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/web_cv/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})