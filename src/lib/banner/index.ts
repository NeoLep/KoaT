const CFonts = require('cfonts');
import * as chalk from 'chalk';

export default class Banner {
  constructor(public version:string = version) {
    this.createBanner();
  }

  createBanner() {
    CFonts.say('KoaT', {
    	font: 'block',              // define the font face
    	align: 'left',              // define text alignment
    	colors: ['cyan'],         // define all colors
    	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    	letterSpacing: 1,           // define letter spacing
    	lineHeight: 1,              // define the line height
    	space: true,                // define if the output text should have empty lines on top and on the bottom
    	maxLength: '0',             // define how many character can be on one line
    	gradient: false,            // define your two gradient colors
    	independentGradient: false, // define if you want to recalculate the gradient for each new line
    	transitionGradient: false,  // define if this is a transition between colors directly
    	env: 'node'                 // define the environment CFonts is being executed in
    });
    
		console.log(
			`\r\nRun ${chalk.cyan(`koat <command> --help`)} show details\r\n`
			)
    console.log(
      chalk.bgCyanBright.hex('#1f2428').bold("version " +this.version)
    );
  }
}