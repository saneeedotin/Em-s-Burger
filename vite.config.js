import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
    open: false,
    strictPort: false,
    allowedHosts: [
      'wallace-fill-mph-viewers.trycloudflare.com',
      'walked-moisture-align-whose.trycloudflare.com'
    ]
  }
});
