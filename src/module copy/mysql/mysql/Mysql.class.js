/**
 *  Mysql Module
 *  const database = new Mysql(config)
 *  database.function()
 */
const mysql = require("mysql");

// host: "your database url",
// user: "username",
// password: "password",
// database: "choose database"
// port: 3306,
// multipleStatements: true

module.exports = class Mysql {
  // 状态管理对象
  #status = {
    connect: false, // 连接数据库的状态
    pending: false, // 对象是否正被占用
    locking: false // 控制锁
  };
  // 数据库连接池实例
  #database;

  // 数据库配置
  config = {
    autoClose: true, // 自动断开连接池默认开启
    closeTime: 60 // 自动断开连接池事件: 秒数
  };

  // 构造方法
  constructor(config) {
    this.#database = mysql.createConnection(config);
    this.config = { ...this.config, ...config };
    // console.log(this.config);
  }

  // 避免阻塞，同时只能存在一次调用
  connectToBase() {
    this.#status.locking = true;
    let connectStatus = {};
    return new Promise(resolve => {
      this.#database.connect(err => {
        if (err) {
          connectStatus.status = false;
          connectStatus.err = err;
        } else {
          connectStatus.status = true;
        }
        this.#status.locking = false;
        resolve(connectStatus);
      });
    });
  }

  // 测试方法，判断连接状态
  async test(init) {
    if (this.#status.locking) return console.log("locking");
    else {
      let result = await this.connectToBase();
      if (result) {
        this.#status.status = result.status;
        console.log(result.status);
      }
    }
  }

  // 执行 sql 语句方法
  execute(sql) {
    if (this.config.autoClose) {
      setTimeout(() => {
        console.log("auto disconnect database");
        this.close();
      }, this.config.closeTime * 1000);
    }

    return new Promise((res, rej) => {
      this.#database.query(sql, (err, rows) => {
        if (err) rej(err);
        res(rows);
      });
    });
  }

  // 关闭连接池
  close(debug) {
    if (debug) console.log("close connection from" + this.config.database);
    this.#database.end();
  }
};
