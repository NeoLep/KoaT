/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-06-16 11:13:19
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-28 10:38:14
 */
const Koa = require("koa");
const projectTree = require("./initTree.json");
module.exports = class Koat {
  KoaApp = new Koa();

  constructor(injectProto) {
    for (let modulesName in injectProto) {
      if (injectProto[modulesName].install)
        injectProto[modulesName].install(this.KoaApp, projectTree);
    }
    this.KoaApp.use(async ctx => {
      ctx.body = "Koa is loaded success";
    });
  }
  listen(port = 3000) {
    this.KoaApp.listen(port);
    console.log("server is working at: http://localhost:" + port);
    return this.KoaApp;
  }
};
