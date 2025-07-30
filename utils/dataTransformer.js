// +----------------------------------------------------------------------
// | 数据转换工具 - 统一处理API响应数据
// +----------------------------------------------------------------------

import standards from '@/config/standards.js'

class DataTransformer {
  
  /**
   * 标准化用户信息
   * @param {Object} rawUserData 原始用户数据
   * @returns {Object} 标准化后的用户数据
   */
  static transformUserInfo(rawUserData) {
    if (!rawUserData || typeof rawUserData !== 'object') {
      return null
    }

    return {
      uid: rawUserData.uid || rawUserData.id || rawUserData.user_id || 0,
      nickname: rawUserData.nickname || rawUserData.name || rawUserData.user_name || '',
      avatar: rawUserData.avatar || rawUserData.head_pic || rawUserData.photo || '',
      sex: rawUserData.sex || rawUserData.gender || 0,
      age: rawUserData.age || 0,
      phone: rawUserData.phone || rawUserData.mobile || '',
      email: rawUserData.email || '',
      followCount: rawUserData.follow_count || rawUserData.follows || 0,
      fansCount: rawUserData.fans_count || rawUserData.followers || 0,
      likeCount: rawUserData.like_count || rawUserData.likes || 0,
      visitorCount: rawUserData.visitor_count || rawUserData.visitors || 0,
      isVerified: rawUserData.is_verified || rawUserData.verified || 0,
      vipStatus: rawUserData.vip_status || rawUserData.is_vip || 0,
      aboutMe: rawUserData.about_me || rawUserData.description || rawUserData.bio || '',
      interestTags: rawUserData.interest_tags || rawUserData.tags || []
    }
  }

  /**
   * 标准化列表响应
   * @param {Object} rawResponse 原始响应数据
   * @param {Function} itemTransformer 列表项转换函数
   * @returns {Object} 标准化后的列表数据
   */
  static transformListResponse(rawResponse, itemTransformer = null) {
    if (!rawResponse || typeof rawResponse !== 'object') {
      return {
        list: [],
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        hasMore: false
      }
    }

    const data = rawResponse.data || rawResponse
    const list = data.list || data.data || data.items || []
    
    return {
      list: itemTransformer ? list.map(itemTransformer) : list,
      currentPage: parseInt(data.page || data.current_page || 1),
      pageSize: parseInt(data.limit || data.page_size || data.per_page || 10),
      totalCount: parseInt(data.total || data.total_count || data.count || 0),
      hasMore: list.length >= (data.limit || data.page_size || 10)
    }
  }

  /**
   * 标准化笔记/动态数据
   * @param {Object} rawNoteData 原始笔记数据
   * @returns {Object} 标准化后的笔记数据
   */
  static transformNoteInfo(rawNoteData) {
    if (!rawNoteData || typeof rawNoteData !== 'object') {
      return null
    }

    return {
      id: rawNoteData.id || 0,
      type: rawNoteData.type || 1,
      title: rawNoteData.title || '',
      content: rawNoteData.content || rawNoteData.text || '',
      images: rawNoteData.images || rawNoteData.pics || rawNoteData.img || [],
      video: rawNoteData.video || rawNoteData.video_url || '',
      audio: rawNoteData.audio || rawNoteData.audio_url || '',
      userInfo: this.transformUserInfo(rawNoteData.user || rawNoteData.user_info),
      likeCount: rawNoteData.like_count || rawNoteData.likes || 0,
      commentCount: rawNoteData.comment_count || rawNoteData.comments || 0,
      shareCount: rawNoteData.share_count || rawNoteData.shares || 0,
      browseCount: rawNoteData.browse_count || rawNoteData.views || 0,
      isLike: rawNoteData.is_like || rawNoteData.liked || false,
      isFollow: rawNoteData.is_follow || rawNoteData.followed || false,
      isCollect: rawNoteData.is_collect || rawNoteData.collected || false,
      createTime: rawNoteData.create_time || rawNoteData.created_at || '',
      updateTime: rawNoteData.update_time || rawNoteData.updated_at || '',
      tags: rawNoteData.tags || [],
      topicInfo: rawNoteData.topic_info || rawNoteData.topic || null
    }
  }

