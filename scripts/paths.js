// 以下是两个node模块
const path = require('path');
const fs = require('fs');

// 同步获取node执行的文件的工作目录, 我们的工作目录一般都是项目的根目录，这里就表示根目录
// 为啥这么说呢，因为package.json写着webpack --config ./scripts/config/webpack.prod.js
// webpack就是借助node的能力，它的 ./scripts就暴露是以项目目录为根目录
// 这里需要注意process.cwd和__dirname的区别
// process.cwd()返回当前工作目录。如：调用node命令执行脚本时的目录。
// __dirname返回源代码所在的目录
// console.log(process);
const appDirectory = fs.realpathSync(process.cwd());
console.log('appDirectory', appDirectory);

// 获取绝对路径的方法函数
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}
console.log('resolveApp', resolveApp('src'));

// 默认extentions
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

/**
 * Resolve module path
 * @param {function} resolveFn resolve function
 * @param {string} filePath file path
 */
function resolveModule(resolveFn, filePath) {
  // Check if the file exists
  const extension = moduleFileExtensions.find((ex) =>
    fs.existsSync(resolveFn(`${filePath}.${ex}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.ts`); // default is .ts
}

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndex: resolveModule(resolveApp, 'src/index'), // Package entry path
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'), // node_modules path
  appSrc: resolveApp('src'),
  appSrcComponents: resolveApp('src/Components'),
  appSrcUtils: resolveApp('src/utils'),
  appProxySetup: resolveModule(resolveApp, 'src/setProxy'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  moduleFileExtensions,
};
