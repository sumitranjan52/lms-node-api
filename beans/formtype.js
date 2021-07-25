const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");

function createFormType(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_form_type` (`form_type`, `form_fee`, `created`) VALUES (?, ?, ?)";
    pool.query(
      sql,
      [data.formType, data.formFee, data.created.id],
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

function updateFormType(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_form_type SET form_type = ?, form_fee = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [data.formType, data.formFee, data.modified.id, data.id, ACTIVE],
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

function deleteFormType(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_form_type SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getFormType(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, form_type, form_fee FROM lms_form_type WHERE id = ? AND active = ?";
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

function getAllFormType() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, form_type, form_fee FROM lms_form_type WHERE active = ?";
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
  createFormType,
  updateFormType,
  deleteFormType,
  getFormType,
  getAllFormType,
  fKeyCheck,
};
