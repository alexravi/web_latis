import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer (only in build mode)
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Feature chunks
          'landing': [
            './src/features/landing/LandingPage',
            './src/features/landing/Header',
            './src/features/landing/HeroSection',
          ],
          'dashboard': [
            './src/features/dashboard/Dashboard',
            './src/features/dashboard/AppHeader',
          ],
          'profile': [
            './src/features/profile/ProfileView',
            './src/features/profile/CompleteProfile',
          ],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps for production (optional, set to false for smaller builds)
    sourcemap: false,
    // Minification - using esbuild (default, faster) or terser
    minify: 'esbuild', // Changed to esbuild for faster builds, use 'terser' if you need more control
    // If using terser, uncomment below:
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
})
