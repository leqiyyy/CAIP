const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  
  // 输出目录
  outputDir: 'dist',
  
  // 静态资源目录
  assetsDir: 'static',
  
  // 生产环境关闭source map
  productionSourceMap: false,
  
  // PWA配置
  pwa: {
    name: '鉴诈链图',
    themeColor: '#1e40af',
    msTileColor: '#1e40af',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/sw.js',
    }
  },
  
  // 链式操作webpack配置
  chainWebpack: config => {
    // 优化构建性能
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementPlus: {
          name: 'chunk-element-plus',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 3,
          priority: 5,
          chunks: 'initial'
        }
      }
    })
  },
  
  // CSS相关配置
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss";`
      }
    }
  },
  
  // 配置别名
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src'),
        'components': require('path').resolve(__dirname, 'src/components'),
        'views': require('path').resolve(__dirname, 'src/views'),
        'utils': require('path').resolve(__dirname, 'src/utils'),
        'api': require('path').resolve(__dirname, 'src/api'),
        'assets': require('path').resolve(__dirname, 'src/assets')
      }
    }
  },
  
  // 插件配置
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        require('path').resolve(__dirname, 'src/styles/variables.scss')
      ]
    }
  }
}) 