// 这个插件最开始讲了，一下的插件就略过都讲过了
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common');
const paths = require('../paths');
const { shouldOpenAnalyzer, ANALYZER_HOST, ANALYZER_PORT } = require('../conf');

module.exports = merge(common, {
  mode: 'production', // 这个需要细讲，下面说
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: paths.appBuild,
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  plugins: [
    // 打包后会有dist（或者build，名字在output里设置）目录
    // 再次打包时需要把之前的dist删掉后，再次生成dist
    // 这个插件就是其删掉作用的
    new CleanWebpackPlugin(),
    // 提取css的插件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    // 开启分析工具的插件，分析包的体积
    shouldOpenAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: ANALYZER_HOST,
        analyzerPort: ANALYZER_PORT,
      }),
  ].filter(Boolean),
  // 这个重点下面讲
  optimization: {
    concatenateModules: false,
    minimize: true,
    minimizer: [
      // new TerserPlugin({ // 这个常用配置后面下面讲
      //   extractComments: false,
      //   terserOptions: {
      //     compress: { pure_funcs: ['console.log'] },
      //   },
      // }),
      new CssMinimizerPlugin(), // css压缩插件
    ],
    splitChunks: {
      // 这个是重点下面讲
      chunks: 'all',
      minSize: 0,
    },
  },
});
