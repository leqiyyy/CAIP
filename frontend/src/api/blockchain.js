/**
 * 区块链相关API接口
 * 包含Web3连接管理、交易查询、地址信息获取、合约交互等功能
 */

import api, { handleApiResponse, handleApiError } from './index'

export const blockchainApi = {
  /**
   * 连接到Web3提供者
   * @param {Object} config - 连接配置
   * @param {string} [config.network='mainnet'] - 网络名称
   * @param {string} [config.provider] - 自定义提供者URL
   * @returns {Promise<Object>} 连接结果
   */
  async connectWeb3(config = {}) {
    try {
      const response = await api.post('/blockchain/connect', {
        network: config.network || 'mainnet',
        provider_url: config.provider,
        auto_retry: config.autoRetry !== false,
        timeout: config.timeout || 10000
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取网络状态
   * @returns {Promise<Object>} 网络状态信息
   */
  async getNetworkStatus() {
    try {
      const response = await api.get('/blockchain/network/status')
      return handleApiResponse(response)
    } catch (error) {
      return {
        connected: false,
        network: 'unknown',
        block_number: 0,
        gas_price: 0,
        provider: 'disconnected'
      }
    }
  },

  /**
   * 获取以太坊地址详细信息
   * @param {string} address - 以太坊地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 地址信息
   */
  async getAddressInfo(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}`, {
        include_balance: options.includeBalance !== false,
        include_transactions: options.includeTransactions !== false,
        include_contracts: options.includeContracts !== false,
        include_tokens: options.includeTokens !== false,
        tx_limit: options.txLimit || 50
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址余额
   * @param {string} address - 以太坊地址
   * @param {string} [blockNumber='latest'] - 区块号
   * @returns {Promise<Object>} 余额信息
   */
  async getAddressBalance(address, blockNumber = 'latest') {
    try {
      const response = await api.get(`/blockchain/address/${address}/balance`, {
        block_number: blockNumber
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址交易历史
   * @param {string} address - 以太坊地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 交易历史
   */
  async getAddressTransactions(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}/transactions`, {
        page: options.page || 1,
        limit: options.limit || 50,
        sort: options.sort || 'desc',
        from_block: options.fromBlock,
        to_block: options.toBlock,
        include_internal: options.includeInternal || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取交易详情
   * @param {string} txHash - 交易哈希
   * @param {boolean} [includeReceipt=true] - 是否包含交易回执
   * @returns {Promise<Object>} 交易详情
   */
  async getTransactionDetails(txHash, includeReceipt = true) {
    try {
      const response = await api.get(`/blockchain/transaction/${txHash}`, {
        include_receipt: includeReceipt,
        include_logs: includeReceipt,
        include_trace: false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取区块信息
   * @param {string|number} blockIdentifier - 区块号或哈希
   * @param {boolean} [includeTransactions=false] - 是否包含交易详情
   * @returns {Promise<Object>} 区块信息
   */
  async getBlockInfo(blockIdentifier, includeTransactions = false) {
    try {
      const response = await api.get(`/blockchain/block/${blockIdentifier}`, {
        include_transactions: includeTransactions
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取最新区块
   * @param {number} [count=1] - 获取最新的区块数量
   * @returns {Promise<Object>} 最新区块信息
   */
  async getLatestBlocks(count = 1) {
    try {
      const response = await api.get('/blockchain/blocks/latest', {
        count: count
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取Gas价格信息
   * @returns {Promise<Object>} Gas价格
   */
  async getGasPrice() {
    try {
      const response = await api.get('/blockchain/gas/price')
      return handleApiResponse(response)
    } catch (error) {
      return {
        standard: 20,
        fast: 25,
        instant: 30,
        safe: 15,
        base_fee: 10
      }
    }
  },

  /**
   * 估算Gas使用量
   * @param {Object} transaction - 交易对象
   * @returns {Promise<Object>} Gas估算
   */
  async estimateGas(transaction) {
    try {
      const response = await api.post('/blockchain/gas/estimate', {
        to: transaction.to,
        from: transaction.from,
        value: transaction.value,
        data: transaction.data
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取合约信息
   * @param {string} contractAddress - 合约地址
   * @returns {Promise<Object>} 合约信息
   */
  async getContractInfo(contractAddress) {
    try {
      const response = await api.get(`/blockchain/contract/${contractAddress}`, {
        include_abi: true,
        include_source: false,
        include_bytecode: false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 调用合约只读方法
   * @param {Object} callData - 调用数据
   * @param {string} callData.contract - 合约地址
   * @param {string} callData.method - 方法名
   * @param {Array} [callData.params] - 参数
   * @returns {Promise<Object>} 调用结果
   */
  async callContract(callData) {
    try {
      const response = await api.post('/blockchain/contract/call', {
        contract_address: callData.contract,
        method_name: callData.method,
        parameters: callData.params || [],
        block_number: callData.blockNumber || 'latest'
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取ERC20代币信息
   * @param {string} tokenAddress - 代币合约地址
   * @returns {Promise<Object>} 代币信息
   */
  async getTokenInfo(tokenAddress) {
    try {
      const response = await api.get(`/blockchain/token/${tokenAddress}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址的代币余额
   * @param {string} address - 地址
   * @param {string} tokenAddress - 代币合约地址
   * @returns {Promise<Object>} 代币余额
   */
  async getTokenBalance(address, tokenAddress) {
    try {
      const response = await api.get(`/blockchain/token/${tokenAddress}/balance/${address}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址的所有代币余额
   * @param {string} address - 地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 所有代币余额
   */
  async getAllTokenBalances(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}/tokens`, {
        include_zero_balances: options.includeZero || false,
        min_balance: options.minBalance || 0.001,
        top_tokens_only: options.topTokensOnly || false
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取代币转账记录
   * @param {string} address - 地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} 代币转账记录
   */
  async getTokenTransfers(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}/token-transfers`, {
        page: options.page || 1,
        limit: options.limit || 50,
        token_address: options.tokenAddress,
        from_block: options.fromBlock,
        to_block: options.toBlock
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取DeFi协议信息
   * @param {string} protocolAddress - 协议地址
   * @returns {Promise<Object>} DeFi协议信息
   */
  async getDeFiProtocolInfo(protocolAddress) {
    try {
      const response = await api.get(`/blockchain/defi/protocol/${protocolAddress}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址在DeFi协议中的持仓
   * @param {string} address - 地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} DeFi持仓信息
   */
  async getDeFiPositions(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}/defi-positions`, {
        protocols: options.protocols || [],
        include_historical: options.includeHistorical || false,
        min_value_usd: options.minValueUsd || 10
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取NFT持有信息
   * @param {string} address - 地址
   * @param {Object} [options] - 查询选项
   * @returns {Promise<Object>} NFT持有信息
   */
  async getNFTHoldings(address, options = {}) {
    try {
      const response = await api.get(`/blockchain/address/${address}/nfts`, {
        include_metadata: options.includeMetadata !== false,
        include_prices: options.includePrices || false,
        collections: options.collections || []
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 搜索地址或交易
   * @param {string} query - 搜索查询
   * @param {Object} [options] - 搜索选项
   * @returns {Promise<Object>} 搜索结果
   */
  async search(query, options = {}) {
    try {
      const response = await api.get('/blockchain/search', {
        q: query,
        type: options.type || 'auto', // auto, address, transaction, block, contract
        exact_match: options.exactMatch || false,
        limit: options.limit || 20
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 获取地址标签信息
   * @param {string} address - 地址
   * @returns {Promise<Object>} 地址标签
   */
  async getAddressLabels(address) {
    try {
      const response = await api.get(`/blockchain/address/${address}/labels`)
      return handleApiResponse(response)
    } catch (error) {
      return {
        labels: [],
        categories: [],
        risk_level: 'unknown',
        verified: false
      }
    }
  },

  /**
   * 获取地址风险评分
   * @param {string} address - 地址
   * @returns {Promise<Object>} 风险评分
   */
  async getAddressRiskScore(address) {
    try {
      const response = await api.get(`/blockchain/address/${address}/risk-score`)
      return handleApiResponse(response)
    } catch (error) {
      return {
        score: 0,
        level: 'unknown',
        factors: [],
        last_updated: null
      }
    }
  },

  /**
   * 获取网络统计信息
   * @returns {Promise<Object>} 网络统计
   */
  async getNetworkStats() {
    try {
      const response = await api.get('/blockchain/network/stats')
      return handleApiResponse(response)
    } catch (error) {
      return {
        total_accounts: 0,
        total_transactions: 0,
        total_contracts: 0,
        active_addresses_24h: 0,
        network_hash_rate: 0
      }
    }
  },

  /**
   * 订阅实时事件
   * @param {Object} subscription - 订阅配置
   * @returns {Promise<Object>} 订阅结果
   */
  async subscribeToEvents(subscription) {
    try {
      const response = await api.post('/blockchain/subscribe', {
        event_type: subscription.eventType, // new_blocks, new_transactions, address_activity
        filters: subscription.filters || {},
        webhook_url: subscription.webhookUrl
      })
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * 取消订阅
   * @param {string} subscriptionId - 订阅ID
   * @returns {Promise<Object>} 取消结果
   */
  async unsubscribe(subscriptionId) {
    try {
      const response = await api.delete(`/blockchain/subscribe/${subscriptionId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default blockchainApi 