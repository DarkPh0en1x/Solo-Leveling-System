import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// ✅ Универсальный Vite-конфиг с поддержкой TypeScript
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(), // 🔹 чтобы Vite понимал tsconfig.json и .ts файлы
  ],
  root: '.', // корень проекта
  base: './', // относительные пути для Electron
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    target: 'chrome128',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
  esbuild: {
    legalComments: 'none',
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
}));
