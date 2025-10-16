import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-photo-editor/', // 👈 RẤT QUAN TRỌNG: đúng với repo GitHub Pages
  build: {
    outDir: 'dist',
  },
});
