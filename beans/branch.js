const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");

function createBranch(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_branch` (`branch`, `address`, `created`) VALUES (?, ?, ?)";
    pool.query(
      sql,
      [data.branch, data.address, data.created.id],
      (error, results) => {
        if (error) {
          reject(error.message);
          return;
        }
        resolve(JSON.parse(JSON.stringify(results.insertId)));
      }
    );
  });
}

function updateBranch(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_branch SET branch = ?, address = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.branch, data.address, data.modified.id, data.id, ACTIVE],
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

function deleteBranch(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_branch SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getBranch(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, branch, address FROM lms_branch WHERE id = ? AND active = ?";
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

function getAllBranch() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, branch, address FROM lms_branch WHERE active = ?";
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
  createBranch,
  updateBranch,
  deleteBranch,
  getBranch,
  getAllBranch,
  fKeyCheck,
};
