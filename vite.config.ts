import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 必須是絕對路徑。站台掛在自訂網域的根目錄 (public/CNAME)，而語言版本的頁面
    // 位於巢狀路徑 (/ja/videos.html)；若用相對路徑，該頁會去抓 /ja/assets/... 而 404，
    // 導致整頁空白。根目錄的頁面剛好正常，所以這種錯誤很容易漏測。
    base: '/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      assetsInlineLimit: 1000000, // Force inline images smaller than 1 MB to guarantee finding them on GH Pages
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
