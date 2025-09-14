import { createStore } from 'vuex'
import app from './modules/app'
import auth from './modules/auth'
import blockchain from './modules/blockchain'
import ai from './modules/ai'

// 创建Vuex store
const store = createStore({
  modules: {
    app,
    auth,
    blockchain,
    ai
  },
  
  // 严格模式，在非生产环境下启用
  strict: process.env.NODE_ENV !== 'production',
  
  // 插件
  plugins: [
    // 持久化存储插件
    store => {
      // 监听mutation，自动保存关键状态到localStorage
      store.subscribe((mutation, state) => {
        if (mutation.type.startsWith('auth/')) {
          localStorage.setItem('auth_state', JSON.stringify(state.auth))
        }
        if (mutation.type.startsWith('app/SET_CONFIG')) {
          localStorage.setItem('app_config', JSON.stringify(state.app.config))
        }
      })
    }
  ]
})

// 开发环境下暴露store到全局
if (process.env.NODE_ENV === 'development') {
  window.store = store
}

export default store 