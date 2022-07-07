/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-06-16 13:51:40
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 11:29:33
 */
// router 的入口文件
const Router = require("koa-router"); // 引入路由
const router = new Router();

router.get("/router", ctx => {
  ctx.body = "koa router is working";
});

module.exports = {
  install(Koa, options) {
    Koa.use(router.routes(), router.allowedMethods());
  },
  setRoute(settings) {
    router[settings.method || 'get'](settings.url, async ctx => {
      settings.render(ctx)
    })
  },
  getRouter() {
    return router
  }
};
