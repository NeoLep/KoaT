/*
 * @description: 用来构建选项菜单
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-05-26 14:28:50
 * @LastEditors: Leep
 * @LastEditTime: 2022-05-26 14:38:09
 */
export default class Panel {
  public PanelConfigJson = require("../config/panel.config.json")
  constructor() {
    console.log(this.PanelConfigJson);
  }
}