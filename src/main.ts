/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-02-11 08:20:47
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-28 10:25:54
 */
import * as path from 'path';
import * as fs from 'fs-extra';

import Banner from "./lib/banner" // banner图
import Commander from "./lib/commander" // commander 生成
import Menu from "./lib/menu" // 生成选项
import Loader from "./lib/loader" // 装载器
import Origin from "./origin" // 原始配置

export class Main {

  constructor(public origin: any = new Origin()) {
    new Banner(this.origin.packageJson.version); // 创建 banner
    this.renderLanucher(this.origin)
  }

  async renderLanucher(origin: any) {
    const menu = new Menu()
    const COMMANDER: Commander = new Commander(origin.packageJson, origin.commanderConfig);
    const commanderOptions: any = await COMMANDER.createCommander(); // 获取 commander 的参数 --f 什么的
    const projectInfo = await menu.confirmProjectSource(this.projectInfoBuilder(commanderOptions)) // 构建项目文件信息
    
    if(!projectInfo.rewrite && projectInfo.exists) return; // 如果文件存在且不选择覆写停止程序
    const generator = await menu.menuGenerator(); // 获取构建实例
    
    new Loader({
      projectInfo,
      ...generator // choosen, moduleTree
    })
  }
  
  projectInfoBuilder(options: any) {
    const cwd = options.options.cwd || process.cwd();

    let projectInfo: any = {
      name: options.name === "." ? path.relative("../", cwd).split('/').reverse()[0] : options.name, // 项目名
      exists: false,      // 目录是否存在 
      rewrite: false,     // 是否覆盖
      root: null,         // 项目根目录
      src: null,          // 项目 src 目录
    }
    

    // 需要创建的目录地址 - 如果输入文件名为 . 的时候，就地创建
    const inCurrent = options.name === ".";
    inCurrent ? path.relative("../", cwd) : options.name;

    projectInfo.root = path.resolve(cwd, options.name || ".") // 项目目录
    projectInfo.src = projectInfo.root + "/src"; // 项目 src 目录
    
    if (options.options.force) {
      projectInfo.overwrite = true
    } else if (!options.options.force && fs.existsSync(projectInfo.root)) { // 如果没有强制覆写且文件
      projectInfo.exists = true;
    }

    return projectInfo
  }
}