// +----------------------------------------------------------------------
// | 日志管理工具 - 统一管理应用日志输出
// +----------------------------------------------------------------------

class Logger {
  constructor() {
    // 根据环境变量决定是否启用日志
    this.isDev = process.env.NODE_ENV === 'development'
    this.isDebug = this.isDev || uni.getStorageSync('debug_mode') === 'true'
  }

  // 信息日志
  log(...args) {
    if (this.isDebug) {
      console.log('[INFO]', ...args)
    }
  }

  // 警告日志
  warn(...args) {
    if (this.isDebug) {
      console.warn('[WARN]', ...args)
    }
  }

  // 错误日志 - 生产环境也需要记录
  error(...args) {
    console.error('[ERROR]', ...args)
    
    // 生产环境可以上报错误
    if (!this.isDev) {
      this.reportError(...args)
    }
  }

  // 调试日志
  debug(...args) {
    if (this.isDebug) {
      console.log('[DEBUG]', ...args)
    }
  }

  // 性能日志
  performance(label, startTime) {
    if (this.isDebug) {
      const duration = Date.now() - startTime
      console.log(`[PERF] ${label}: ${duration}ms`)
    }
  }

  // 错误上报（生产环境）
  async reportError(...args) {
    try {
      // 这里可以集成错误监控服务
      // 比如 Sentry, Bugsnag 等
      const errorInfo = {
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        platform: uni.getSystemInfoSync().platform,
        version: uni.getSystemInfoSync().version
      }
      
      // 示例：上报到后端
      // await uni.request({
      //   url: '/api/error/report',
      //   method: 'POST',
      //   data: errorInfo
      // })
    } catch (e) {
      // 静默处理上报失败
    }
  }

  // 开启/关闭调试模式
  setDebugMode(enabled) {
    uni.setStorageSync('debug_mode', enabled ? 'true' : 'false')
    this.isDebug = enabled
  }
}

// 创建全局实例
const logger = new Logger()

export default logger