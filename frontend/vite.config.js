import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Set the correct base path for GitHub Pages
  base: '/Planner-v4/', 
  
  // Set the output directory for the built files
  build: {
    outDir: 'build', // Files will be outputted to frontend/build
  },
  
  plugins: [react()],
})
