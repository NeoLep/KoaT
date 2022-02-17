const Router = require("koa-router");
const router = new Router();
const fs = require("fs");
const path = require("path");

router.get("/", ctx => {
  const modulePath = path.resolve(`${__dirname}`, "./index.html");
  const html = fs.readFileSync(modulePath);
  ctx.body = html;
});

router.get("/home", ctx => {
  ctx.body = "home page";
});

module.exports = class KoaRouter {
  constructor(app) {
    app.use(router.routes(), router.allowedMethods());
  }
};
