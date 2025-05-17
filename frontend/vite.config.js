// vite.config.js
import { defineConfig } from 'vite'
import react      from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API isteklerini buraya yazmışsındır zaten:
      '/api':    'http://localhost:5000',
      // Dosya isteklerini de backend’e yönlendir
      '/uploads': 'http://localhost:5000'
    }
  }
})
