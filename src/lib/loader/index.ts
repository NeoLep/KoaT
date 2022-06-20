/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-18 00:30:52
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-20 11:01:17
 */
import FileOperator from "../../utils/file-operator"
import ModuleManage from "../../utils/module-manage"

import * as packageJson from "../../config/package.json"
import * as fs from "fs-extra"

export default class Loader {
  public fo = new FileOperator()
  public projectTree: any;
  public moduleTree: any;
  public packageJsonProto: any;

  constructor(projectTree: any) {
    this.projectTree = projectTree;
    this.setProjectRootDir(this.projectTree.projectInfo)
    this.moduleTree = this.buildModuleTree()
    this.packageJsonProto = this.renderPackageJson({
      baseInfo: {
        name: this.projectTree.projectInfo.name,
        description: this.projectTree.choosen.description,
        version: '0.0.1'
      },
      dependencies: this.renderDependencies(this.moduleTree)
    })
    
    this.renderAppJS()
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
    return packageJsonProto = {...packageJsonProto, ...settings}
  }

  setPackageJson() {
    // fs.writeFileSync(this.projectTree.projectInfo.root + "/package.json", JSON.stringify(packageJsonProto, null, 2))
  }

  renderAppJS() {
    // console.log(this.projectTree);
  }
  
  buildModuleTree() {
    return this.projectTree.moduleTree.map((module: any) => {
      let moduleElement: any = {}
      moduleElement.moduleSourcePath = module.modulePath, // module 源
      moduleElement.moduleTargetPath = this.projectTree.projectInfo.root + module.outputPath // 输出目录
      moduleElement.moduleIndexJSPath = moduleElement.moduleSourcePath + '/install.js' // index 实例
      moduleElement.dependencies = module.dependencies // 依赖实例
      moduleElement.dependenciesMerge = module.dependenciesMerge // 依赖冲突处理
      moduleElement.extraFile = module.extra.map((extraItem: any) => ({
          sourcePath: moduleElement.moduleSourcePath + '/extra' + extraItem.source,
          targetPath: moduleElement.moduleTargetPath + extraItem.target
      }))
      return moduleElement
    })
  }
}