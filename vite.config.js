import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(),tailwindcss()],
  server: {
    port: 3001,
    proxy: mode === 'development' ? {
      '/api': {
        target: process.env.VITE_API_URL, // Utilise la variable d'environnement
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    } : undefined
  }
}))
