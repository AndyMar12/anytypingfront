import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: [
      "suadm.anytyping.com",
      "app.anytyping.com",
    ],
    port: 5173,
    proxy: {
      // Todas las peticiones que empiecen con /api o /sanctum se redirigen al backend
      '/api': {
        target: 'https://api.anytyping.com',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
        }
      },
      '/sanctum': {
        target: 'https://api.anytyping.com',
        changeOrigin: true,
      },
    },
  },
})