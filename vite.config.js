import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://planifeo-backend.onrender.com', // <- ton backend Render
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api') // facultatif si ton backend utilise /api
      }
    }
  }
})
