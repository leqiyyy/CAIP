import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// 路由组件懒加载
const Home = () => import('@/views/Home.vue')
const Auth = () => import('@/views/Auth.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const AdvancedTools = () => import('@/views/AdvancedTools.vue')
const RiskReport = () => import('@/views/RiskReport.vue')
const Settings = () => import('@/views/Settings.vue')

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '鉴诈链图 - 主页',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      title: '鉴诈链图 - 登录',
      requiresAuth: false,
      hideNavbar: true
    }
  },
  {
    path: '/login',
    redirect: '/auth'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '鉴诈链图 - 控制台',
      requiresAuth: true,
      keepAlive: true,
      roles: ['admin', 'user']
    }
  },
  {
    path: '/advanced-tools',
    name: 'AdvancedTools',
    component: AdvancedTools,
    meta: {
      title: '鉴诈链图 - 高级工具',
      requiresAuth: true,
      keepAlive: false,
      roles: ['admin', 'user']
    }
  },
  {
    path: '/risk-report',
    name: 'RiskReport',
    component: RiskReport,
    meta: {
      title: '鉴诈链图 - 风险报告',
      requiresAuth: true,
      keepAlive: true,
      roles: ['admin', 'user']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: '鉴诈链图 - 设置',
      requiresAuth: true,
      keepAlive: false,
      roles: ['admin']
    }
  },
  // 兼容现有HTML路径
  {
    path: '/index.html',
    redirect: '/home'
  },
  {
    path: '/auth.html',
    redirect: '/auth'
  },
  {
    path: '/dashboard.html',
    redirect: '/dashboard'
  },
  {
    path: '/advanced-tools.html',
    redirect: '/advanced-tools'
  },
  {
    path: '/risk-report.html',
    redirect: '/risk-report'
  },
  {
    path: '/settings.html',
    redirect: '/settings'
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 显示加载状态
  store.commit('app/SET_LOADING', true)

  try {
    // 检查认证状态
    if (to.meta.requiresAuth) {
      const isAuthenticated = store.getters['auth/isAuthenticated']
      
      if (!isAuthenticated) {
        // 未认证，重定向到登录页
        next({
          path: '/auth',
          query: { redirect: to.fullPath }
        })
        return
      }

      // 检查角色权限
      if (to.meta.roles) {
        const userRole = store.getters['auth/userRole']
        if (!to.meta.roles.includes(userRole)) {
          // 权限不足
          next({
            path: '/dashboard',
            query: { error: 'insufficient_permissions' }
          })
          return
        }
      }
    }

    // 如果已登录用户访问登录页，重定向到控制台
    if (to.path === '/auth' && store.getters['auth/isAuthenticated']) {
      next('/dashboard')
      return
    }

    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    next('/auth')
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 隐藏加载状态
  store.commit('app/SET_LOADING', false)
  
  // 记录路由变化
  console.log(`路由切换: ${from.path} -> ${to.path}`)
  
  // 谷歌分析或其他埋点
  if (process.env.NODE_ENV === 'production' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.fullPath
    })
  }
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  store.commit('app/SET_LOADING', false)
})

export default router 