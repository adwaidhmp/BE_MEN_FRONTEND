import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    watch: {
      ignored: ['**/db.json'], 
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // ✅ <--- THIS FIXES THE NETLIFY MIME ERROR
})
