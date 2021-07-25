const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");

function createMedium(data) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO `lms_medium` (`medium`, `created`) VALUES (?, ?)";
    pool.query(sql, [data.medium, data.created.id], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateMedium(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_medium SET medium = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.medium, data.modified.id, data.id, ACTIVE],
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

function deleteMedium(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_medium SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getMedium(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, medium FROM lms_medium WHERE id = ? AND active = ?";
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

function getAllMedium() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, medium FROM lms_medium WHERE active = ?";
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
  createMedium,
  updateMedium,
  deleteMedium,
  getMedium,
  getAllMedium,
  fKeyCheck,
};
