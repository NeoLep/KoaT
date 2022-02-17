const chokidar = require("chokidar");
const { spawn } = require("child_process");
const path = require("path");

const modulePath = path.resolve(`${__dirname}`, "./src");
let childProcess;

let debounceRestart = debounce(restart, 500);

// One-liner for current directory
chokidar.watch([modulePath + "/."]).on("all", (event, path) => {
  // console.log(event, path);
  process.stdout.cursorTo(0, 0);
  process.stdout.clearScreenDown();
  debounceRestart();
});

function debounce(fn, delay) {
  let id;
  return () => {
    clearTimeout(id);
    id = setTimeout(() => {
      fn();
    }, delay);
  };
}

function restart() {
  // console.log("restart");
  childProcess && childProcess.kill();

  childProcess = spawn("node", ["./src/app.js"], {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}
