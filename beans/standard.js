const { pool, ACTIVE, INACTIVE } = require("../db");

function createStandard(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_class` (`class_name`, `quaterly_fee`, `monthly_fee`, `created`) VALUES (?, ?, ?, ?)";
    pool.query(
      sql,
      [data.className, data.quaterlyFee, data.monthlyFee, data.created.id],
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

function updateStandard(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_class SET class_name = ?, quaterly_fee = ?, monthly_fee = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [
        data.className,
        data.quaterlyFee,
        data.monthlyFee,
        data.modified.id,
        data.id,
        ACTIVE,
      ],
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

function deleteStandard(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_class SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getStandard(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, class_name, quaterly_fee, monthly_fee FROM lms_class WHERE id = ? AND active = ?";
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

function getAllStandard() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, class_name, quaterly_fee, monthly_fee FROM lms_class WHERE active = ?";
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
  createStandard,
  updateStandard,
  deleteStandard,
  getStandard,
  getAllStandard,
};
