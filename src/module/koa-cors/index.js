const cors = require("koa-cors");

module.exports = class KoaRouter {
  constructor(app) {
    app.use(cors());
  }
};
