import {CommanderTerm} from "./components/commander"
import Origin from "./origin"
import Create from "./lib/create"
import Banner from "./components/banner"

export class Main {
  constructor(public origin: any = new Origin()) {
    new Banner(this.origin.packageJson.version)
    this.commanderInitial();

  }

  async commanderInitial() {
    let commander = new CommanderTerm(this.origin.packageJson, this.origin.commanderConfig);
    let options: any = await commander.createCommander();
    if(options) new Create(options.name, options.options, this.origin.commanderConfig, this.origin.downloadDirectory);
  }
}