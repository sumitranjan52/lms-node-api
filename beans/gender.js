const { pool, ACTIVE, INACTIVE } = require("../db");

function createGender(data) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO `lms_gender` (`gender`, `created`) VALUES (?, ?)";
    pool.query(sql, [data.gender, data.created.id], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateGender(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_gender SET gender = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.gender, data.modified.id, data.id, ACTIVE],
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

function deleteGender(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_gender SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getGender(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, gender FROM lms_gender WHERE id = ? AND active = ?";
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

function getAllGender() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, gender FROM lms_gender WHERE active = ?";
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
  createGender,
  updateGender,
  deleteGender,
  getGender,
  getAllGender,
};
