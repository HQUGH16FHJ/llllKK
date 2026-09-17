import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Vite 8 使用 rolldown，需要兼容配置
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
