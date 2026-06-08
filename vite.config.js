// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),  // Add React plugin
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    hmr: {
      overlay: false  // Optional: disable HMR error overlay
    }
  }
})