/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-15 15:02:59
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-18 08:31:22
 */

import * as inquirer from 'inquirer';
import * as path from 'path';
import * as ora from "ora";
import FileOperator from "../../utils/file-operator"

export default class CommanderTerm {
  public fo = new FileOperator(); // 文件操作工具实例
  public moduleOptions:Array<Object> = [] // 选择的 module 的配置集合
  public propmtList: Array<any> = [] // inquier 配置
  
  constructor() {
    let moduleArr: Array<String> = [];
    const modulePath = path.resolve(`${__dirname}`, '../../module/');
    const fileListArr = this.fo.travelPath(modulePath) // module 文件列表

    this.propmtList = require("./menu.json") // 引入 terminal 配置
    
    fileListArr.forEach((item: any) => {
      let moduleItemPath = `${modulePath}/${item}`
      let moduleItemSettings = require(`${moduleItemPath}/settings/settings.json`)
      moduleItemSettings.modulePath = moduleItemPath;

      let insertIndex = -1;
      if(moduleItemSettings.before) {
        moduleItemSettings.before.forEach((moduleName: String) => {
          const index = moduleArr.indexOf(moduleName)
          if(index !== -1 && insertIndex === -1)  insertIndex = index;
          if(index !== -1 && insertIndex > index) insertIndex = index;
        })
      }

      if(insertIndex !== -1) moduleArr.splice(insertIndex, 0, moduleItemSettings.moduleName)
      else moduleArr.push(moduleItemSettings.moduleName) // 插入 modules 选项数组

      this.propmtList[1].choices = moduleArr // modules 数组注入
      this.moduleOptions.push(moduleItemSettings) // 插入行
    })
  }

  menuGenerator(): Promise<any> {
    return new Promise((resolve: any) => {
      inquirer.prompt(this.propmtList).then((choosen: any) => {
        let moduleTree: Array<Object> = [] 
        choosen.modules.forEach((item: any) => {
          const index = this.moduleOptions.findIndex((module: any) => module.moduleName === item)
          if(index !== -1) moduleTree.push(this.moduleOptions[index])
        })
        
        resolve({
          choosen,
          moduleTree
        })
      });
    })
  }

  confirmProjectSource(projectInfo: any): Promise<any> {
    return new Promise((resolve: any) => {
      if (projectInfo.exists && !projectInfo.rewrite) {
        inquirer.prompt([{
          "name": "rewrite",
          "type": "confirm",
          "message": `directory ${projectInfo.name} is alerady exist in ${projectInfo.root}, overwrite it?`,
          "default": false
        }]).then(res => {
          projectInfo.rewrite = res.rewrite
          resolve(projectInfo)
        })
      } else {
        resolve(projectInfo)
      }
    })
    // this.fo.removeTarget("./mobile.md").then((res: any) => {
    //   console.log(res);
    // })
  }
}