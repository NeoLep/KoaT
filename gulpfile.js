// gulp 的配置选项
const { series } = require("gulp");
const watch = require("gulp-watch");
const { spawn, exec } = require("child_process");
const chalk = require("chalk");

var fs = require("fs");
var stat = fs.stat;

// 启动入口
const IntroFile = "index";
const MONITOR = ["./src/**/*", `${IntroFile}.ts`];

// 针对保存事件的防抖
const debounceRestart = debounce(buildTS, 500);

// 保存进程地址，重启时销毁
let childProcess;

// 初始化方法
function init(cb) {
  // place code for your default task here
  debounceRestart();
  cb();
}

// 可以只关联一个任务，监听
watch(MONITOR, () => {
  console.log(chalk.green("rebuild TypeScript"));
  debounceRestart();
});

function buildTS() {
  console.log(chalk.green("building...."));
  exec("tsc", (err, stderr) => {
    if (!err) {
      console.log(
        chalk.green("build success, start loaded " + `${IntroFile}.ts`)
      );
      reloadApp();
    } else {
      console.log(chalk.red("build failed, please try to rebuild"));
      console.log(err, stderr);
    }
  });
}

function debounce(fn, delay) {
  let id;
  return () => {
    clearTimeout(id);
    id = setTimeout(() => {
      fn();
    }, delay);
  };
}

function reloadApp() {
  childProcess && childProcess.kill();

  childProcess = spawn("node", ["./build/" + `${IntroFile}.js`], {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
  console.log(chalk.green("load success"));

  extraBuildStatic();
}

var copy = function(src, dst) {
  //读取目录
  fs.readdir(src, function(err, paths) {
    if (err) {
      throw err;
    }
    paths.forEach(function(path) {
      var _src = src + "/" + path;
      var _dst = dst + "/" + path;
      var readable;
      var writable;
      stat(_src, function(err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst); //创建写入流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
};

var exists = function(src, dst, callback) {
  //测试某个路径下文件是否存在
  fs.exists(dst, function(exists) {
    if (exists) {
      //不存在
      callback(src, dst);
    } else {
      //存在
      fs.mkdir(dst, function() {
        //创建目录
        callback(src, dst);
      });
    }
  });
};

// function
function extraBuildStatic() {
  // fs.mkdir("./build/static", (err, data) => {});
  exists("./src/static", "./build/src/static", copy);
}

exports.default = series(init);
