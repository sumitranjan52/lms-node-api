const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");

function createState(data) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO `lms_state` (`state`, `created`) VALUES ?";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateState(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_state SET state = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.state, data.modified.id, data.id, ACTIVE],
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

function deleteState(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_state SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getState(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, state FROM lms_state WHERE id = ? AND active = ?";
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

function getAllState() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, state FROM lms_state WHERE active = ?";
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
  createState,
  updateState,
  deleteState,
  getState,
  getAllState,
  fKeyCheck,
};
