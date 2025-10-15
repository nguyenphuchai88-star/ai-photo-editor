import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚙️ Cấu hình đúng cho GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/ai-photo-editor/", // 👈 Đặt đúng tên repository của bạn
  build: {
    outDir: "dist",
  },
});
