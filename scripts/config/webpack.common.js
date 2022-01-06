// 插件把 webpack 打包后的静态文件自动插入到 html 文件当中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用来分离css为单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 添加打包进度条插件
const WebpackBar = require('webpackbar');
// 它在一个单独的进程上运行类型检查器，该插件在编译之间重用抽象语法树，并与TSLint共享这些树。
// 可以通过多进程模式进行扩展，以利用最大的CPU能力。
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// 在webpack中拷贝文件和文件夹
const CopyPlugin = require('copy-webpack-plugin');
// 引入路径工具，上文已讲
const paths = require('../paths');
// 引入环境判断工具，上文已讲
const { isDevelopment, isProduction } = require('../env');
// 引入配置文件，上文已讲
const { imageInlineSizeLimit } = require('../conf');

// 这个函数是用来加载css相关loader的函数
// 如果是开发环境用style-loader，将css内嵌到html中，反之css单独打包
const getCssLoaders = (importLoaders) => [
  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDevelopment,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          isProduction && [
            // 开发环境不使用postcss-preset-env加浏览器前缀，加快打包时间
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
        ].filter(Boolean),
      },
    },
  },
];

module.exports = {
  // 入口信息
  entry: {
    app: paths.appIndex,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  // 这里可以设置extensions和别名
  // extensions就是webpack会识别的文件后缀的顺序，
  // 如果你是tsx建议放到第一位，否则你写成['ts','tsx']会先检测是否是ts文件，不是才接着看是不是tsx
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      Src: paths.appSrc,
      Components: paths.appSrcComponents,
      Utils: paths.appSrcUtils,
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    axios: 'axios',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true }, // 这是一个webpack优化点，使用缓存
        exclude: /node_modules/, // 这个也是webpack优化的点 exclude排除不需要编译的文件夹
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1), // 这个讲得就是importLoaders属性运用，上面已经讲了
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset', // webpack5自带的loader，webpack4依赖file-loader
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource', // webpack5自带的loader，webpack4依赖file-loader
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 这个模块是重点，下面详细讲
      template: paths.appHtml,
      cache: true,
    }),
    new CopyPlugin({
      // 这个是复制文件或者目录的插件
      patterns: [
        {
          context: paths.appPublic,
          from: '*',
          to: paths.appBuild,
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    // 打包进度条插件
    new WebpackBar({
      name: isDevelopment ? 'RUNNING' : 'BUNDLING',
      color: isDevelopment ? '#52c41a' : '#722ed1',
    }),
    // 插件功能上面已写
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.appTsConfig,
      },
    }),
  ],
};
