// 区块链状态管理模块
const state = {
  // Web3连接状态
  web3Connected: false,
  
  // 当前网络
  network: null,
  
  // 钱包地址
  account: null,
  
  // 余额
  balance: '0',
  
  // 支持的网络
  supportedNetworks: {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    42: 'Kovan Testnet'
  }
}

const mutations = {
  SET_WEB3_CONNECTED(state, connected) {
    state.web3Connected = connected
  },
  
  SET_NETWORK(state, network) {
    state.network = network
  },
  
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  
  SET_BALANCE(state, balance) {
    state.balance = balance
  }
}

const actions = {
  // 初始化Web3
  async initWeb3({ commit }) {
    try {
      if (typeof window.ethereum !== 'undefined') {
        commit('SET_WEB3_CONNECTED', true)
        console.log('✅ Web3环境已检测到')
      } else {
        console.log('⚠️ 未检测到Web3环境')
      }
    } catch (error) {
      console.error('Web3初始化失败:', error)
    }
  },
  
  // 连接钱包
  async connectWallet({ commit, dispatch }) {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        if (accounts.length > 0) {
          commit('SET_ACCOUNT', accounts[0])
          dispatch('getBalance')
          dispatch('app/showSuccess', '钱包连接成功', { root: true })
        }
      }
    } catch (error) {
      dispatch('app/showError', '钱包连接失败', { root: true })
    }
  },
  
  // 获取余额
  async getBalance({ commit, state }) {
    try {
      if (state.account && window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [state.account, 'latest']
        })
        commit('SET_BALANCE', balance)
      }
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }
}

const getters = {
  isWeb3Connected: state => state.web3Connected,
  currentNetwork: state => state.network,
  currentAccount: state => state.account,
  currentBalance: state => state.balance,
  supportedNetworks: state => state.supportedNetworks
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 