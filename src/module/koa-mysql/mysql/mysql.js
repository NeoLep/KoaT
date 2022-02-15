/* 测试-start */
const mysql = require("mysql");

let pool = mysql.createConnection({
  host: "your database url",
  user: "username",
  password: "password",
  database: "choose database"
});

function query(sql, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("与数据库连接失败");
    } else {
      console.log("数据库建立连接");
      connection.query(sql, function(err, rows) {
        callback(err, rows);
        connection.release();
      });
    }
  });
}

exports.query = query;
