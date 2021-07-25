const config = require("config");
const mysql = require("mysql");

const ACTIVE = 1;
const INACTIVE = 0;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.get("mysql_hostname"),
  user: config.get("mysql_username"),
  password: config.get("mysql_password"),
  database: config.get("mysql_db_name"),
  multipleStatements: true,
});

function fKeyCheck(value, table, column) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id FROM " + table + " WHERE " + column + " = ? AND active = ?";
    pool.query(sql, [value, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = { pool, ACTIVE, INACTIVE, fKeyCheck };
