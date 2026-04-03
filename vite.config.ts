import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    /**
     * 🚀 终极路径优化：
     * 使用 './' 相对路径可以确保网站在 GitHub 子目录和独立域名下都能正常加载资源。
     */
    base: './', 
    
    plugins: [react(), tailwindcss()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      // 确保构建输出目录正确
      outDir: 'dist',
      // 防止生成过大的 sourcemap 文件
      sourcemap: false,
    }
  };
});
