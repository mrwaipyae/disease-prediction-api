import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.jsx'], // include CSS here
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: 'localhost',  // force IPv4 localhost
    port: 5174,         // default port for Vite
  },
});
