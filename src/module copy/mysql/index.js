/*
 * @description:
 * @param:
 * @return:
 * @author: Leep
 * @Date: 2022-05-25 17:01:24
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-16 11:11:47
 */
const path = require("path");
const dbFilePath = path.resolve(`${__dirname}`, "./config.js");
const MySQL_LIST = require(dbFilePath);
module.exports = class ConnectorPool {
  constructor(app) {
    console.log(MySQL_LIST);
    console.log(app);
  }
};
