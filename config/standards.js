// +----------------------------------------------------------------------
// | 项目代码规范配置
// +----------------------------------------------------------------------

export default {
  // 变量命名规范
  namingConventions: {
    // 响应式数据命名：驼峰命名法
    dataProperties: 'camelCase', // userInfo, statusBarHeight
    
    // 方法命名：动词+名词，驼峰命名法
    methods: 'camelCase', // getUserInfo, handleClick
    
    // 常量命名：全大写+下划线
    constants: 'SCREAMING_SNAKE_CASE', // HTTP_REQUEST_URL, TOKEN_NAME
    
    // 组件名称：帕斯卡命名法
    components: 'PascalCase', // UserProfile, MessageList
    
    // 文件名：短横线命名法
    files: 'kebab-case' // user-profile.vue, message-list.js
  },

  // 统一的状态属性名称
  standardStateNames: {
    // 用户相关
    userInfo: 'userInfo',
    isLogin: 'isLogin', 
    token: 'token',
    
    // UI状态
    isLoading: 'isLoading',
    isEmpty: 'isEmpty',
    loadStatus: 'loadStatus', // 'loading' | 'more' | 'noMore' | 'error'
    
    // 分页相关
    currentPage: 'currentPage',
    pageSize: 'pageSize',
    totalCount: 'totalCount',
    hasMore: 'hasMore',
    
    // 列表数据
    list: 'list',
    dataList: 'dataList',
    
    // 系统状态
    statusBarHeight: 'statusBarHeight',
    titleBarHeight: 'titleBarHeight'
  },

  // 接口字段映射标准化
  apiFieldMapping: {
    // 用户信息字段统一
    user: {
      id: 'uid',
      name: 'nickname', 
      avatar: 'avatar',
      gender: 'sex',
      age: 'age',
      phone: 'phone',
      email: 'email'
    },
    
    // 分页信息统一
    pagination: {
      current: 'page',
      size: 'limit', 
      total: 'total',
      totalPages: 'total_page'
    },
    
    // 响应结构统一
    response: {
      code: 'status',
      message: 'msg',
      data: 'data',
      success: 200
    }
  },

  // 禁用的变量名（避免冲突）
  forbiddenNames: [
    'data', 'props', 'emit', 'attrs', 'slots', // Vue 3保留字
    'this', 'self', 'that', // 避免混淆
    'temp', 'tmp', 'test', 'demo' // 不规范命名
  ],

  // 推荐的替代命名
  recommendedNames: {
    'data': 'formData | listData | responseData',
    'item': 'userItem | noteItem | orderItem',
    'list': 'userList | noteList | orderList',
    'info': 'userInfo | orderInfo | configInfo'
  }
}