import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"

// import rollupNodePolyFill from "rollup-plugin-node-polyfills"
import nodePolyfills from "rollup-plugin-polyfill-node"
import inject from "@rollup/plugin-inject"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({})],
  resolve: {
    preserveSymlinks: true,
    alias: {
      assert: "rollup-plugin-node-polyfills/polyfills/assert",
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
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
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills(),
        inject({
          // cbor-x checks for Buffer on the global object, and the polyfills plugin doesn't cover this case for the
          // production build (but works in development because Buffer gets injected as a banner, so it's "naturally"
          // available on the global object)
          "globalThis.Buffer": ["buffer", "Buffer"],
        }),
      ],
    },
  },
})
