import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [
    // dev-server only — keep devtools out of the production bundle
    command === 'serve' && devtools({ autoname: true }),
    solidPlugin(),
    cssInjectedByJsPlugin()
  ],
  server: {
    port: 3000,
  },
  // must be top-level: Vite ignores `build.esbuild`
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'),
      name: 'RecoveryCartWidget',
      fileName: (format) => `recovery-cart-widget.${format}.js`,
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        // Put everything in one file
        inlineDynamicImports: true,
      }
    },
    // emit into the theme extension so Shopify CDN serves it
    outDir: '../extensions/recovery-cart-extenstion/assets',
    emptyOutDir: false,
  },
}));
