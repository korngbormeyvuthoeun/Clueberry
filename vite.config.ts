import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } },
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true }
});
