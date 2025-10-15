import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Base necesario para GitHub Pages: https://<usuario>.github.io/<repo>/
  // Ajusta al nombre exacto del repositorio
  base: '/BeybladeStoreReactXano/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://x8ki-letl-twmt.n7.xano.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api:cctv-gNX')
      }
    }
  },
})
