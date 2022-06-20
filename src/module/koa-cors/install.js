/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-16 17:39:58
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-16 17:40:31
 */
const cors = require("koa-cors");

module.exports = {
  install(Koa, options) {
    Koa.use(cors())
  }
}