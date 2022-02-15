const Router = require("koa-router");
const router = new Router();

router.get("/home", ctx => {
  ctx.body = "home page";
});

module.exports = class KoaRouter {
  constructor(app) {
    app.use(router.routes(), router.allowedMethods());
  }
};
