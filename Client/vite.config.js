import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy TMDB API requests through Vite dev server
      // This bypasses ISP-level blocks because the request
      // originates from Node.js (server-side), not the browser
      '/tmdb-api': {
        target: 'https://api.themoviedb.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-api/, '/3'),
        secure: true,
        timeout: 30000,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[Vite Proxy] TMDB proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            // Force IPv4 DNS resolution to avoid IPv6 issues
            proxyReq.setHeader('Host', 'api.themoviedb.org');
          });
        },
      },
    },
  },
})
