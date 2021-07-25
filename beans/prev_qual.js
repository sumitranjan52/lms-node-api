const { pool, ACTIVE, INACTIVE } = require("../db");

function createPrevQual(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_prev_qual` (`qualification`, `board`, `rollNo`, `year`, `created`, `for_student`) VALUES ?";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        console.log("prei", error);
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updatePrevQual(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_prev_qual SET qualification = ?, board = ?, rollNo = ?, year = ?, " +
      "modified = ?, modified_on = CURRENT_TIMESTAMP WHERE for_student = ? AND id = ? AND active = ?";
    pool.query(sql, data, (error, results) => {
      if (error) {
        console.log("preu", error);
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function deletePrevQual(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_prev_qual SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getPrevQual(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, qualification, board, rollNo, year FROM lms_prev_qual WHERE id = ? AND active = ?";
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

function getAllPrevQual(studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, qualification, board, rollNo, year FROM lms_prev_qual WHERE active = ? AND for_student = ?";
    pool.query(sql, [ACTIVE, studentId], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = {
  createPrevQual,
  updatePrevQual,
  deletePrevQual,
  getPrevQual,
  getAllPrevQual,
};
