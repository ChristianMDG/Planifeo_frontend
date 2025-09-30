import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  const apiUrl = 'https://planifeo-backend.onrender.com'; // backend deployé sur Render

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,

        }
      }
    }
  };
});
