/**
 * 数据分析和报告相关API接口
 * 包含威胁趋势分析、风险统计报告、数据可视化、业务指标等功能
 */

import api, { handleApiResponse, handleApiError } from './index'

export const analyticsApi = {
  /**
   * 获取威胁趋势分析
   * @param {Object} [options] - 分析选项
   * @returns {Promise<Object>} 威胁趋势分析结果
   */
  async getThreatTrends(options = {}) {
    try {
      const response = await api.get('/analytics/threats/trends', {
        time_range: options.timeRange || '30d',
        granularity: options.granularity || 'day'
      })
      return handleApiResponse(response)
    } catch (error) {
      return {
        time_series: [],
        threat_distribution: {},
        trend_analysis: {}
      }
    }
  },

  /**
   * 获取风险统计报告
   * @param {Object} [options] - 报告选项
   * @returns {Promise<Object>} 风险统计报告
   */
  async getRiskStatistics(options = {}) {
    try {
      const response = await api.get('/analytics/risk/statistics', {
        report_type: options.reportType || 'comprehensive',
        time_range: options.timeRange || '7d',
        risk_levels: options.riskLevels || ['low', 'medium', 'high', 'critical'],
        include_comparisons: options.includeComparisons !== false,
        include_demographics: options.includeDemographics || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_addresses_analyzed: 0,
        risk_distribution: {},
        detection_accuracy: 0,
        false_positive_rate: 0,
        time_series: [],
        comparisons: {}
      }
    }
  },

  /**
   * 获取地址行为分析
   * @param {Object} analysisData - 分析数据
   * @param {Array} analysisData.addresses - 地址列表
   * @param {Object} [analysisData.options] - 分析选项
   * @returns {Promise<Object>} 行为分析结果
   */
  async getAddressBehaviorAnalysis(analysisData) {
    try {
      const response = await api.post('/analytics/addresses/behavior', {
        target_addresses: analysisData.addresses,
        analysis_options: {
          time_window_days: analysisData.options?.timeWindow || 30,
          include_transaction_patterns: analysisData.options?.includeTransactions !== false,
          include_network_analysis: analysisData.options?.includeNetwork !== false,
          include_temporal_analysis: analysisData.options?.includeTemporal !== false,
          cluster_similar_behaviors: analysisData.options?.clusterBehaviors || false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取交易模式分析
   * @param {Object} [options] - 分析选项
   * @returns {Promise<Object>} 交易模式分析结果
   */
  async getTransactionPatterns(options = {}) {
    try {
      const response = await api.get('/analytics/transactions/patterns', {
        time_range: options.timeRange || '30d',
        pattern_types: options.patternTypes || ['volume', 'frequency', 'value', 'timing'],
        min_transaction_count: options.minTxCount || 100,
        include_anomalies: options.includeAnomalies !== false,
        group_by_risk_level: options.groupByRisk || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        pattern_summary: {},
        time_series: [],
        anomaly_detection: [],
        pattern_correlations: {}
      }
    }
  },

  /**
   * 获取网络拓扑分析
   * @param {Object} networkData - 网络数据
   * @param {string} networkData.centerAddress - 中心地址
   * @param {Object} [networkData.options] - 分析选项
   * @returns {Promise<Object>} 网络拓扑分析结果
   */
  async getNetworkTopologyAnalysis(networkData) {
    try {
      const response = await api.post('/analytics/network/topology', {
        center_address: networkData.centerAddress,
        topology_options: {
          max_depth: networkData.options?.maxDepth || 3,
          min_edge_weight: networkData.options?.minEdgeWeight || 0.001,
          include_centrality_metrics: networkData.options?.includeCentrality !== false,
          include_community_detection: networkData.options?.includeCommunity !== false,
          layout_algorithm: networkData.options?.layoutAlgorithm || 'force_directed'
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 生成综合安全报告
   * @param {Object} reportConfig - 报告配置
   * @param {string} reportConfig.reportType - 报告类型
   * @param {Object} [reportConfig.options] - 报告选项
   * @returns {Promise<Object>} 安全报告
   */
  async generateSecurityReport(reportConfig) {
    try {
      const response = await api.post('/analytics/reports/security', {
        report_type: reportConfig.reportType, // daily, weekly, monthly, custom
        report_options: {
          time_range: reportConfig.options?.timeRange || '7d',
          include_executive_summary: reportConfig.options?.includeExecutive !== false,
          include_detailed_analysis: reportConfig.options?.includeDetailed || false,
          include_recommendations: reportConfig.options?.includeRecommendations !== false,
          include_charts: reportConfig.options?.includeCharts !== false,
          export_format: reportConfig.options?.exportFormat || 'json' // json, pdf, excel
        },
        custom_filters: reportConfig.options?.customFilters || {}
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取实时仪表板数据
   * @param {Object} [options] - 仪表板选项
   * @returns {Promise<Object>} 仪表板数据
   */
  async getDashboardData(options = {}) {
    try {
      const response = await api.get('/analytics/dashboard/realtime', {
        dashboard_type: options.dashboardType || 'overview',
        refresh_interval: options.refreshInterval || 30,
        include_alerts: options.includeAlerts !== false,
        include_metrics: options.includeMetrics !== false,
        widget_config: options.widgetConfig || {}
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        summary_metrics: {
          total_addresses_monitored: 0,
          high_risk_addresses: 0,
          alerts_today: 0,
          detection_accuracy: 0
        },
        charts_data: {},
        alerts: [],
        system_status: 'unknown',
        last_updated: new Date().toISOString()
      }
    }
  },

  /**
   * 获取用户活动热力图
   * @param {Object} [options] - 热力图选项
   * @returns {Promise<Object>} 活动热力图数据
   */
  async getActivityHeatmap(options = {}) {
    try {
      const response = await api.get('/analytics/activity/heatmap', {
        time_range: options.timeRange || '7d',
        granularity: options.granularity || 'hour',
        activity_types: options.activityTypes || ['detections', 'api_calls', 'user_actions'],
        include_geographic: options.includeGeographic || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        heatmap_data: [],
        time_labels: [],
        activity_labels: [],
        peak_times: [],
        geographic_data: []
      }
    }
  },

  /**
   * 获取预测性分析结果
   * @param {Object} predictionData - 预测数据
   * @param {string} predictionData.targetMetric - 目标指标
   * @param {Object} [predictionData.options] - 预测选项
   * @returns {Promise<Object>} 预测分析结果
   */
  async getPredictiveAnalysis(predictionData) {
    try {
      const response = await api.post('/analytics/predictions', {
        target_metric: predictionData.targetMetric,
        prediction_options: {
          forecast_period: predictionData.options?.forecastPeriod || '7d',
          model_type: predictionData.options?.modelType || 'auto',
          confidence_intervals: predictionData.options?.confidenceIntervals || [0.8, 0.95],
          include_seasonality: predictionData.options?.includeSeasonality !== false,
          include_trend: predictionData.options?.includeTrend !== false
        },
        historical_data_range: predictionData.options?.historicalRange || '90d'
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取风险评分分布
   * @param {Object} [options] - 分布选项
   * @returns {Promise<Object>} 风险评分分布
   */
  async getRiskScoreDistribution(options = {}) {
    try {
      const response = await api.get('/analytics/risk/distribution', {
        time_range: options.timeRange || '30d',
        score_bins: options.scoreBins || 20,
        include_historical: options.includeHistorical || false,
        segment_by: options.segmentBy, // address_type, transaction_volume, etc.
        include_percentiles: options.includePercentiles !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        distribution: [],
        statistics: {
          mean: 0,
          median: 0,
          std_dev: 0,
          percentiles: {}
        },
        segments: {},
        trend: 'stable'
      }
    }
  },

  /**
   * 获取检测性能指标
   * @param {Object} [options] - 性能选项
   * @returns {Promise<Object>} 检测性能指标
   */
  async getDetectionPerformance(options = {}) {
    try {
      const response = await api.get('/analytics/detection/performance', {
        time_range: options.timeRange || '30d',
        granularity: options.granularity || 'day',
        metrics: options.metrics || ['accuracy', 'precision', 'recall', 'f1_score'],
        split_by_model: options.splitByModel !== false,
        include_confusion_matrix: options.includeConfusionMatrix || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        performance_metrics: {},
        time_series: [],
        model_comparison: {},
        confusion_matrix: null,
        recommendations: []
      }
    }
  },

  /**
   * 获取威胁情报摘要
   * @param {Object} [options] - 摘要选项
   * @returns {Promise<Object>} 威胁情报摘要
   */
  async getThreatIntelligenceSummary(options = {}) {
    try {
      const response = await api.get('/analytics/threats/intelligence-summary', {
        time_range: options.timeRange || '24h',
        threat_sources: options.threatSources || ['internal', 'external', 'community'],
        confidence_threshold: options.confidenceThreshold || 0.6,
        include_iocs: options.includeIOCs !== false,
        include_attribution: options.includeAttribution || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_threats: 0,
        threat_categories: {},
        new_threats: [],
        trending_threats: [],
        iocs: [],
        attribution: {}
      }
    }
  },

  /**
   * 执行自定义分析查询
   * @param {Object} queryData - 查询数据
   * @param {string} queryData.queryType - 查询类型
   * @param {Object} queryData.parameters - 查询参数
   * @returns {Promise<Object>} 自定义分析结果
   */
  async executeCustomAnalysis(queryData) {
    try {
      const response = await api.post('/analytics/custom/query', {
        query_type: queryData.queryType,
        parameters: queryData.parameters,
        query_options: {
          cache_result: queryData.options?.cacheResult !== false,
          timeout: queryData.options?.timeout || 300,
          result_format: queryData.options?.resultFormat || 'json'
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取比较分析结果
   * @param {Object} comparisonData - 比较数据
   * @param {Array} comparisonData.targets - 比较目标
   * @param {Object} [comparisonData.options] - 比较选项
   * @returns {Promise<Object>} 比较分析结果
   */
  async getComparativeAnalysis(comparisonData) {
    try {
      const response = await api.post('/analytics/comparative', {
        comparison_targets: comparisonData.targets,
        comparison_options: {
          metrics: comparisonData.options?.metrics || ['risk_score', 'activity_level', 'network_centrality'],
          time_range: comparisonData.options?.timeRange || '30d',
          include_statistical_tests: comparisonData.options?.includeStatisticalTests || false,
          visualization_type: comparisonData.options?.visualizationType || 'radar_chart'
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 导出分析数据
   * @param {Object} exportData - 导出数据
   * @param {string} exportData.analysisType - 分析类型
   * @param {Object} exportData.parameters - 导出参数
   * @returns {Promise<Object>} 导出结果
   */
  async exportAnalysisData(exportData) {
    try {
      const response = await api.post('/analytics/export', {
        analysis_type: exportData.analysisType,
        export_parameters: exportData.parameters,
        export_options: {
          format: exportData.format || 'csv', // csv, excel, json, pdf
          include_metadata: exportData.includeMetadata !== false,
          compression: exportData.compression || false,
          email_delivery: exportData.emailDelivery || false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default analyticsApi 