import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/recruitment-landing/',
  server: {
    port: 3500,
    host: true,
  },
})
