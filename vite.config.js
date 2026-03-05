import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite設定 - DHU大学院 履修ガイダンスポータル
// 本番ビルド時のみGitHub Pages用のベースパスを適用
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/dhu-guidance/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))
