// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // ✅ build optimizations for low-memory servers
  build: {
    sourcemap: false, // مهم جدًا لتسريع build وتقليل RAM/IO
    reportCompressedSize: false, // يقلل وقت الحسابات بعد build
    cssCodeSplit: true,

    // يقلل استهلاك الذاكرة (مفيد مع 4GB RAM)
    chunkSizeWarningLimit: 1500,
  },
});
