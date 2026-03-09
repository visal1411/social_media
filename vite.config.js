import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Production build optimizations
  build: {
    // Output folder (default: dist)
    outDir: 'dist',

    // Generate source maps for debugging production errors
    sourcemap: false,

    // Minify output using esbuild (built-in to Vite, no install needed)
    minify: 'esbuild',

    // Chunk size warning threshold (500kb)
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk (better caching)
        manualChunks: {
          // React core separated from app code
          'react-vendor': ['react', 'react-dom'],
        },
        // Organize output files into folders
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // Preview server settings (for `npm run preview` after build)
  preview: {
    port: 4173,
    strictPort: true,
  },
});