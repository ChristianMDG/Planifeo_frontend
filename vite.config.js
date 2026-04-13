import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://planifeo-backend-1.onrender.com',
        changeOrigin: true
      }
    }
  }
})
