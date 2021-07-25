const { pool, ACTIVE, INACTIVE } = require("../db");

function createCountry(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_country` (`country`, `created`) VALUES (?, ?)";
    pool.query(sql, [data.country, data.created.id], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateCountry(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_country SET country = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.country, data.modified.id, data.id, ACTIVE],
      (error, results) => {
        if (error) {
          reject(error.message);
          return;
        }
        resolve(JSON.parse(JSON.stringify(results)));
      }
    );
  });
}

function deleteCountry(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_country SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getCountry(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, country FROM lms_country WHERE id = ? AND active = ?";
    pool.query(sql, [id, ACTIVE], (error, results) => {
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

function getAllCountry() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, country FROM lms_country WHERE active = ?";
    pool.query(sql, [ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = {
  getCountry,
  getAllCountry,
};
