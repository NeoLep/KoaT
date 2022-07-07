/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-16 17:39:58
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 12:24:16
 */
const cors = require("koa-cors");

module.exports = {
  koaModuleSettings: {
    moduleName: 'koa-cors'
  },
  install(Koa, options) {
    Koa.use(cors())
  }
}