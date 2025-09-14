module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // Element Plus 按需导入
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
      },
    ],
    // 可选链操作符支持
    '@babel/plugin-proposal-optional-chaining',
    // 空值合并操作符支持  
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // 类属性支持
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
} 