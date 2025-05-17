// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // senin zaten /api proxy’n varsa
      '/api': 'http://localhost:5000',
      // şimdi /uploads isteklerini de aynı backend’e yönlendir
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
