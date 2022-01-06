// 判读是否是生产环境，这里这个项目的作者取了一个巧，判断非develop环境是这样的
// process.env.NODE_ENV !== 'production'
// 这样写不要好，有可能你们公司有很多环境，比如还有预发、灰度环境等等
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  isDevelopment,
  isProduction,
};
