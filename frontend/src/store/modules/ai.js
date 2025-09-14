// AI模型状态管理模块
const state = {
  // 模型状态
  modelLoaded: false,
  modelLoading: false,
  
  // 检测历史
  detectionHistory: [],
  
  // 实时数据
  realtimeData: [],
  
  // 系统统计
  aiStats: {
    totalDetections: 0,
    accuracy: 0,
    threatsCaught: 0,
    lastUpdate: null
  }
}

const mutations = {
  SET_MODEL_LOADED(state, loaded) {
    state.modelLoaded = loaded
  },
  
  SET_MODEL_LOADING(state, loading) {
    state.modelLoading = loading
  },
  
  ADD_DETECTION(state, detection) {
    state.detectionHistory.unshift(detection)
    // 保持最近100条记录
    if (state.detectionHistory.length > 100) {
      state.detectionHistory = state.detectionHistory.slice(0, 100)
    }
  },
  
  SET_REALTIME_DATA(state, data) {
    state.realtimeData = data
  },
  
  SET_AI_STATS(state, stats) {
    state.aiStats = { ...state.aiStats, ...stats }
  }
}

const actions = {
  // 地址风险检测
  async checkAddressRisk({ commit, dispatch }, address) {
    try {
      commit('SET_MODEL_LOADING', true)
      
      const response = await fetch('/api/check_address_risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // 添加到检测历史
        const detection = {
          id: Date.now(),
          type: 'address',
          target: address,
          result: data,
          timestamp: new Date().toISOString()
        }
        commit('ADD_DETECTION', detection)
        
        return { success: true, data }
      } else {
        throw new Error(data.error || '检测失败')
      }
    } catch (error) {
      dispatch('app/showError', error.message, { root: true })
      return { success: false, error: error.message }
    } finally {
      commit('SET_MODEL_LOADING', false)
    }
  },
  
  // 交易风险检测
  async checkTransactionRisk({ commit, dispatch }, txHash) {
    try {
      commit('SET_MODEL_LOADING', true)
      
      const response = await fetch('/api/check_transaction_risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash })
      })
      
      const data = await response.json()
      
      if (data.status === 'success') {
        const detection = {
          id: Date.now(),
          type: 'transaction',
          target: txHash,
          result: data,
          timestamp: new Date().toISOString()
        }
        commit('ADD_DETECTION', detection)
        
        return { success: true, data }
      } else {
        throw new Error(data.message || '检测失败')
      }
    } catch (error) {
      dispatch('app/showError', error.message, { root: true })
      return { success: false, error: error.message }
    } finally {
      commit('SET_MODEL_LOADING', false)
    }
  },
  
  // 获取实时数据
  async fetchRealtimeData({ commit }) {
    try {
      const response = await fetch('/api/get_realtime_data')
      const data = await response.json()
      
      if (data.status === 'success') {
        commit('SET_REALTIME_DATA', data.data)
      }
    } catch (error) {
      console.error('获取实时数据失败:', error)
    }
  },
  
  // 获取AI统计
  async fetchAIStats({ commit }) {
    try {
      const response = await fetch('/api/get_system_stats')
      const data = await response.json()
      
      if (data.status === 'success') {
        commit('SET_AI_STATS', {
          totalDetections: data.stats.totalAddressesChecked,
          accuracy: data.stats.detectionAccuracy,
          threatsCaught: data.stats.threatsDetected,
          lastUpdate: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('获取AI统计失败:', error)
    }
  }
}

const getters = {
  isModelLoaded: state => state.modelLoaded,
  isModelLoading: state => state.modelLoading,
  detectionHistory: state => state.detectionHistory,
  realtimeData: state => state.realtimeData,
  aiStats: state => state.aiStats,
  
  // 最近的检测结果
  recentDetections: state => state.detectionHistory.slice(0, 10),
  
  // 威胁检测数量
  threatCount: state => state.detectionHistory.filter(d => 
    d.result.riskLevel === '高风险' || d.result.riskScore > 0.7
  ).length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 