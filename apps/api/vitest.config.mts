import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// NestJS 12 là ESM; SWC giữ decorator metadata cho DI (tsx/esbuild không làm được).
export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
