
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "zlib": "pako", // Use pako instead of zlib
    },
  },
  define: {
    'process.env': {
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      NODE_ENV: process.env.NODE_ENV
    },
    'global': {},
  },
  optimizeDeps: {
    exclude: ['zlib-sync'] // Exclude the native module
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      exclude: [/node_modules\/zlib-sync/]
    }
  }
}));
