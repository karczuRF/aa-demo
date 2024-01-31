import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"

import rollupNodePolyFill from "rollup-plugin-node-polyfills"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), rollupNodePolyFill()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      assert: "rollup-plugin-node-polyfills/polyfills/assert",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
})
