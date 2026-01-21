import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';

export default defineConfig({
  plugins: [
    devtools({ autoname: true }),
    solidPlugin(),
    cssInjectedByJsPlugin()
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
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
    outDir: '../public/widgets',
    emptyOutDir: false,
  },
});
