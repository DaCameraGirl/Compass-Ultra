import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ command }) => ({
  base: '/',
  root: 'app',
  plugins: command === 'serve' ? [react(), basicSsl()] : [react()],
  server: {
    https: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
}));
