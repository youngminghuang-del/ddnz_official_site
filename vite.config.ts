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
     * 为提升 SEO，防止服务端产生 "Page with redirect"（尾部斜杠重定向），
     * 使用 '/' 绝对路径，因为项目部署在独立根域名下。
     */
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
