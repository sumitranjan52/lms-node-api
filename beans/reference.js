const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");

function createReference(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_reference` (`reference`, `created`) VALUES (?, ?)";
    pool.query(sql, [data.reference, data.created.id], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateReference(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_reference SET reference = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.reference, data.modified.id, data.id, ACTIVE],
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

function deleteReference(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_reference SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getReference(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, reference FROM lms_reference WHERE id = ? AND active = ?";
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

function getAllReference() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, reference FROM lms_reference WHERE active = ?";
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
  createReference,
  updateReference,
  deleteReference,
  getReference,
  getAllReference,
  fKeyCheck,
};
