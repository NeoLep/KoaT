/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-05-26 14:44:43
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-18 00:39:00
 */
import { Command } from 'commander';

export default class CommanderTerm {
  public packageJson: any;
  public commanderConfig: any = {
    description: null
  };

  constructor(packageJson: any, commanderConfig?: any) {
    this.packageJson = packageJson;
    if(commanderConfig) this.commanderConfig = commanderConfig;
  }

  createCommander() {
    const program = new Command();
    
    return new Promise(res => {
      // 定义命令和参数
      program
        .command('create <app-name>')
        .description(this.commanderConfig.description)
        // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
        .option('-f, --force', 'overwrite target directory if it exist')
        .option('-V| --version', 'show koat version')
        .action((name, options) => {
          if(options.force) {
            console.log('force update');
          }
          if(options.version) {
            console.log('koat version: ' + this.packageJson.version);
          }
          // 打印执行结果
          // console.log('name:',name,'options:',options)
          res({ name, options})
        })
  
      // 配置版本号信息
      program
        .version(this.packageJson.version)
        .usage('<command> [option]')
  
      // 解析用户执行命令传入参数
      program.parse(process.argv);
    })
  }
}