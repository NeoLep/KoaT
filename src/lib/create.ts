import * as chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as ora from "ora";

const shell = require("shelljs");
const moveFile = require("../static/moveFile");

import Generator from "./generator"

export default class Create {
  public downloadDirectory: string;
  public projectRootDir: string;
  public projectSrcDir: string;
  public modulePath: string;
  public projectName: string;
  public configure: any;

  constructor(name: string, options: any, commander: any, downloadDirectory?: string) {
    if (downloadDirectory) this.downloadDirectory = downloadDirectory;
    this.projectName = name;
    this.createFile(name, options, commander)
  }

  async createFile(name: string, options: any, commander: any) {
    // 执行创建命令
    console.log(chalk.green("create project:  ") + name);
    // 读取指令配置 --f
    // console.log(chalk.green("set options:  ") + JSON.stringify(options));

    // 当前命令行选择的目录
    const cwd = options.cwd || process.cwd();

    // 如果输入文件名为 . 的时候，就地创建
    const inCurrent = name === ".";
    inCurrent ? path.relative("../", cwd) : name;

    // 需要创建的目录地址
    const targetDir = path.resolve(cwd, name || ".")
    this.projectRootDir = targetDir;
    this.projectSrcDir = targetDir + "/src";

    const DirExists = fs.existsSync(targetDir)

    // 判断目录是否存在
    if (DirExists || options.force) {
      // console.log(commander.fileExistsComander);
      console.log(chalk.red("project root dir:  ") + this.projectRootDir);
      let action = await this.createInquirer(commander.fileExistsComander);
      if (action) {
        const spinner = ora(`${chalk.green('delete')} ` + name).start();
        fs.remove(targetDir).then(() => {
          spinner.stopAndPersist({
            symbol: "✅",
            text: `${chalk.green('Delete Complete')}`,
          })
          for (let i = 0; i < 3; i++) console.log();
          this.selectTemplate(name, options)
        })
      }
    } else {
      this.selectTemplate(name, options)
    }
  }

  createInquirer(MessageConfig: any) {
    let prompt = {
      name: 'action',
      type: 'list',
      message: MessageConfig.message + ":",
      choices: [
        {
          name: MessageConfig.confirm,
          value: true
        }, {
          name: MessageConfig.cancel,
          value: false
        }
      ]
    }
    return new Promise(resolve => {
      inquirer.prompt([prompt]).then(select => {
        resolve(select.action)
      })
    })
  }

  async selectTemplate(name: string, options: any, debug: boolean = false) {
    this.modulePath = path.resolve(`${__dirname}`, '../module/');

    if (!debug) fs.mkdir(this.projectRootDir, () => {
      fs.mkdir(this.projectSrcDir, () => { });
    });

    // console.log(chalk.green('select options'));

    const generator = new Generator();
    const modules = generator.generatorDir();

    let configure = await inquirer.prompt(this.modulePrototype(modules))

    if (configure) {
      this.configure = configure;
      configure.name = name;
      generator.setPackageJson(configure);
      generator.renderDependices(configure.modules)
      // console.log("package.json", generator.packageJson);

      // 写入 package.json
      if (!debug) {
        fs.writeFile(this.projectRootDir + "/package.json", JSON.stringify(generator.packageJson, null, 2), error => {
          if (error) return console.log("写入文件失败" + error.message);
        });
      }

      // 装载 module
      configure.modules.forEach((item: any) => {
        // 获取 module 的 settings 中的配置
        const config = require(`${this.modulePath}/${item}/settings.json`)

        const moduleRoot = `${this.modulePath}/${item}/${config.dir}`
        const target = `${this.projectSrcDir}/${config.outputDir ? config.outputDir + '/' + config.dir : config.dir}`
        const targetDir = config.outputDir ? config.outputDir + '/' + config.dir : config.dir;

        this.createTargetDir("$root" ,targetDir);
        moveFile(moduleRoot, target)
        
        // 分析是否存在额外需要输出的文件或目录
        if(config.extraFileTarget) {
          // 判断是否存在 module 目录
          const extraModuleFile = config.extraFileTarget;
          const sourceURL: any = [];
          const targetURL = [];
          for(let key in extraModuleFile) {
            let extraModuleURL = this.modulePath + "/" + item + "/" + key;
            if(fs.existsSync(extraModuleURL)) {
              sourceURL.push(extraModuleURL)
              targetURL.push(this.projectRootDir + "/" + extraModuleFile[key])
            }
          }

          targetURL.forEach((item, index) => {
            this.createTargetDir("", item);
            moveFile(sourceURL[index], item)
          })

          // fs.existsSync(this.modulePath + item)
          // this.createTargetDir(this.projectSrcDir ,targetDir);
        }
        
      })

      this.renderAppJS(configure)
    }

  }


