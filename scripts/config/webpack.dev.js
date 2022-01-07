const Webpack = require('webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const paths = require('../paths');
const { isDevelopment } = require('../env');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  target: 'web',
  output: {
    filename: 'js/[name].js',
    path: paths.appBuild,
  },
  devServer: {
    compress: true,
    stats: 'errors-only',
    clientLogLevel: 'silent',
    open: true,
    hot: true,
    noInfo: true,
    proxy: {
      ...require(paths.appProxySetup),
    },
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDevelopment ? '"development"' : '"production"',
      },
    }),
  ],
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
});
