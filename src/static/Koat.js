/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-16 11:13:19
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-18 10:12:48
 */
const Koa = require('koa');


module.exports = class Koat {
  KoaApp = new Koa();

  constructor(injectProto) {
    for(let modulesName in injectProto) {
      if(injectProto[modulesName].install) injectProto[modulesName].install(KoaApp)
    }
    // KoaApp.use(async ctx => {
    //   ctx.body = 'Hello World';
    // });
  }
  listen(port = 3000) {
    KoaApp.listen(port);
    return KoaApp;
  }
}