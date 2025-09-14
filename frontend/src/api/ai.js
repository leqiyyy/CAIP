/**
 * TrxGNNBert AI模型相关API接口
 * 基于图神经网络(GNN) + Transformer融合架构
 * 专注于区块链安全威胁检测和分析
 */

import api, { modelClient, handleApiResponse, handleApiError } from './index'

export const aiApi = {
  /**
   * 获取AI模型状态
   * @returns {Promise<Object>} 模型状态信息
   */
  async getModelStatus() {
    try {
      const response = await modelClient.get('/model/status')
      return handleApiResponse(response)
    } catch (error) {
      // 如果AI服务不可用，返回降级状态
      return {
        status: 'degraded',
        model_loaded: false,
        fallback_mode: true,
        message: 'AI模型服务不可用，使用基础检测模式'
      }
    }
  },

  /**
   * 初始化TrxGNNBert模型
   * @param {Object} config - 模型配置
   * @returns {Promise<Object>} 初始化结果
   */
  async initializeModel(config = {}) {
    try {
      const response = await modelClient.post('/model/initialize', {
        model_name: 'TrxGNNBert',
        model_version: config.version || 'latest',
        device: config.device || 'auto', // auto, cpu, cuda
        batch_size: config.batchSize || 32,
        max_seq_length: config.maxSeqLength || 512,
        use_graph_features: config.useGraphFeatures !== false,
        use_transformer_features: config.useTransformerFeatures !== false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 地址风险预测 - GNN+Transformer融合分析
   * @param {Object} addressData - 地址数据
   * @param {string} addressData.address - 以太坊地址
   * @param {boolean} [addressData.includeGraph=true] - 是否包含图特征
   * @param {boolean} [addressData.includeHistory=true] - 是否包含历史数据
   * @returns {Promise<Object>} 风险预测结果
   */
  async predictAddressRisk(addressData) {
    try {
      const response = await modelClient.post('/model/predict/address', {
        address: addressData.address,
        analysis_options: {
          include_graph_features: addressData.includeGraph !== false,
          include_transaction_history: addressData.includeHistory !== false,
          include_semantic_features: addressData.includeSemantics !== false,
          graph_depth: addressData.graphDepth || 3,
          time_window_days: addressData.timeWindowDays || 30
        },
        model_options: {
          confidence_threshold: addressData.confidenceThreshold || 0.7,
          enable_explanation: addressData.enableExplanation !== false,
          return_intermediate_results: addressData.returnIntermediate || false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      // 降级到基础API
      console.warn('AI模型预测失败，使用基础检测:', error.message)
      return this.fallbackAddressCheck(addressData.address)
    }
  },

  /**
   * 交易行为序列分析
   * @param {Object} transactionData - 交易数据
   * @param {string} transactionData.txHash - 交易哈希
   * @param {Array} [transactionData.txSequence] - 交易序列
   * @returns {Promise<Object>} 交易分析结果
   */
  async analyzeTransactionSequence(transactionData) {
    try {
      const response = await modelClient.post('/model/analyze/transaction', {
        tx_hash: transactionData.txHash,
        tx_sequence: transactionData.txSequence || [],
        analysis_options: {
          sequence_length: transactionData.sequenceLength || 50,
          use_attention_weights: transactionData.useAttention !== false,
          detect_patterns: transactionData.detectPatterns !== false,
          temporal_analysis: transactionData.temporalAnalysis !== false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      console.warn('AI交易分析失败，使用基础检测:', error.message)
      return this.fallbackTransactionCheck(transactionData.txHash)
    }
  },

  /**
   * 图神经网络关系分析
   * @param {Object} graphData - 图数据
   * @param {string} graphData.centerAddress - 中心地址
   * @param {number} [graphData.depth=3] - 分析深度
   * @returns {Promise<Object>} 图关系分析结果
   */
  async analyzeGraphRelations(graphData) {
    try {
      const response = await modelClient.post('/model/analyze/graph', {
        center_address: graphData.centerAddress,
        graph_options: {
          max_depth: graphData.depth || 3,
          min_transaction_value: graphData.minTxValue || 0.001,
          include_contract_calls: graphData.includeContracts !== false,
          temporal_grouping: graphData.temporalGrouping || 'day',
          node_features: ['balance', 'tx_count', 'age', 'diversity'],
          edge_features: ['value', 'frequency', 'recency']
        },
        gnn_options: {
          model_type: 'GraphSAGE', // GraphSAGE, GAT, GCN
          num_layers: graphData.numLayers || 3,
          hidden_dim: graphData.hiddenDim || 256,
          aggregation: graphData.aggregation || 'mean'
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Transformer语义特征提取
   * @param {Object} semanticData - 语义数据
   * @param {Array} semanticData.transactions - 交易列表
   * @param {string} [semanticData.analysisType='behavior'] - 分析类型
   * @returns {Promise<Object>} 语义分析结果
   */
  async extractSemanticFeatures(semanticData) {
    try {
      const response = await modelClient.post('/model/extract/semantic', {
        transactions: semanticData.transactions,
        semantic_options: {
          analysis_type: semanticData.analysisType || 'behavior',
          embedding_dimension: semanticData.embeddingDim || 768,
          attention_heads: semanticData.attentionHeads || 12,
          sequence_length: semanticData.sequenceLength || 256
        },
        extraction_options: {
          return_attention_weights: semanticData.returnAttention || false,
          return_embeddings: semanticData.returnEmbeddings || false,
          cluster_behaviors: semanticData.clusterBehaviors || false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 批量地址风险评估
   * @param {Object} batchData - 批量数据
   * @param {Array} batchData.addresses - 地址列表
   * @param {Object} [batchData.options] - 评估选项
   * @returns {Promise<Object>} 批量评估结果
   */
  async batchAddressAssessment(batchData) {
    try {
      const response = await modelClient.post('/model/batch/address', {
        addresses: batchData.addresses,
        batch_options: {
          batch_size: batchData.batchSize || 50,
          parallel_workers: batchData.parallelWorkers || 4,
          timeout_per_address: batchData.timeoutPerAddress || 30
        },
        analysis_options: batchData.options || {
          include_graph_features: true,
          include_transaction_history: true,
          confidence_threshold: 0.7
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 模型性能监控
   * @returns {Promise<Object>} 性能指标
   */
  async getModelMetrics() {
    try {
      const response = await modelClient.get('/model/metrics')
      return handleApiResponse(response)
    } catch (error) {
      return {
        cpu_usage: 0,
        memory_usage: 0,
        gpu_usage: 0,
        inference_latency: 0,
        requests_per_second: 0,
        model_accuracy: 0,
        error_rate: 100,
        status: 'unavailable'
      }
    }
  },

  /**
   * 获取模型配置信息
   * @returns {Promise<Object>} 模型配置
   */
  async getModelConfig() {
    try {
      const response = await modelClient.get('/model/config')
      return handleApiResponse(response)
    } catch (error) {
      return {
        model_name: 'TrxGNNBert',
        version: 'unknown',
        architecture: 'GNN + Transformer',
        parameters: 'unknown',
        training_data: 'unknown',
        capabilities: ['address_risk', 'transaction_analysis', 'graph_analysis']
      }
    }
  },

  /**
   * 实时威胁检测
   * @param {Object} streamData - 流数据
   * @returns {Promise<Object>} 实时检测结果
   */
  async realtimeThreatDetection(streamData) {
    try {
      const response = await modelClient.post('/model/realtime/detect', {
        stream_data: streamData.data,
        detection_options: {
          sensitivity: streamData.sensitivity || 'medium',
          alert_threshold: streamData.alertThreshold || 0.8,
          include_explanations: streamData.includeExplanations !== false
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 模型训练状态查询
   * @returns {Promise<Object>} 训练状态
   */
  async getTrainingStatus() {
    try {
      const response = await modelClient.get('/model/training/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        training_active: false,
        last_training: null,
        model_version: 'stable',
        accuracy: null,
        loss: null
      }
    }
  },

  /**
   * 特征重要性分析
   * @param {Object} analysisData - 分析数据
   * @returns {Promise<Object>} 特征重要性结果
   */
  async getFeatureImportance(analysisData) {
    try {
      const response = await modelClient.post('/model/explain/features', {
        analysis_target: analysisData.target,
        explanation_options: {
          method: analysisData.method || 'SHAP',
          feature_groups: ['graph', 'transaction', 'temporal', 'semantic'],
          top_k_features: analysisData.topK || 20
        }
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 基础地址检查（兜底方案）
   * @param {string} address - 地址
   * @returns {Promise<Object>} 基础检查结果
   */
  async fallbackAddressCheck(address) {
    try {
      const response = await api.post('/check_address_risk', { address })
      return {
        ...handleApiResponse(response),
        fallback_mode: true,
        ai_available: false
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 基础交易检查（兜底方案）
   * @param {string} txHash - 交易哈希
   * @returns {Promise<Object>} 基础检查结果
   */
  async fallbackTransactionCheck(txHash) {
    try {
      const response = await api.post('/check_transaction_risk', { txHash })
      return {
        ...handleApiResponse(response),
        fallback_mode: true,
        ai_available: false
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取AI服务健康状态
   * @returns {Promise<Object>} 健康状态
   */
  async getHealthStatus() {
    try {
      const response = await modelClient.get('/health')
      return handleApiResponse(response)
    } catch (error) {
      return {
        status: 'unhealthy',
        ai_service: false,
        model_loaded: false,
        dependencies: false,
        fallback_available: true
      }
    }
  }
}

export default aiApi 