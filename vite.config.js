import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Skickar /api till backend under utveckling. Origin-headern tas bort så att backend ser ett vanligt
    // same-origin-anrop; då fungerar det oavsett vilken port Vite körs på och CORS behövs inte.
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
})
