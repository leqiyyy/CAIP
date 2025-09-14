/**
 * API统一导出文件
 * 整合所有API模块，提供统一的访问接口
 */

// 导入所有API模块
import authApi from './auth'
import aiApi from './ai'
import blockchainApi from './blockchain'
import detectionApi from './detection'
import systemApi from './system'
import analyticsApi from './analytics'
import { apiClient, modelClient } from './index'

// 统一导出所有API
export {
  authApi,
  aiApi,
  blockchainApi,
  detectionApi,
  systemApi,
  analyticsApi,
  apiClient,
  modelClient
}

// 创建API实例集合
export const apis = {
  auth: authApi,
  ai: aiApi,
  blockchain: blockchainApi,
  detection: detectionApi,
  system: systemApi,
  analytics: analyticsApi
}

// 默认导出
export default apis

/**
 * API使用示例：
 * 
 * // 方式1：直接导入特定API
 * import { authApi, aiApi } from '@/api'
 * const user = await authApi.getCurrentUser()
 * const status = await aiApi.getModelStatus()
 * 
 * // 方式2：导入API集合
 * import apis from '@/api'
 * const user = await apis.auth.getCurrentUser()
 * const status = await apis.ai.getModelStatus()
 * 
 * // 方式3：在组件中使用
 * this.$api.auth.login(credentials)
 * this.$api.ai.predictAddressRisk(addressData)
 */ 