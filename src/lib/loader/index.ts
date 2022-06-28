/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-18 00:30:52
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-28 10:37:40
 */
import FileOperator from "../../utils/file-operator"
import ModuleManage from "../../utils/module-manage"

import * as packageJson from "../../config/package.json"
import * as fs from "fs-extra"
import * as path from 'path';
import * as  ejs from 'ejs';
import * as chalk from 'chalk';
import * as ora from "ora";
import * as shell from "shelljs";

export default class Loader {
  public Mode: String = 'dev';

  public fo = new FileOperator()
  public projectTree: any;
  public moduleTree: any;
  public packageJsonProto: any;
  public staticPath: String = path.resolve(`${__dirname}`, '../../static/');

  constructor(projectTree: any) {
    // {
    //   projectInfo: {},
    //   choosen: {},
    //   moduleTree: []
    // }
    this.projectTree = projectTree;
    this.setProjectRootDir(this.projectTree.projectInfo)
    this.moduleTree = this.buildModuleTree()
    this.projectTree.moduleTree = this.moduleTree;
    this.packageJsonProto = this.renderPackageJson({
      baseInfo: {
        name: this.projectTree.projectInfo.name,
        description: this.projectTree.choosen.description,
        version: '0.0.1'
      },
      dependencies: this.renderDependencies(this.moduleTree)
    })
    this.setPackageJson(this.packageJsonProto)
    
    this.renderAppJS()
    this.renderModules()
    if(this.projectTree.choosen.install) this.autoInstall()
  }

  async setProjectRootDir(projectInfo: any) {
    let removeResult;
    if(projectInfo.rewrite) {
      removeResult = this.fo.removeTarget(projectInfo.root)
    }
    // if(removeResult) console.log(removeResult);
    this.fo.mkdir(projectInfo.root)
  }
  
  renderDependencies(moduleTree: any) {
    const m = new ModuleManage()
    let dependencies: any = {}
    moduleTree.forEach((moduleItem: any) => {
      for(let key in moduleItem.dependencies) {
        if(dependencies[key]) {
          /**
          * up:    取二者之间比较大的版本
          * down:  取二者之间小的版本
          * self:  取自己的值
          */
          // 存在 使用配置的冲突
          let typeArr = ['self', 'up', 'down']
          let mergeType = 'up' // 默认向上取版本

          if(moduleItem['dependenciesMerge']) { // 如果存在冲突配置，启用冲突配置 
            if(moduleItem.dependenciesMerge[key]) {
              if (typeArr.indexOf(moduleItem.dependenciesMerge[key]) !== -1) {
                mergeType = moduleItem.dependenciesMerge[key];
              }
            } else if(moduleItem.dependenciesMerge.default) {
              if (typeArr.indexOf(moduleItem.dependenciesMerge['default']) !== -1) {
                mergeType = moduleItem.dependenciesMerge['default'];
              }
            }
          }
          const dependenciesExist = m.compareVersion(moduleItem.dependencies[key], dependencies[key]) // 大于为 1
          if (mergeType === 'self') dependencies[key] = moduleItem.dependencies[key] // self 直接插入
          if (mergeType === 'up' && dependenciesExist === 1) dependencies[key] = moduleItem.dependencies[key] // 插入 新版本
          if (mergeType === 'down' && dependenciesExist === -1) dependencies[key] = moduleItem.dependencies[key] // 插入 旧版本
        } else {
          dependencies[key] = moduleItem.dependencies[key]
        }
      }
    })
    return dependencies
  }

  renderPackageJson(settings: any) {
    let packageJsonProto = packageJson;
    packageJsonProto = {...packageJsonProto, ...settings.baseInfo}
    packageJsonProto.dependencies = {...packageJsonProto.dependencies, ...settings.dependencies}
    return packageJsonProto
  }

  setPackageJson(packageJsonProto: any) {
    fs.writeFileSync(this.projectTree.projectInfo.root + "/package.json", JSON.stringify(packageJsonProto, null, 2))
  }

  renderAppJS() {
    this.fo.copy(`${this.staticPath}/Koat.js`, `${this.projectTree.projectInfo.src}/Koat/index.js`)
    
    fs.writeFileSync(`${this.projectTree.projectInfo.src}/Koat/initTree.json`, JSON.stringify(this.projectTree, null, 2))
    
    ejs.renderFile(`${this.staticPath}/app.ejs`, { moduleTree: this.projectTree.moduleTree, port: this.projectTree.choosen.port }, (err, data) => {
      if (err) console.log(err);
      fs.writeFileSync(this.projectTree.projectInfo.src + "/app.js", data)
    });
  }

  renderModules() {
    this.projectTree.moduleTree.forEach((item: any) => {
      // 装载 index.js
      this.fo.copy(item.moduleIndexJSPath, item.moduleIndexTargetJSPath)
      // 装载 补充文件 extra 字段
      item.extraFile.forEach((extraItem: any) => {
        this.fo.copy(extraItem.sourcePath, extraItem.targetPath)
      })
    })
  }
  
  buildModuleTree() {
    return this.projectTree.moduleTree.map((module: any) => {
      let moduleElement: any = {
        ...module
      }
      moduleElement.moduleSourcePath = module.modulePath, // module 源
      moduleElement.moduleTargetPath = this.projectTree.projectInfo.src + module.outputPath // 输出目录
      moduleElement.moduleIndexJSPath = moduleElement.moduleSourcePath + '/install.js' // index 实例
      moduleElement.moduleIndexTargetJSPath = moduleElement.moduleTargetPath + '/index.js'
      moduleElement.dependencies = module.dependencies // 依赖实例
      moduleElement.dependenciesMerge = module.dependenciesMerge // 依赖冲突处理
      moduleElement.extraFile = module.extra.map((extraItem: any) => {
        
        const pathDiv = extraItem.target.split('/');
        if(pathDiv[0] === '') pathDiv.splice(0, 1)

        let prevPath = moduleElement.moduleTargetPath;

        if(pathDiv[0] === '@src') {
          prevPath = this.projectTree.projectInfo.src
          pathDiv.splice(0, 1)
        } else if (pathDiv[0] === '@root') {
          prevPath = this.projectTree.projectInfo.root
          pathDiv.splice(0, 1)
        }

        return {
          sourcePath: moduleElement.moduleSourcePath + '/extra' + extraItem.source,
          targetPath: prevPath + '/' + pathDiv.join('/')
        }
      })
      moduleElement.requireName = module.moduleName.replace(/-(\w)/g,($0: any, $1: any) => {
        return $1.toUpperCase();
      }) // 获取引入名称，驼峰处理
      return moduleElement
    })
  }

  autoInstall() {
    const spinner = ora(chalk.green('npm install')).start();
    shell.exec(`
      cd ${this.projectTree.projectInfo.root}
      npm install
    `,() => {
      spinner.stopAndPersist({
        symbol: "✅",
        text: `${chalk.green('install Complete')}`,
      })
      console.log();
      console.log(chalk.green("cd " + this.projectTree.projectInfo.name));
      console.log(chalk.green("npm run serve"));
    })
  }
}