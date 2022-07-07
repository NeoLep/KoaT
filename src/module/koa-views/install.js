/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-06-16 17:39:58
 * @LastEditors: Leep
 * @LastEditTime: 2022-07-07 12:12:06
 */
const views = require("koa-views")
const path = require('path') 

module.exports = {
  koaModuleSettings: {
    link: '/koa-views/',
    moduleName: 'koa-views'
  },
  install(Koa, options) {
    Koa.use(views(path.join(__dirname,"../../../public/views/"),{extension:'ejs'}))

    if(options.injectProto.koaRouter) {
      const router = options.injectProto.koaRouter.getRouter()
      router.get('/koa-views', async ctx => await ctx.render('index', {message: 'Koa Views is working...'}))
    }
  },
};
