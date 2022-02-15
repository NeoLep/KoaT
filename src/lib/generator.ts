import * as fs from 'fs';  
import * as path from 'path';

const packageJson = require("../config/package.json")

export default class Generator {

  public modulePath: string;
  public packageJson: any = packageJson;

  constructor() {
    this.modulePath = path.resolve(`${__dirname}`, '../module/');
  }

  public modules: any = []

  generatorDir(): any {
    const dependices: any = []
    const Dir = fs.readdirSync(this.modulePath);
    Dir.forEach(dirname => {
      const dir = `${this.modulePath}/${dirname}`
      const moduleFile = fs.readdirSync(dir);
      if(moduleFile.includes('index.js') && moduleFile.includes('settings.json')) {
        // const moduleConfig = require(`${dir}/settings.json`);
        dependices.push(dirname)
      }
      // const moduleConfig = 
      // require(`${this.modulePath}/${dirname}/settings.json`)
      // console.log(moduleConfig);
    })
    return dependices;
  }
  
  renderDependices(modulesList: any): any {
    // console.log(this.modulePath);
    let dependices: any = {};
    modulesList.forEach((item: any) => {
      const moduleConfig = require(`${this.modulePath}/${item}/settings.json`)
      if (moduleConfig.dependencies) {
        for(let key in moduleConfig.dependencies) {
          dependices[key] = moduleConfig.dependencies[key];
        }
      }
    })
    this.packageJson.dependencies = {...this.packageJson.dependencies, ...dependices};
    // console.log("package.json", this.packageJson);
    return this.packageJson;
  }
  
  setPackageJson(configure: any) {
    this.packageJson['name'] = configure['name'];
    this.packageJson['description'] = configure['description'];
  }
  
}