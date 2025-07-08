import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig(({ mode }) => {
  // переменные окружения (для GitHub Pages)
  const env = loadEnv(mode, process.cwd(), '');

  // - в продакшене = '/Form/' (для GitHub Pages)
  // - в разработке = '/' (локальный сервер)
  const base = mode === 'production' ? '/Form/' : '/';

  return {  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "quasar/src/css/variables.sass";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
    base,
      build: {
    outDir: 'dist' 
    },
  };
});