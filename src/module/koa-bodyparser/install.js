/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-28 12:06:08
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 11:31:13
 */
const bodyParser = require("koa-bodyparser"); // 解析 post 参数

module.exports = {
  koaModuleSettings: {
    moduleName: 'koa-bodyparser',
  },
  install(Koa, options) {
    Koa.use(bodyParser())
  },
}