import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project at
  // https://<user>.github.io/ReactLabs/week04/ (a SUBFOLDER of the
  // gh-pages branch, alongside week03 at the branch root) — so every
  // built asset path needs this exact prefix, matching the --dest
  // flag used in the "deploy" script below.
  base: '/ReactLabs/week04/',
})