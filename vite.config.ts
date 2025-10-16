import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ai-photo-editor/", // ⚡ Cực kỳ quan trọng cho GitHub Pages
  build: {
    outDir: "dist",
  },
});
