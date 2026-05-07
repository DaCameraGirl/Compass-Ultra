import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  base: '/Compass-Ultra/',
  root: 'app',
  plugins: [react(), basicSsl()],
  server: {
    https: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
