import { defineConfig } from 'tsup';

export default defineConfig([
  // Node / bundler 向け (ESM + CJS + 型定義)
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  // CDN 向け (IIFE)。従来の dist/MapNJ.min.js のパスを維持する
  // window.MapNJ はモジュール側 (MapNJ.ts) で明示的に代入している
  {
    entry: { 'MapNJ.min': 'src/index.ts' },
    format: ['iife'],
    globalName: 'mapnj',
    minify: true,
    sourcemap: true,
    outExtension: () => ({ js: '.js' }),
  },
]);
