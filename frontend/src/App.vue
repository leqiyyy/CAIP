<template>
  <div id="app">
    <!-- 导航栏 -->
    <NavBar v-if="showNavBar" />
    
    <!-- 主要内容区域 -->
    <div class="main-container" :class="{ 'with-navbar': showNavBar }">
      <!-- Vue路由视图 -->
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
    
    <!-- 全局加载指示器 -->
    <div v-if="loading" class="global-loading">
      <el-loading 
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
      />
    </div>
    
    <!-- 全局通知容器 -->
    <NotificationContainer />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    NotificationContainer
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    // 计算属性
    const loading = computed(() => store.state.app.loading)
    const showNavBar = computed(() => {
      // 在某些页面隐藏导航栏
      const hideNavRoutes = ['/auth', '/login']
      return !hideNavRoutes.includes(route.path)
    })
    
    // 初始化应用
    const initApp = async () => {
      try {
        store.commit('app/SET_LOADING', true)
        
        // 初始化用户状态
        await store.dispatch('auth/initAuth')
        
        // 初始化Web3连接
        await store.dispatch('blockchain/initWeb3')
        
        // 加载系统配置
        await store.dispatch('app/loadConfig')
        
        console.log('✅ EtherSentinel应用初始化完成')
      } catch (error) {
        console.error('❌ 应用初始化失败:', error)
      } finally {
        store.commit('app/SET_LOADING', false)
      }
    }
    
    // 组件挂载时执行
    onMounted(() => {
      initApp()
    })
    
    return {
      loading,
      showNavBar
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-container {
  min-height: 100vh;
  transition: all 0.3s ease;
  
  &.with-navbar {
    padding-top: 60px; // 导航栏高度
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 全局加载样式
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  
  &:hover {
    background: #a8a8a8;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-container {
    &.with-navbar {
      padding-top: 50px;
    }
  }
}
</style> 