import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // <- ensure assets URLs are relative to root
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
