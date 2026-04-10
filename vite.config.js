import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Copies dist/index.html → dist/404.html so GitHub Pages serves the SPA
// for any unknown route (React Router then handles it client-side).
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      try {
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      } catch (e) {
        console.warn('spa-fallback-404 skipped:', e.message)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  base: process.env.BASE_URL || '/',
  server: {
    port: 3500,
    host: true,
  },
})
