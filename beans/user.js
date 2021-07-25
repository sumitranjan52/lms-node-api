const { pool, ACTIVE, INACTIVE } = require("../db");

function fetchUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, username, name, email, mobile, password, admin, teacher, student FROM lms_users WHERE username = ? AND active = ?";
    pool.query(sql, [username, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (results[0]) {
        resolve(JSON.parse(JSON.stringify(results[0])));
      } else {
        resolve();
      }
    });
  });
}

function updatePassword(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_users SET password = ? WHERE username = ? AND id = ? AND active = ?";
    pool.query(sql, data, (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = { fetchUserByUsername, updatePassword, ACTIVE };
