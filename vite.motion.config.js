import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = process.cwd();

export default defineConfig({
  configFile: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: resolve(projectRoot, "assets"),
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
    lib: {
      entry: resolve(projectRoot, "remotion", "route-path-motion.jsx"),
      name: "RouteoRemotion",
      formats: ["iife"],
      fileName: () => "routeo-remotion.js"
    },
    rollupOptions: {
      output: { inlineDynamicImports: true }
    }
  }
});
