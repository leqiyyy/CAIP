/**
 * API基础配置文件
 * 包含HTTP客户端配置、拦截器、错误处理等
 */

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// API基础URL配置
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000/api'
const MODEL_SERVER_URL = process.env.VUE_APP_MODEL_SERVER_URL || 'http://localhost:5001/api'

// 创建HTTP客户端实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 创建AI模型服务客户端
const modelClient = axios.create({
  baseURL: MODEL_SERVER_URL,
  timeout: 60000, // AI推理可能需要更长时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加认证token
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = generateRequestId()
    
    // 记录请求日志
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    })
    
    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 记录响应日志
    console.log(`✅ API Response: ${response.config.url}`, {
      status: response.status,
      data: response.data
    })
    
    return response
  },
  error => {
    const { response } = error
    
    console.error(`❌ API Error: ${error.config?.url}`, {
      status: response?.status,
      message: response?.data?.message || error.message
    })
    
    // 处理不同类型的错误
    if (response) {
      switch (response.status) {
        case 401:
          // 未授权，清除token并跳转登录
          store.dispatch('auth/logout')
          router.push('/auth')
          store.dispatch('app/showError', '登录已过期，请重新登录')
          break
          
        case 403:
          // 权限不足
          store.dispatch('app/showError', '权限不足，无法执行此操作')
          break
          
        case 404:
          // 资源不存在
          store.dispatch('app/showError', '请求的资源不存在')
          break
          
        case 422:
          // 参数验证错误
          const errors = response.data?.errors || {}
          const errorMessages = Object.values(errors).flat()
          store.dispatch('app/showError', errorMessages.join(', ') || '参数验证失败')
          break
          
        case 429:
          // 请求过于频繁
          store.dispatch('app/showWarning', '请求过于频繁，请稍后再试')
          break
          
        case 500:
          // 服务器错误
          store.dispatch('app/showError', '服务器内部错误，请稍后重试')
          break
          
        default:
          // 其他错误
          store.dispatch('app/showError', response.data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      // 请求超时
      store.dispatch('app/showError', '请求超时，请检查网络连接')
    } else {
      // 网络错误
      store.dispatch('app/showError', '网络连接失败，请检查网络设置')
    }
    
    return Promise.reject(error)
  }
)

// 为AI模型客户端添加相似的拦截器
modelClient.interceptors.request.use(
  config => {
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    config.headers['X-Request-ID'] = generateRequestId()
    console.log(`🤖 AI Model Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    return config
  },
  error => Promise.reject(error)
)

modelClient.interceptors.response.use(
  response => {
    console.log(`✅ AI Model Response: ${response.config.url}`)
    return response
  },
  error => {
    console.error(`❌ AI Model Error: ${error.config?.url}`, error.response?.data)
    
    // AI模型服务可能不可用时的兜底处理
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      store.dispatch('app/showWarning', 'AI模型服务暂时不可用，使用基础检测模式')
    }
    
    return Promise.reject(error)
  }
)

// 生成请求ID
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 通用API响应处理
export const handleApiResponse = (response) => {
  if (response.data?.success !== false) {
    return response.data
  } else {
    throw new Error(response.data?.message || 'API调用失败')
  }
}

// 通用错误处理
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  } else if (error.message) {
    throw new Error(error.message)
  } else {
    throw new Error('未知错误')
  }
}

// 文件上传配置
export const createUploadConfig = (onProgress) => ({
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onUploadProgress: (progressEvent) => {
    if (onProgress && progressEvent.total) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(percentCompleted)
    }
  }
})

// 导出客户端实例
export { apiClient, modelClient }

// 导出常用的HTTP方法
export default {
  // GET请求
  get: (url, params = {}) => apiClient.get(url, { params }),
  
  // POST请求
  post: (url, data = {}) => apiClient.post(url, data),
  
  // PUT请求
  put: (url, data = {}) => apiClient.put(url, data),
  
  // DELETE请求
  delete: (url) => apiClient.delete(url),
  
  // PATCH请求
  patch: (url, data = {}) => apiClient.patch(url, data),
  
  // AI模型专用请求
  aiGet: (url, params = {}) => modelClient.get(url, { params }),
  aiPost: (url, data = {}) => modelClient.post(url, data),
  
  // 批量请求
  all: (requests) => axios.all(requests),
  
  // 请求取消
  cancelToken: axios.CancelToken,
  isCancel: axios.isCancel
} 