  /**
   * 标准化评论数据
   * @param {Object} rawCommentData 原始评论数据
   * @returns {Object} 标准化后的评论数据
   */
  static transformCommentInfo(rawCommentData) {
    if (!rawCommentData || typeof rawCommentData !== 'object') {
      return null
    }

    return {
      id: rawCommentData.id || 0,
      content: rawCommentData.content || rawCommentData.text || '',
      userInfo: this.transformUserInfo(rawCommentData.user || rawCommentData.user_info),
      likeCount: rawCommentData.like_count || rawCommentData.likes || 0,
      isLike: rawCommentData.is_like || rawCommentData.liked || false,
      createTime: rawCommentData.create_time || rawCommentData.created_at || '',
      parentId: rawCommentData.parent_id || rawCommentData.pid || 0,
      replies: rawCommentData.replies || rawCommentData.children || []
    }
  }

  /**
   * 标准化订单数据
   * @param {Object} rawOrderData 原始订单数据
   * @returns {Object} 标准化后的订单数据
   */
  static transformOrderInfo(rawOrderData) {
    if (!rawOrderData || typeof rawOrderData !== 'object') {
      return null
    }

    return {
      id: rawOrderData.id || rawOrderData.order_id || '',
      orderNumber: rawOrderData.order_number || rawOrderData.order_sn || '',
      status: rawOrderData.status || rawOrderData.order_status || 0,
      statusText: rawOrderData.status_text || rawOrderData.status_name || '',
      totalAmount: parseFloat(rawOrderData.total_amount || rawOrderData.pay_price || rawOrderData.price || 0),
      payAmount: parseFloat(rawOrderData.pay_amount || rawOrderData.pay_price || 0),
      createTime: rawOrderData.create_time || rawOrderData.created_at || '',
      payTime: rawOrderData.pay_time || rawOrderData.paid_at || '',
      products: rawOrderData.products || rawOrderData.items || rawOrderData.goods || []
    }
  }

  /**
   * 标准化商品数据
   * @param {Object} rawProductData 原始商品数据
   * @returns {Object} 标准化后的商品数据
   */
  static transformProductInfo(rawProductData) {
    if (!rawProductData || typeof rawProductData !== 'object') {
      return null
    }

    return {
      id: rawProductData.id || rawProductData.product_id || 0,
      name: rawProductData.name || rawProductData.title || rawProductData.product_name || '',
      image: rawProductData.image || rawProductData.pic || rawProductData.img || '',
      images: rawProductData.images || rawProductData.pics || rawProductData.slider || [],
      price: parseFloat(rawProductData.price || rawProductData.shop_price || 0),
      originalPrice: parseFloat(rawProductData.original_price || rawProductData.market_price || 0),
      description: rawProductData.description || rawProductData.info || rawProductData.desc || '',
      salesCount: rawProductData.sales_count || rawProductData.sales || 0,
      stock: rawProductData.stock || rawProductData.inventory || 0,
      isHot: rawProductData.is_hot || rawProductData.hot || false,
      isNew: rawProductData.is_new || rawProductData.new || false,
      tags: rawProductData.tags || []
    }
  }

  /**
   * 清理和验证数据
   * @param {any} data 需要清理的数据
   * @param {Object} schema 数据结构定义
   * @returns {any} 清理后的数据
   */
  static sanitizeData(data, schema = {}) {
    if (data === null || data === undefined) {
      return null
    }

    if (typeof data !== 'object') {
      return data
    }

    const cleaned = {}
    
    for (const [key, value] of Object.entries(data)) {
      // 移除空值和无效值
      if (value === null || value === undefined || value === '') {
        continue
      }
      
      // 处理数组
      if (Array.isArray(value)) {
        cleaned[key] = value.filter(item => item !== null && item !== undefined)
      }
      // 处理对象
      else if (typeof value === 'object') {
        const nestedCleaned = this.sanitizeData(value, schema[key])
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned
        }
      }
      // 处理基本类型
      else {
        cleaned[key] = value
      }
    }

    return cleaned
  }

  /**
   * 批量转换列表数据
   * @param {Array} rawList 原始列表数据
   * @param {Function} transformer 转换函数
   * @returns {Array} 转换后的列表数据
   */
  static transformList(rawList, transformer) {
    if (!Array.isArray(rawList)) {
      return []
    }

    return rawList
      .filter(item => item && typeof item === 'object')
      .map(transformer)
      .filter(item => item !== null)
  }
}

export default DataTransformer