/**
 * 安全检测服务API接口
 * 包含地址风险检测、交易异常检测、实时威胁监控等功能
 */

import api, { aiApi, handleApiResponse, handleApiError } from './index'

export const detectionApi = {
  /**
   * 地址风险检测
   * @param {Object} addressData - 地址检测数据
   * @param {string} addressData.address - 以太坊地址
   * @param {boolean} [addressData.useAI=true] - 是否使用AI模型
   * @param {boolean} [addressData.detailed=false] - 是否返回详细分析
   * @returns {Promise<Object>} 检测结果
   */
  async detectAddressRisk(addressData) {
    try {
      // 首先尝试使用AI模型
      if (addressData.useAI !== false) {
        try {
          const aiResult = await aiApi.predictAddressRisk({
            address: addressData.address,
            includeGraph: addressData.includeGraph !== false,
            includeHistory: addressData.includeHistory !== false,
            enableExplanation: addressData.detailed !== false
          })
          
          return {
            ...aiResult,
            detection_method: 'ai_enhanced',
            ai_available: true
          }
        } catch (error) {
          console.warn('AI检测失败，使用规则引擎兜底:', error.message)
        }
      }
      
      // 兜底到规则引擎检测
      const response = await api.post('/detection/address/risk', {
        address: addressData.address,
        detailed_analysis: addressData.detailed || false,
        check_blacklist: addressData.checkBlacklist !== false,
        check_labels: addressData.checkLabels !== false,
        check_patterns: addressData.checkPatterns !== false
      })
      
      const result = handleApiResponse(response)
      return {
        ...result,
        detection_method: 'rule_based',
        ai_available: false
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 批量地址风险检测
   * @param {Object} batchData - 批量检测数据
   * @param {Array} batchData.addresses - 地址列表
   * @param {Object} [batchData.options] - 检测选项
   * @returns {Promise<Object>} 批量检测结果
   */
  async batchAddressDetection(batchData) {
    try {
      const response = await api.post('/detection/address/batch', {
        addresses: batchData.addresses,
        batch_size: batchData.batchSize || 50,
        detection_options: {
          use_ai: batchData.options?.useAI !== false,
          detailed: batchData.options?.detailed || false,
          timeout_per_address: batchData.options?.timeout || 30,
          concurrent_limit: batchData.options?.concurrentLimit || 10
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 交易风险检测
   * @param {Object} transactionData - 交易数据
   * @param {string} transactionData.txHash - 交易哈希
   * @param {boolean} [transactionData.useAI=true] - 是否使用AI模型
   * @returns {Promise<Object>} 交易风险检测结果
   */
  async detectTransactionRisk(transactionData) {
    try {
      // 尝试AI模型分析
      if (transactionData.useAI !== false) {
        try {
          const aiResult = await aiApi.analyzeTransactionSequence({
            txHash: transactionData.txHash,
            useAttention: true,
            detectPatterns: true,
            temporalAnalysis: true
          })
          
          return {
            ...aiResult,
            detection_method: 'ai_enhanced',
            ai_available: true
          }
        } catch (error) {
          console.warn('AI交易分析失败，使用规则检测:', error.message)
        }
      }
      
      // 规则引擎检测
      const response = await api.post('/detection/transaction/risk', {
        tx_hash: transactionData.txHash,
        check_anomalies: transactionData.checkAnomalies !== false,
        check_patterns: transactionData.checkPatterns !== false,
        include_address_risk: transactionData.includeAddressRisk !== false
      })
      
      const result = handleApiResponse(response)
      return {
        ...result,
        detection_method: 'rule_based',
        ai_available: false
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 实时威胁监控
   * @param {Object} monitorConfig - 监控配置
   * @param {Array} monitorConfig.addresses - 监控地址列表
   * @param {Object} [monitorConfig.alertConfig] - 告警配置
   * @returns {Promise<Object>} 监控设置结果
   */
  async setupRealtimeMonitoring(monitorConfig) {
    try {
      const response = await api.post('/detection/monitoring/setup', {
        monitor_addresses: monitorConfig.addresses,
        alert_config: {
          risk_threshold: monitorConfig.alertConfig?.riskThreshold || 0.7,
          notification_channels: monitorConfig.alertConfig?.channels || ['web'],
          alert_frequency: monitorConfig.alertConfig?.frequency || 'immediate',
          include_graph_analysis: monitorConfig.alertConfig?.includeGraph !== false
        },
        monitoring_options: {
          check_interval: monitorConfig.checkInterval || 60, // 秒
          enable_ai_analysis: monitorConfig.enableAI !== false,
          track_new_transactions: monitorConfig.trackTransactions !== false,
          track_balance_changes: monitorConfig.trackBalance !== false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取监控状态
   * @returns {Promise<Object>} 监控状态
   */
  async getMonitoringStatus() {
    try {
      const response = await api.get('/detection/monitoring/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        active_monitors: 0,
        total_addresses: 0,
        alerts_today: 0,
        system_status: 'unknown'
      }
    }
  },

  /**
   * 获取威胁情报
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 威胁情报
   */
  async getThreatIntelligence(options = {}) {
    try {
      const response = await api.get('/detection/threat-intelligence', {
        time_range: options.timeRange || '24h',
        threat_types: options.threatTypes || ['phishing', 'scam', 'mixer'],
        include_iocs: options.includeIOCs !== false,
        confidence_threshold: options.confidenceThreshold || 0.5
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_threats: 0,
        new_threats_24h: 0,
        threat_types: {},
        iocs: [],
        last_updated: null
      }
    }
  },

  /**
   * 提交可疑地址举报
   * @param {Object} reportData - 举报数据
   * @param {string} reportData.address - 可疑地址
   * @param {string} reportData.category - 威胁类别
   * @param {string} reportData.description - 描述
   * @returns {Promise<Object>} 举报结果
   */
  async reportSuspiciousAddress(reportData) {
    try {
      const response = await api.post('/detection/report/address', {
        suspicious_address: reportData.address,
        threat_category: reportData.category,
        description: reportData.description,
        evidence: reportData.evidence || [],
        reporter_info: {
          user_id: reportData.userId,
          contact: reportData.contact,
          anonymous: reportData.anonymous !== false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取检测历史
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 检测历史
   */
  async getDetectionHistory(options = {}) {
    try {
      const response = await api.get('/detection/history', {
        page: options.page || 1,
        limit: options.limit || 50,
        filter_type: options.filterType || 'all', // all, address, transaction
        date_from: options.dateFrom,
        date_to: options.dateTo,
        risk_level: options.riskLevel // low, medium, high, critical
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total: 0,
        page: 1,
        limit: 50,
        data: [],
        summary: {
          total_detections: 0,
          high_risk_count: 0,
          false_positive_rate: 0
        }
      }
    }
  },

  /**
   * 地址关联性分析
   * @param {Object} analysisData - 分析数据
   * @param {string} analysisData.centerAddress - 中心地址
   * @param {number} [analysisData.depth=2] - 分析深度
   * @returns {Promise<Object>} 关联性分析结果
   */
  async analyzeAddressRelations(analysisData) {
    try {
      // 优先使用AI图神经网络分析
      try {
        const aiResult = await aiApi.analyzeGraphRelations({
          centerAddress: analysisData.centerAddress,
          depth: analysisData.depth || 2,
          includeContracts: analysisData.includeContracts !== false
        })
        
        return {
          ...aiResult,
          analysis_method: 'graph_neural_network',
          ai_available: true
        }
      } catch (error) {
        console.warn('AI图分析失败，使用基础关联分析:', error.message)
      }
      
      // 基础关联分析
      const response = await api.post('/detection/analysis/relations', {
        center_address: analysisData.centerAddress,
        analysis_depth: analysisData.depth || 2,
        min_transaction_value: analysisData.minTxValue || 0.001,
        time_window_days: analysisData.timeWindow || 30,
        include_indirect: analysisData.includeIndirect !== false
      })
      
      const result = handleApiResponse(response)
      return {
        ...result,
        analysis_method: 'rule_based',
        ai_available: false
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 异常模式检测
   * @param {Object} patternData - 模式数据
   * @param {Array} patternData.addresses - 地址列表
   * @param {string} [patternData.analysisType='behavior'] - 分析类型
   * @returns {Promise<Object>} 异常模式检测结果
   */
  async detectAnomalousPatterns(patternData) {
    try {
      const response = await api.post('/detection/patterns/anomalies', {
        target_addresses: patternData.addresses,
        analysis_type: patternData.analysisType || 'behavior',
        pattern_options: {
          time_window_days: patternData.timeWindow || 30,
          min_transaction_count: patternData.minTxCount || 10,
          detect_clustering: patternData.detectClustering !== false,
          detect_timing_patterns: patternData.detectTiming !== false,
          detect_value_patterns: patternData.detectValue !== false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 风险评分校准
   * @param {Object} calibrationData - 校准数据
   * @param {string} calibrationData.address - 地址
   * @param {number} calibrationData.actualRisk - 实际风险等级
   * @param {string} calibrationData.feedback - 反馈信息
   * @returns {Promise<Object>} 校准结果
   */
  async calibrateRiskScore(calibrationData) {
    try {
      const response = await api.post('/detection/calibration/risk-score', {
        address: calibrationData.address,
        actual_risk_level: calibrationData.actualRisk,
        feedback_category: calibrationData.feedback,
        correction_reason: calibrationData.reason || '',
        user_expertise: calibrationData.userExpertise || 'standard'
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取检测统计信息
   * @param {Object} [options] - 统计选项
   * @returns {Promise<Object>} 检测统计
   */
  async getDetectionStatistics(options = {}) {
    try {
      const response = await api.get('/detection/statistics', {
        time_range: options.timeRange || '7d',
        group_by: options.groupBy || 'day',
        include_ai_metrics: options.includeAI !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_detections: 0,
        risk_distribution: {},
        accuracy_metrics: {},
        performance_metrics: {}
      }
    }
  }
}

export default detectionApi 