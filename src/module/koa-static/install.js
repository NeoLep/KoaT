/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-06-16 17:39:58
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 12:23:46
 */
const staticServer = require("koa-static");
const path = require("path"); // 配置静态web服务的中间件

module.exports = {
  koaModuleSettings: {
    moduleName: 'koa-staic'
  },
  install(Koa, options) {
    const statisPath = path.resolve(`${__dirname}`, "../../../public");
    Koa.use(staticServer(statisPath));
  }
};
