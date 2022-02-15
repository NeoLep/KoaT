export default class Origin {
  public configFile: any = {
    packageJson: null,
    commanderConfig: null
  }


  public packageJson = require("../../package.json");
  public commanderConfig = require("../config/commander.json");
  
  public downloadDirectory: String = `${process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]}/.template`
  
  constructor() {
    if(this.packageJson) this.configFile.packageJson = this.packageJson;
    if(this.commanderConfig) this.configFile.commanderConfig = this.commanderConfig
    
  }
}