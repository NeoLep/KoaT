/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-06-16 11:13:19
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 10:57:27
 */
const Koa = require("koa");
const ejs = require("ejs");
const path = require("path"); // 配置静态web服务的中间件

const projectTree = require("./initTree.json");
module.exports = class Koat {
  KoaApp = new Koa()

  renderModuleListInject(injectProto) {
    const moduleList = [];
    for(let key in injectProto) {
      let moduleSettings = {};
      if(!injectProto[key].koaModuleSettings?.moduleName) {
        moduleSettings.moduleName = key
      }
      if (injectProto[key].koaModuleSettings) {
        moduleSettings = {...moduleSettings, ...injectProto[key].koaModuleSettings}
      }
      moduleList.push(moduleSettings)
    }
    return moduleList
  }

  renderIndexPage(moduleList, injectProto) {
    let IndexPageDomInfo = "index page";
    ejs.renderFile(path.resolve(`${__dirname}`, "./index.ejs"), {moduleList}, (err, data) => {
      if (err) console.log(err);
      IndexPageDomInfo = data;
    })
    if(!injectProto.koaRouter) {
      this.KoaApp.use(async ctx => {
        ctx.body = IndexPageDomInfo;
      });
    } else {
      injectProto.koaRouter.setRoute({
        method: 'get',
        url: '/',
        render: (ctx) => ctx.body = IndexPageDomInfo
      })
    }
  }

  constructor(injectProto) {
    const moduleList = this.renderModuleListInject(injectProto)

    this.renderIndexPage(moduleList, injectProto) // 渲染首页 [如果不需要可以选择覆盖]

    for (let modulesName in injectProto) {
      injectProto[modulesName].install(this.KoaApp, {projectTree, injectProto});
    }
    
    // return this.KoaApp
  }
  listen(port = 3000) {
    console.log("server is working at: http://localhost:" + port);
    this.KoaApp.listen(port);
    return this.KoaApp;
  }
};
