// 应用状态管理模块
const state = {
  // 加载状态
  loading: false,
  
  // 应用配置
  config: {
    apiBaseUrl: 'http://localhost:5000/api',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    features: {
      aiEnabled: true,
      web3Enabled: true,
      realtimeEnabled: true
    }
  },
  
  // 系统统计
  stats: {
    totalAddressesChecked: 0,
    totalTransactionsAnalyzed: 0,
    threatsDetected: 0,
    detectionAccuracy: 0,
    systemUptime: '0%'
  },
  
  // 通知列表
  notifications: [],
  
  // 侧边栏状态
  sidebar: {
    collapsed: false,
    mobile: false
  },
  
  // 主题设置
  theme: {
    mode: 'light', // light | dark
    primaryColor: '#1e40af',
    size: 'default' // large | default | small
  }
}

const mutations = {
  // 设置加载状态
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  // 设置配置
  SET_CONFIG(state, config) {
    state.config = { ...state.config, ...config }
  },
  
  // 设置统计数据
  SET_STATS(state, stats) {
    state.stats = { ...state.stats, ...stats }
  },
  
  // 添加通知
  ADD_NOTIFICATION(state, notification) {
    const id = Date.now()
    state.notifications.push({
      id,
      type: 'info',
      duration: 3000,
      ...notification
    })
  },
  
  // 移除通知
  REMOVE_NOTIFICATION(state, id) {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      state.notifications.splice(index, 1)
    }
  },
  
  // 清空通知
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
  },
  
  // 切换侧边栏
  TOGGLE_SIDEBAR(state) {
    state.sidebar.collapsed = !state.sidebar.collapsed
  },
  
  // 设置侧边栏状态
  SET_SIDEBAR(state, { collapsed, mobile }) {
    if (collapsed !== undefined) state.sidebar.collapsed = collapsed
    if (mobile !== undefined) state.sidebar.mobile = mobile
  },
  
  // 设置主题
  SET_THEME(state, theme) {
    state.theme = { ...state.theme, ...theme }
  }
}

const actions = {
  // 加载配置
  async loadConfig({ commit, state }) {
    try {
      // 从localStorage恢复配置
      const savedConfig = localStorage.getItem('app_config')
      if (savedConfig) {
        commit('SET_CONFIG', JSON.parse(savedConfig))
      }
      
      // 可以从服务器获取最新配置
      // const response = await api.getConfig()
      // commit('SET_CONFIG', response.data)
      
      console.log('✅ 应用配置加载完成')
    } catch (error) {
      console.error('❌ 加载配置失败:', error)
    }
  },
  
  // 获取系统统计
  async fetchStats({ commit }) {
    try {
      const response = await fetch('/api/get_system_stats')
      const data = await response.json()
      
      if (data.status === 'success') {
        commit('SET_STATS', data.stats)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  },
  
  // 显示通知
  showNotification({ commit }, notification) {
    commit('ADD_NOTIFICATION', notification)
    
    // 自动移除通知
    if (notification.duration > 0) {
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', notification.id)
      }, notification.duration)
    }
  },
  
  // 显示成功通知
  showSuccess({ dispatch }, message) {
    dispatch('showNotification', {
      type: 'success',
      title: '操作成功',
      message,
      duration: 3000
    })
  },
  
  // 显示错误通知
  showError({ dispatch }, message) {
    dispatch('showNotification', {
      type: 'error',
      title: '操作失败',
      message,
      duration: 5000
    })
  },
  
  // 显示警告通知
  showWarning({ dispatch }, message) {
    dispatch('showNotification', {
      type: 'warning',
      title: '注意',
      message,
      duration: 4000
    })
  },
  
  // 设置主题
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme)
    
    // 保存到localStorage
    localStorage.setItem('app_theme', JSON.stringify(theme))
    
    // 应用到DOM
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  
  // 初始化主题
  initTheme({ dispatch, state }) {
    // 从localStorage恢复主题
    const savedTheme = localStorage.getItem('app_theme')
    if (savedTheme) {
      dispatch('setTheme', JSON.parse(savedTheme))
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch('setTheme', { mode: prefersDark ? 'dark' : 'light' })
    }
  }
}

const getters = {
  // 是否加载中
  isLoading: state => state.loading,
  
  // 获取配置
  config: state => state.config,
  
  // 获取API基础URL
  apiBaseUrl: state => state.config.apiBaseUrl,
  
  // 获取统计数据
  stats: state => state.stats,
  
  // 获取通知列表
  notifications: state => state.notifications,
  
  // 获取侧边栏状态
  sidebar: state => state.sidebar,
  
  // 获取主题
  theme: state => state.theme,
  
  // 是否为暗色主题
  isDarkMode: state => state.theme.mode === 'dark',
  
  // 是否为移动端
  isMobile: state => state.sidebar.mobile
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 