import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000, // Changed frontend port to 3000
    open: true, // Fixed boolean value
    https: false, // Fixed boolean value
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Backend remains on 8000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
