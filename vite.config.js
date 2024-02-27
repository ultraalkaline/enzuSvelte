import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  build: {
    outDir: './docs', // relative to index.html
    // emptyOutDir: true, // true if outDir is inside root. if outDir is not inside root, uncomment this.
  }
})