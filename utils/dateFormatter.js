// +----------------------------------------------------------------------
// | 日期时间格式化工具 - 统一处理时间显示
// +----------------------------------------------------------------------

class DateFormatter {
  
  /**
   * 解析时间为时间戳
   * @param {string|number} time 时间
   * @returns {number} 时间戳(毫秒)
   */
  static parseTimestamp(time) {
    if (!time) return 0;
    
    try {
      if (typeof time === 'string') {
        // 处理字符串格式的时间
        return new Date(time.replace(/-/g, '/')).getTime();
      } else if (typeof time === 'number') {
        // 判断是秒还是毫秒
        return time > 9999999999 ? time : time * 1000;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 相对时间格式化（多久前）
   * @param {string|number} time 时间
   * @returns {string} 格式化后的时间
   */
  static formatRelativeTime(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    // 小于1分钟
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    // 小于1小时
    else if (diff < 60 * 60 * 1000) {
      return Math.floor(diff / (60 * 1000)) + '分钟前';
    }
    // 小于24小时
    else if (diff < 24 * 60 * 60 * 1000) {
      return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
    }
    // 小于30天
    else if (diff < 30 * 24 * 60 * 60 * 1000) {
      return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
    }
    // 大于30天，显示月日
    else {
      const date = new Date(timestamp);
      return (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
  }

  /**
   * 标准日期格式化
   * @param {string|number} time 时间
   * @param {string} format 格式模板
   * @returns {string} 格式化后的时间
   */
  static formatDate(time, format = 'YYYY-MM-DD') {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  }

  /**
   * 获取日期中的日
   * @param {string|number} time 时间
   * @returns {number|string} 日期中的日
   */
  static getDay(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      return date.getDate();
    } catch (error) {
      return 'N/A';
    }
  }

  /**
   * 获取月份和日期
   * @param {string|number} time 时间
   * @returns {string} 月日格式
   */
  static getMonthDay(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (error) {
      return '';
    }
  }

  /**
   * 获取年月日
   * @param {string|number} time 时间
   * @returns {string} 年月日格式
   */
  static getYearMonthDay(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (error) {
      return '';
    }
  }

  /**
   * 智能时间显示：今天显示时间，昨天显示"昨天"，更早显示日期
   * @param {string|number} time 时间
   * @returns {string} 智能格式化后的时间
   */
  static smartFormat(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (targetDay.getTime() === today.getTime()) {
      // 今天：显示时分
      return this.formatDate(time, 'HH:mm');
    } else if (targetDay.getTime() === yesterday.getTime()) {
      // 昨天
      return '昨天';
    } else if (date.getFullYear() === now.getFullYear()) {
      // 今年：显示月日
      return this.getMonthDay(time);
    } else {
      // 往年：显示年月日
      return this.formatDate(time, 'YYYY/MM/DD');
    }
  }

  /**
   * 检查时间是否为今天
   * @param {string|number} time 时间
   * @returns {boolean} 是否为今天
   */
  static isToday(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return false;
    
    const now = new Date();
    const date = new Date(timestamp);
    
    return now.getFullYear() === date.getFullYear() &&
           now.getMonth() === date.getMonth() &&
           now.getDate() === date.getDate();
  }

  /**
   * 检查时间是否为昨天
   * @param {string|number} time 时间
   * @returns {boolean} 是否为昨天
   */
  static isYesterday(time) {
    const timestamp = this.parseTimestamp(time);
    if (!timestamp) return false;
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const date = new Date(timestamp);
    
    return yesterday.getFullYear() === date.getFullYear() &&
           yesterday.getMonth() === date.getMonth() &&
           yesterday.getDate() === date.getDate();
  }
}

export default DateFormatter