  renderAppJS(configure: any) {
    const ejs = require("ejs");
    // configure.modules
    const modules: any = [];
    const variable: any = [];

    // 在 app.js 中渲染 koa- 开头的 module
    configure.modules.forEach((item: any) => {
      const reg = /^koa-(\w*)/
      if (!reg.test(item)) return;

      const config = require(`${this.modulePath}/${item}/settings.json`)
      

      // 有的模块可能需要先挂载 比如 static
      if(config.loadIndex) {
        modules.splice(config.loadIndex, 0, config.dir)
        variable.splice(config.loadIndex, 0, this.transform(config.name));
      }
      else {
        modules.push(config.dir);
        variable.push(this.transform(config.name));
      }
    });

    // ejs 模版变量
    // console.log(modules, variable);

    const staticDir = path.resolve(`${__dirname}`, '../static/');

    ejs.renderFile(staticDir + "/app.ejs", { modules, variable }, (err: any, data: any) => {
      if (err) console.log(err);
      else this.WriteAppJS(data);
    });
  }

  WriteAppJS(data: any) {
    const staticDir = path.resolve(`${__dirname}`, '../static/');
    const readable = fs.createReadStream(`${staticDir}/watch.node.js`); //创建读取流
    const writable = fs.createWriteStream(`${this.projectRootDir}/watch.node.js`); //创建写入流
    readable.pipe(writable);

    fs.writeFile(this.projectSrcDir + "/app.js", data, error => {
      if (error) return console.log("写入文件失败" + error.message);
      console.log(chalk.green("build success"));
      const projectName = this.projectName;

      if (this.configure.install === 'y' || this.configure.install === 'Y'){
        const spinner = ora(chalk.green('npm install')).start();
        shell.exec(`
          cd ${this.projectName}
          npm install
        `, function () {
          spinner.stopAndPersist({
            symbol: "✅",
            text: `${chalk.green('install Complete')}`,
          })
          console.log();
          console.log(chalk.green("cd " + projectName));
          console.log(chalk.green("npm run serve"));
        })
      } else {
          console.log();
          console.log(chalk.green("cd " + projectName));
          console.log(chalk.green("npm install"));
          console.log(chalk.green("npm run serve"));
      }
    });
  }

  modulePrototype(modules: any) {
    let description: any = {
      name: 'description',
      type: 'text',
      message: "please input your description about this project:"
    }
    let module: any = {
      name: 'modules',
      type: 'checkbox',
      message: "select detail config:",
      choices: modules
    }
    let Install: any = {
      name: 'install',
      type: 'input',
      message: "auto install: (y/n)"
    }
    return [description, module, Install]
  }

  transform(str: string): any {
    let arr = str.split("-");
    let trans = "";
    arr.forEach(item => {
      let upper =
        item.substr(0, 1).toLocaleUpperCase() + item.substr(1, item.length - 1);
      trans += upper;
    });
    return trans;
  }

  createTargetDir(base: string, targetDir: string) {
    if(base === '$root') base = this.projectSrcDir;
    // 切割目标地址，一层层判断并创建
    const targetDirSplit = targetDir.split("/");
    const source = targetDirSplit.map((item: string, index: number) => {
      if (index != 0) {
        let str = "";
        for (let i = 0; i <= index; i++) {
          str += "/" + targetDirSplit[i];
        }
        return str;
      }
      return "/" + item;
    });
    source.forEach((item: any) => {
      // 如果目录不存在先创建
      if (!fs.existsSync(base + item)) {
        fs.mkdirSync(base + item)
      }
    })
  }
}