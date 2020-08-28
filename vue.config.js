const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  productionSourceMap: false,  // 生产环境的 source map
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;       // 去除warning警告
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true    // 去除debugger
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log', 'console.warn']
      config.optimization.minimizer[0].options.terserOptions.compress.dead_code = true        // 去除不可达代码
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true; //去除console
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('el-cascader-multi/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('el-cascader-multi/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
  },
  devServer: {
    proxy: { 
      '/testApi': {
        target: 'http://222.128.6.194:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/testApi': ''
        }
      }
    }
  }
}
