import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// Optional PWA (Prioritas B): uncomment when offline sync is ready
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
    // }),
  ],
  resolve: {
    alias: {
      '@web': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    fs: {
      // Unified SPA imports views from sibling SIMPUL/FE and LORA packages
      allow: [path.resolve(__dirname, '..')],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
