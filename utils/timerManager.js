// +----------------------------------------------------------------------
// | 定时器管理工具 - 防止内存泄漏
// +----------------------------------------------------------------------

class TimerManager {
  constructor() {
    this.timers = new Map()
    this.intervals = new Map()
    this.idCounter = 0
  }

  // 创建setTimeout，自动管理
  setTimeout(callback, delay, ...args) {
    const id = ++this.idCounter
    const timerId = setTimeout(() => {
      // 执行回调
      callback(...args)
      // 自动清理
      this.timers.delete(id)
    }, delay)
    
    this.timers.set(id, timerId)
    return id
  }

  // 创建setInterval，自动管理
  setInterval(callback, delay, ...args) {
    const id = ++this.idCounter
    const intervalId = setInterval(() => {
      callback(...args)
    }, delay)
    
    this.intervals.set(id, intervalId)
    return id
  }

  // 清除特定定时器
  clearTimeout(id) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id))
      this.timers.delete(id)
      return true
    }
    return false
  }

  // 清除特定间隔器
  clearInterval(id) {
    if (this.intervals.has(id)) {
      clearInterval(this.intervals.get(id))
      this.intervals.delete(id)
      return true
    }
    return false
  }

  // 清除所有定时器
  clearAll() {
    // 清除所有setTimeout
    this.timers.forEach(timerId => clearTimeout(timerId))
    this.timers.clear()
    
    // 清除所有setInterval
    this.intervals.forEach(intervalId => clearInterval(intervalId))
    this.intervals.clear()
  }

  // 获取当前活跃的定时器数量
  getActiveCount() {
    return {
      timeouts: this.timers.size,
      intervals: this.intervals.size,
      total: this.timers.size + this.intervals.size
    }
  }

  // 调试信息
  debug() {
    const count = this.getActiveCount()
    return {
      ...count,
      timeoutIds: Array.from(this.timers.keys()),
      intervalIds: Array.from(this.intervals.keys())
    }
  }
}

// Vue 3 Composition API Hook
export function useTimers() {
  const timerManager = new TimerManager()
  
  // 在组件卸载时自动清理
  import { onUnmounted } from 'vue'
  onUnmounted(() => {
    timerManager.clearAll()
  })

  return {
    setTimeout: (callback, delay, ...args) => timerManager.setTimeout(callback, delay, ...args),
    setInterval: (callback, delay, ...args) => timerManager.setInterval(callback, delay, ...args),
    clearTimeout: (id) => timerManager.clearTimeout(id),
    clearInterval: (id) => timerManager.clearInterval(id),
    clearAll: () => timerManager.clearAll(),
    getActiveCount: () => timerManager.getActiveCount()
  }
}

// 创建全局实例
const globalTimerManager = new TimerManager()

export default globalTimerManager