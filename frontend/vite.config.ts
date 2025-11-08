import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  resolve: { // 2. ADD THIS ENTIRE 'resolve' BLOCK
    alias: {
      'infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      'adapters': path.resolve(__dirname, 'src/adapters'),
      'core': path.resolve(__dirname, 'src/core'),
      'shared': path.resolve(__dirname, 'src/shared'),
    },
  },
})
