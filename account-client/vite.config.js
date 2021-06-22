import vue from '@vitejs/plugin-vue';

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  base: '/account/',
  server: {
    host: true,
  },
  plugins: [vue()],
};
