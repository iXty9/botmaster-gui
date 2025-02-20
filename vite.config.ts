
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
      "zlib": "pako", // Use pako as a browser-compatible replacement for zlib
      "zlib-sync": "pako" // Redirect zlib-sync to pako as well
    },
  },
  define: {
    'process.env': {
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      NODE_ENV: process.env.NODE_ENV
    },
    'process.versions': {
      node: '16.0.0'
    },
    'process.platform': 'browser',
    'process.arch': 'browser',
    'global': 'globalThis',
    'module': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    exclude: ['zlib-sync']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      exclude: [/node_modules\/zlib-sync/]
    }
  }
}));
