import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

let publicPathSanitized = process.env.PUBLIC_PATH;
if (publicPathSanitized == null) {
  publicPathSanitized = '/';
}
if (publicPathSanitized[0] !== '/') {
  publicPathSanitized = '/' + publicPathSanitized;
}
if (publicPathSanitized[publicPathSanitized.length - 1] !== '/') {
  publicPathSanitized += '/';
}

// https://vitejs.dev/config/
export default defineConfig({
  base: publicPathSanitized,
  plugins: [vue(), vuetify()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
