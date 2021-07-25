const { pool, ACTIVE, INACTIVE } = require("../db");

function createStudentSubject(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_stu_sub` (`subject`, `total_fee`, `attempt_date`, `fee_deposited`, `ispass`, `created`, `for_student`) VALUES ?";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateStudentSubject(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_stu_sub SET `subject` = ?, `total_fee` = ?, `attempt_date` = ?, `fee_deposited` = ?, `ispass` = ?, `score` = ?, " +
      "modified = ?, modified_on = CURRENT_TIMESTAMP WHERE for_student = ? AND id = ? AND active = ?";
    pool.query(sql, data, (error, results) => {
      if (error) {
        console.log("tocu", error);
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function deleteStudentSubject(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_stu_sub SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getStudentSubject(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, subject, total_fee, attempt_date, fee_deposited, ispass, score FROM lms_stu_sub WHERE id = ? AND active = ?";
    pool.query(sql, [ACTIVE, id, ACTIVE], (error, results) => {
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

function getAllStudentSubject(studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, subject, total_fee, attempt_date, fee_deposited, ispass, score FROM lms_stu_sub WHERE active = ? AND for_student = ?";
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
  createStudentSubject,
  updateStudentSubject,
  deleteStudentSubject,
  getStudentSubject,
  getAllStudentSubject,
};
