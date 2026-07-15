import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const apiProxy = {
  "/api": {
    target: "https://webmns.com",
    changeOrigin: true,
    secure: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy API calls to the production backend in dev so the browser stays
    // same-origin (the API sends no CORS headers).
    proxy: apiProxy,
  },
  preview: {
    host: "::",
    port: 4173,
    proxy: apiProxy,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@radix-ui")) return "radix-ui";
          if (id.includes("react") || id.includes("@tanstack/react-query")) return "react-vendor";
          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
