// 认证状态管理模块
const state = {
  // 用户信息
  user: null,
  
  // 认证状态
  isAuthenticated: false,
  
  // 认证令牌
  token: null,
  
  // 登录状态
  loginLoading: false,
  
  // 用户权限
  permissions: []
}

const mutations = {
  // 设置用户信息
  SET_USER(state, user) {
    state.user = user
  },
  
  // 设置认证状态
  SET_AUTHENTICATED(state, status) {
    state.isAuthenticated = status
  },
  
  // 设置令牌
  SET_TOKEN(state, token) {
    state.token = token
  },
  
  // 设置登录加载状态
  SET_LOGIN_LOADING(state, loading) {
    state.loginLoading = loading
  },
  
  // 设置权限
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },
  
  // 清除认证信息
  CLEAR_AUTH(state) {
    state.user = null
    state.isAuthenticated = false
    state.token = null
    state.permissions = []
  }
}

const actions = {
  // 登录
  async login({ commit, dispatch }, { username, password }) {
    try {
      commit('SET_LOGIN_LOADING', true)
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // 设置用户信息
        const user = {
          username: data.username,
          role: username === 'admin' ? 'admin' : 'user',
          loginTime: new Date().toISOString()
        }
        
        commit('SET_USER', user)
        commit('SET_AUTHENTICATED', true)
        commit('SET_TOKEN', data.token || 'mock-token')
        
        // 设置默认权限
        const permissions = user.role === 'admin' 
          ? ['read', 'write', 'admin', 'settings']
          : ['read', 'write']
        commit('SET_PERMISSIONS', permissions)
        
        // 保存到localStorage
        localStorage.setItem('auth_token', state.token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        dispatch('app/showSuccess', '登录成功', { root: true })
        
        return { success: true, user }
      } else {
        throw new Error(data.error || '登录失败')
      }
    } catch (error) {
      dispatch('app/showError', error.message, { root: true })
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOGIN_LOADING', false)
    }
  },
  
  // 退出登录
  async logout({ commit, dispatch }) {
    try {
      // 清除状态
      commit('CLEAR_AUTH')
      
      // 清除localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_state')
      
      dispatch('app/showSuccess', '已安全退出', { root: true })
      
      return { success: true }
    } catch (error) {
      dispatch('app/showError', '退出登录失败', { root: true })
      return { success: false, error: error.message }
    }
  },
  
  // 初始化认证状态
  async initAuth({ commit, dispatch }) {
    try {
      // 从localStorage恢复状态
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      const savedState = localStorage.getItem('auth_state')
      
      if (savedToken && savedUser) {
        const user = JSON.parse(savedUser)
        
        // 验证token是否有效（这里简化处理）
        const isValid = await dispatch('validateToken', savedToken)
        
        if (isValid) {
          commit('SET_TOKEN', savedToken)
          commit('SET_USER', user)
          commit('SET_AUTHENTICATED', true)
          
          // 设置权限
          const permissions = user.role === 'admin' 
            ? ['read', 'write', 'admin', 'settings']
            : ['read', 'write']
          commit('SET_PERMISSIONS', permissions)
          
          console.log('✅ 认证状态已恢复:', user.username)
        } else {
          // token无效，清除状态
          dispatch('logout')
        }
      }
      
      // 如果有保存的完整状态，也恢复它
      if (savedState) {
        const authState = JSON.parse(savedState)
        if (authState.isAuthenticated && authState.user) {
          commit('SET_USER', authState.user)
          commit('SET_AUTHENTICATED', authState.isAuthenticated)
          commit('SET_PERMISSIONS', authState.permissions || [])
        }
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error)
      dispatch('logout')
    }
  },
  
  // 验证token
  async validateToken({ commit }, token) {
    try {
      // 这里应该调用后端API验证token
      // 暂时简化处理，认为所有token都有效
      if (token && token.length > 0) {
        return true
      }
      return false
    } catch (error) {
      console.error('验证token失败:', error)
      return false
    }
  },
  
  // 检查权限
  hasPermission({ state }, permission) {
    return state.permissions.includes(permission)
  },
  
  // 检查角色
  hasRole({ state }, role) {
    return state.user && state.user.role === role
  }
}

const getters = {
  // 是否已认证
  isAuthenticated: state => state.isAuthenticated,
  
  // 获取用户信息
  user: state => state.user,
  
  // 获取用户名
  username: state => state.user?.username || '',
  
  // 获取用户角色
  userRole: state => state.user?.role || 'guest',
  
  // 获取令牌
  token: state => state.token,
  
  // 是否为管理员
  isAdmin: state => state.user?.role === 'admin',
  
  // 登录加载状态
  loginLoading: state => state.loginLoading,
  
  // 获取权限列表
  permissions: state => state.permissions,
  
  // 检查是否有特定权限
  hasPermission: (state) => (permission) => {
    return state.permissions.includes(permission)
  },
  
  // 检查是否有特定角色
  hasRole: (state) => (role) => {
    return state.user?.role === role
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 