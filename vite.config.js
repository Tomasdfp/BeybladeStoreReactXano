import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
