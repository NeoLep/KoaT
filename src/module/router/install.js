/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-16 13:51:40
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-16 16:47:43
 */
// router 的入口文件
const Router = require("koa-router"); // 引入路由
const router = new Router();

router.get("/home", ctx => {
  ctx.body = "Hello World Home";
});

module.exports = {
  install(Koa, options) {
    Koa.use(router.routes(), router.allowedMethods())
  }
}