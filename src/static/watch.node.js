const chokidar = require("chokidar");
const { spawn } = require("child_process");

let childProcess;

let debounceRestart = debounce(restart, 500);

// One-liner for current directory
chokidar.watch(["*"]).on("all", (event, path) => {
  console.log(event, path);

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
  console.log("restart");
  childProcess && childProcess.kill();

  childProcess = spawn("node", ["./src/app.js"], {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}
