/**
 * 认证相关API接口
 * 包含用户登录、注册、权限验证、密码管理等功能
 */

import api, { handleApiResponse, handleApiError } from './index'

export const authApi = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @param {string} [credentials.captcha] - 验证码
   * @returns {Promise<Object>} 登录结果
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password,
        captcha: credentials.captcha,
        device_info: this.getDeviceInfo()
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @param {string} userData.confirmPassword - 确认密码
   * @returns {Promise<Object>} 注册结果
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        invitation_code: userData.invitationCode,
        device_info: this.getDeviceInfo()
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 用户登出
   * @returns {Promise<Object>} 登出结果
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<Object>} 新的访问令牌
   */
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 验证访问令牌
   * @param {string} token - 访问令牌
   * @returns {Promise<Object>} 验证结果
   */
  async verifyToken(token) {
    try {
      const response = await api.post('/auth/verify', {
        token: token
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 更新用户信息
   * @param {Object} userInfo - 用户信息
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile(userInfo) {
    try {
      const response = await api.put('/auth/profile', {
        display_name: userInfo.displayName,
        email: userInfo.email,
        phone: userInfo.phone,
        avatar: userInfo.avatar,
        preferences: userInfo.preferences
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @param {string} passwordData.oldPassword - 旧密码
   * @param {string} passwordData.newPassword - 新密码
   * @param {string} passwordData.confirmPassword - 确认新密码
   * @returns {Promise<Object>} 修改结果
   */
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/password', {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 发送密码重置邮件
   * @param {string} email - 邮箱地址
   * @returns {Promise<Object>} 发送结果
   */
  async sendPasswordResetEmail(email) {
    try {
      const response = await api.post('/auth/password/reset', {
        email: email
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 重置密码
   * @param {Object} resetData - 重置数据
   * @param {string} resetData.token - 重置令牌
   * @param {string} resetData.password - 新密码
   * @param {string} resetData.confirmPassword - 确认密码
   * @returns {Promise<Object>} 重置结果
   */
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/password/reset/confirm', {
        token: resetData.token,
        password: resetData.password,
        confirm_password: resetData.confirmPassword
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取用户权限列表
   * @returns {Promise<Array>} 权限列表
   */
  async getUserPermissions() {
    try {
      const response = await api.get('/auth/permissions')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 检查用户是否有特定权限
   * @param {string} permission - 权限名称
   * @returns {Promise<boolean>} 是否有权限
   */
  async hasPermission(permission) {
    try {
      const response = await api.get(`/auth/permissions/check`, {
        permission: permission
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 启用二步验证
   * @returns {Promise<Object>} 二步验证设置
   */
  async enableTwoFactor() {
    try {
      const response = await api.post('/auth/2fa/enable')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 验证二步验证码
   * @param {string} code - 验证码
   * @returns {Promise<Object>} 验证结果
   */
  async verifyTwoFactor(code) {
    try {
      const response = await api.post('/auth/2fa/verify', {
        code: code
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 禁用二步验证
   * @param {string} password - 密码确认
   * @returns {Promise<Object>} 禁用结果
   */
  async disableTwoFactor(password) {
    try {
      const response = await api.post('/auth/2fa/disable', {
        password: password
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取登录历史
   * @param {Object} options - 查询选项
   * @param {number} [options.page=1] - 页码
   * @param {number} [options.limit=20] - 每页数量
   * @returns {Promise<Object>} 登录历史
   */
  async getLoginHistory(options = {}) {
    try {
      const response = await api.get('/auth/login-history', {
        page: options.page || 1,
        limit: options.limit || 20
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取活跃会话列表
   * @returns {Promise<Array>} 会话列表
   */
  async getActiveSessions() {
    try {
      const response = await api.get('/auth/sessions')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 终止指定会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Object>} 终止结果
   */
  async terminateSession(sessionId) {
    try {
      const response = await api.delete(`/auth/sessions/${sessionId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 终止所有其他会话
   * @returns {Promise<Object>} 终止结果
   */
  async terminateAllOtherSessions() {
    try {
      const response = await api.delete('/auth/sessions/others')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  getDeviceInfo() {
    return {
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen_resolution: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * 验证邮箱
   * @param {string} token - 验证令牌
   * @returns {Promise<Object>} 验证结果
   */
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/email/verify', {
        token: token
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 重新发送邮箱验证邮件
   * @returns {Promise<Object>} 发送结果
   */
  async resendEmailVerification() {
    try {
      const response = await api.post('/auth/email/resend')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default authApi 