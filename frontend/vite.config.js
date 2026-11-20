import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/juruena-fullstack/',
  server: {
    port: 3000,
  },
});
