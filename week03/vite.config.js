import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project at https://<user>.github.io/ReactLabs/,
  // so every built asset path needs this prefix — without it, the deployed
  // page loads with broken CSS/JS (404s on /assets/... at the domain root).
  base: '/ReactLabs/',
})