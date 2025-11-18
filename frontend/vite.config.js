import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 1. Set the correct base path for GitHub Pages
  base: '/Planner-v4/', 
  
  // 2. Set the root directory for Vite to the current directory (frontend)
  // This tells Vite to look for index.html here.
  root: process.cwd(), 
  
  // 3. Keep the build output in a subfolder relative to the root (which is standard)
  build: {
    outDir: 'build', 
  },
  
  plugins: [react()],
})
