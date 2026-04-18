import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'pause-customizer': resolve(__dirname, 'src/pause-customizer.ts'),
      },
      formats: ['es'],
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
