import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
  },
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-redux", "@reduxjs/toolkit", "use-sync-external-store"],
    force: true,
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxImportSource: 'react'
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "tailwind-config": fileURLToPath(
        new URL("./tailwind.config.js", import.meta.url)
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
