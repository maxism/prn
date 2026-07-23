const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    inline: true,
    hot: true,
    overlay: true,
    stats: { colors: true }
  }
})
