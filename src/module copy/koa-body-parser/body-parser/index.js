const bodyParser = require("koa-bodyparser"); // 解析 post 参数

/**
 * 支持 post 参数
 */
module.exports = class KoaRouter {
  constructor(app) {
    app.use(bodyParser());
  }
};
