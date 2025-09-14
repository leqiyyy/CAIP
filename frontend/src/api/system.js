/**
 * 系统管理相关API接口
 * 包含系统状态监控、配置管理、日志查询、性能统计等功能
 */

import api, { modelClient, handleApiResponse, handleApiError } from './index'

export const systemApi = {
  /**
   * 获取系统健康状态
   * @returns {Promise<Object>} 系统健康状态
   */
  async getSystemHealth() {
    try {
      const response = await api.get('/system/health')
      return handleApiResponse(response)
    } catch (error) {
      return {
        status: 'degraded',
        services: {
          web_server: 'healthy',
          database: 'unknown',
          ai_model: 'unhealthy',
          blockchain_rpc: 'unknown'
        },
        uptime: 0,
        last_check: new Date().toISOString()
      }
    }
  },

  /**
   * 获取系统性能指标
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 性能指标
   */
  async getSystemMetrics(options = {}) {
    try {
      const response = await api.get('/system/metrics', {
        time_range: options.timeRange || '1h',
        granularity: options.granularity || '5m',
        include_details: options.includeDetails || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        network_io: { in: 0, out: 0 },
        request_rate: 0,
        error_rate: 0,
        response_time: 0
      }
    }
  },

  /**
   * 获取AI模型服务状态
   * @returns {Promise<Object>} AI模型服务状态
   */
  async getAIServiceStatus() {
    try {
      const response = await modelClient.get('/system/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        service_available: false,
        model_loaded: false,
        gpu_available: false,
        memory_usage: 0,
        queue_size: 0,
        inference_count: 0,
        error_message: 'AI服务不可用'
      }
    }
  },

  /**
   * 获取系统配置
   * @param {string} [section] - 配置章节
   * @returns {Promise<Object>} 系统配置
   */
  async getSystemConfig(section) {
    try {
      const url = section ? `/system/config/${section}` : '/system/config'
      const response = await api.get(url)
      return handleApiResponse(response)
    } catch (error) {
      return {
        version: 'unknown',
        environment: 'unknown',
        features: {},
        settings: {}
      }
    }
  },

  /**
   * 更新系统配置
   * @param {Object} configData - 配置数据
   * @param {string} [section] - 配置章节
   * @returns {Promise<Object>} 更新结果
   */
  async updateSystemConfig(configData, section) {
    try {
      const url = section ? `/system/config/${section}` : '/system/config'
      const response = await api.put(url, configData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取系统日志
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 系统日志
   */
  async getSystemLogs(options = {}) {
    try {
      const response = await api.get('/system/logs', {
        level: options.level || 'info', // debug, info, warn, error
        component: options.component, // web, ai, blockchain, detection
        page: options.page || 1,
        limit: options.limit || 100,
        date_from: options.dateFrom,
        date_to: options.dateTo,
        search: options.search
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total: 0,
        page: 1,
        limit: 100,
        logs: [],
        summary: {
          error_count: 0,
          warn_count: 0,
          info_count: 0
        }
      }
    }
  },

  /**
   * 获取错误统计
   * @param {Object} [options] - 统计选项
   * @returns {Promise<Object>} 错误统计
   */
  async getErrorStatistics(options = {}) {
    try {
      const response = await api.get('/system/errors/statistics', {
        time_range: options.timeRange || '24h',
        group_by: options.groupBy || 'hour',
        include_details: options.includeDetails || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_errors: 0,
        error_rate: 0,
        error_types: {},
        trending: 'stable'
      }
    }
  },

  /**
   * 获取用户活动统计
   * @param {Object} [options] - 统计选项
   * @returns {Promise<Object>} 用户活动统计
   */
  async getUserActivityStats(options = {}) {
    try {
      const response = await api.get('/system/users/activity', {
        time_range: options.timeRange || '7d',
        group_by: options.groupBy || 'day',
        include_anonymous: options.includeAnonymous !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        active_users: 0,
        total_sessions: 0,
        avg_session_duration: 0,
        page_views: 0,
        api_calls: 0
      }
    }
  },

  /**
   * 获取检测服务统计
   * @param {Object} [options] - 统计选项
   * @returns {Promise<Object>} 检测服务统计
   */
  async getDetectionServiceStats(options = {}) {
    try {
      const response = await api.get('/system/detection/statistics', {
        time_range: options.timeRange || '24h',
        include_ai_metrics: options.includeAI !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_detections: 0,
        ai_detections: 0,
        rule_detections: 0,
        high_risk_detections: 0,
        avg_response_time: 0,
        success_rate: 0
      }
    }
  },

  /**
   * 获取数据库状态
   * @returns {Promise<Object>} 数据库状态
   */
  async getDatabaseStatus() {
    try {
      const response = await api.get('/system/database/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        connected: false,
        connections: 0,
        max_connections: 0,
        size: 0,
        tables: 0,
        last_backup: null
      }
    }
  },

  /**
   * 执行系统维护任务
   * @param {Object} maintenanceData - 维护任务数据
   * @param {string} maintenanceData.task - 任务类型
   * @param {Object} [maintenanceData.options] - 任务选项
   * @returns {Promise<Object>} 维护任务结果
   */
  async executeMaintenanceTask(maintenanceData) {
    try {
      const response = await api.post('/system/maintenance', {
        task_type: maintenanceData.task,
        task_options: maintenanceData.options || {},
        scheduled: maintenanceData.scheduled || false,
        notification: maintenanceData.notification !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取系统备份状态
   * @returns {Promise<Object>} 备份状态
   */
  async getBackupStatus() {
    try {
      const response = await api.get('/system/backup/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        last_backup: null,
        backup_size: 0,
        backup_count: 0,
        auto_backup_enabled: false,
        next_backup: null
      }
    }
  },

  /**
   * 创建系统备份
   * @param {Object} [backupOptions] - 备份选项
   * @returns {Promise<Object>} 备份结果
   */
  async createBackup(backupOptions = {}) {
    try {
      const response = await api.post('/system/backup/create', {
        include_database: backupOptions.includeDatabase !== false,
        include_logs: backupOptions.includeLogs || false,
        include_config: backupOptions.includeConfig !== false,
        compression: backupOptions.compression !== false,
        description: backupOptions.description || ''
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取系统版本信息
   * @returns {Promise<Object>} 版本信息
   */
  async getVersionInfo() {
    try {
      const response = await api.get('/system/version')
      return handleApiResponse(response)
    } catch (error) {
      return {
        version: 'unknown',
        build: 'unknown',
        build_date: null,
        git_commit: 'unknown',
        environment: 'unknown'
      }
    }
  },

  /**
   * 获取许可证信息
   * @returns {Promise<Object>} 许可证信息
   */
  async getLicenseInfo() {
    try {
      const response = await api.get('/system/license')
      return handleApiResponse(response)
    } catch (error) {
      return {
        type: 'unknown',
        expires: null,
        features: [],
        limitations: {}
      }
    }
  },

  /**
   * 获取系统通知
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 系统通知
   */
  async getSystemNotifications(options = {}) {
    try {
      const response = await api.get('/system/notifications', {
        unread_only: options.unreadOnly || false,
        priority: options.priority, // low, medium, high, critical
        category: options.category, // system, security, maintenance, update
        page: options.page || 1,
        limit: options.limit || 20
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total: 0,
        unread: 0,
        notifications: []
      }
    }
  },

  /**
   * 标记通知为已读
   * @param {Array|string} notificationIds - 通知ID或ID数组
   * @returns {Promise<Object>} 标记结果
   */
  async markNotificationsRead(notificationIds) {
    try {
      const response = await api.post('/system/notifications/mark-read', {
        notification_ids: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取API使用统计
   * @param {Object} [options] - 统计选项
   * @returns {Promise<Object>} API使用统计
   */
  async getAPIUsageStats(options = {}) {
    try {
      const response = await api.get('/system/api/usage', {
        time_range: options.timeRange || '24h',
        endpoint: options.endpoint,
        group_by: options.groupBy || 'hour'
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_requests: 0,
        successful_requests: 0,
        failed_requests: 0,
        avg_response_time: 0,
        top_endpoints: []
      }
    }
  },

  /**
   * 重启系统服务
   * @param {Object} serviceData - 服务数据
   * @param {string} serviceData.service - 服务名称
   * @param {boolean} [serviceData.force=false] - 是否强制重启
   * @returns {Promise<Object>} 重启结果
   */
  async restartService(serviceData) {
    try {
      const response = await api.post('/system/services/restart', {
        service_name: serviceData.service,
        force_restart: serviceData.force || false,
        wait_for_ready: serviceData.waitForReady !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取系统资源使用预测
   * @param {Object} [options] - 预测选项
   * @returns {Promise<Object>} 资源使用预测
   */
  async getResourceForecast(options = {}) {
    try {
      const response = await api.get('/system/forecast/resources', {
        forecast_hours: options.forecastHours || 24,
        include_trends: options.includeTrends !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        cpu_forecast: [],
        memory_forecast: [],
        disk_forecast: [],
        network_forecast: [],
        recommendations: []
      }
    }
  }
}

export default systemApi 