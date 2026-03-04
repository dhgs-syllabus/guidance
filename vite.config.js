import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite設定 - DHU大学院 履修ガイダンスポータル
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
