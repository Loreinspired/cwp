import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        // Serves index.html for all routes — required for React Router BrowserRouter in dev
        open: false,
    },
    build: {
        // Production build output to dist/
        outDir: 'dist',
        rollupOptions: {
            output: {
                // Code-split vendor bundle for better caching
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    icons: ['lucide-react'],
                },
            },
        },
    },
    // NOTE: For production SPA deployment, configure your host to rewrite all
    // requests to /index.html (Netlify: _redirects, Vercel: vercel.json, Nginx: try_files)
})
