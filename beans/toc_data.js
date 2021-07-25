const { pool, ACTIVE, INACTIVE } = require("../db");

function createTocData(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_toc_data` (`subject`, `theory`, `practical`, `created`, `for_student`) VALUES ?";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        console.log("toci", error);
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateTocData(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_toc_data SET subject = ?, theory = ?, practical = ?, " +
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

function deleteTocData(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_toc_data SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getTocData(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, subject, theory, practical FROM lms_toc_data WHERE id = ? AND active = ?";
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

function getAllTocData(studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, subject, theory, practical FROM lms_toc_data WHERE active = ? AND for_student = ?";
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
  createTocData,
  updateTocData,
  deleteTocData,
  getTocData,
  getAllTocData,
};
