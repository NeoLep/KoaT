const staticServer = require("koa-static");
const path = require("path");
// 配置静态web服务的中间件

module.exports = class KoaStatic {
  constructor(app) {
    const statisPath = path.resolve(`${__dirname}`, "../../public");
    app.use(staticServer(statisPath));
  }
};
