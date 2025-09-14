import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Element Plus UI框架
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// ECharts 图表库
import * as echarts from 'echarts'
import VChart from 'vue-echarts'

// Web3相关
import Web3 from 'web3'
import { ethers } from 'ethers'

// 全局样式
import '@/styles/index.scss'

// 创建Vue应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局配置
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$web3 = Web3
app.config.globalProperties.$ethers = ethers

// 注册组件
app.component('VChart', VChart)

// 使用插件
app.use(store)
app.use(router)
app.use(ElementPlus)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Global Error:', err, info)
}

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue Warning:', msg, trace)
}

// 挂载应用
app.mount('#app')

// 开发环境配置
if (process.env.NODE_ENV === 'development') {
  app.config.devtools = true
  window.vue = app
}

// 暴露全局变量供调试使用
window.store = store
window.router = router
window.ethers = ethers
window.Web3 = Web3

console.log('🚀 EtherSentinel Vue应用已启动')
console.log('📊 Element Plus UI已加载')
console.log('🔗 Web3环境已准备就绪')
console.log('📈 图表组件已注册') 