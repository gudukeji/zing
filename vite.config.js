import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],

  // 确保Vite构建生效
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除console和debugger
        drop_console: true,
        drop_debugger: true,
        // 移除无用的代码
        dead_code: true,
        // 移除未使用的变量
        unused: true
      },
      mangle: {
        // 压缩变量名
        toplevel: true
      }
    },
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vuex', 'pinia'],
          'ui-vendor': ['@dcloudio/uni-app'],
          'utils': ['/utils/util', '/utils/cache', '/utils/request']
        }
      }
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0',
    // 修复Windows文件监听问题
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/unpackage/**']
    }
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vuex', 'pinia', 'vue-i18n']
  }
})
