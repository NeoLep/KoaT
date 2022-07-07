/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-07-04 08:57:48
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 10:45:18
 */
const compose = require('koa-compose')

const logger = (ctx, next) => { // 默认打印日志
  console.log(`get request: ${Date.now()}, ${ctx.request.method}, ${ctx.request.url}`);
    next();
}
module.exports = {
  install(Koa, options) {
    const middlerwares = compose([logger]);
    Koa.use(middlerwares)
  }
}