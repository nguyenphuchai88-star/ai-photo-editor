import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Cấu hình cho GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/ai-photo-editor/", // 👈 Đúng với tên repo GitHub của bạn
  build: {
    outDir: "dist",
  },
});
