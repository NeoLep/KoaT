const bodyParser = require("koa-bodyparser"); // 解析 post 参数

module.exports = {
  install(Koa, options) {
    Koa.use(bodyParser())
  }
}