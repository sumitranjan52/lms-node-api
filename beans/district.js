const { pool, ACTIVE, INACTIVE, fKeyCheck } = require("../db");
const mysql = require("mysql");

function createDistrict(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_district` (`state`, `district`, `created`) VALUES ?";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function updateDistrict(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_district SET state = ?, district = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?;";
    let multipleStmt = "";
    data.districts.forEach((value) => {
      multipleStmt += mysql.format(sql, [
        value.stateId,
        value.district,
        data.modified.id,
        value.id,
        1,
      ]);
    });
    pool.query(multipleStmt, (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function deleteDistrict(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_district SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function deleteDistrictByState(stateId, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_district SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE state = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, stateId, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getDistrict(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT d.id, s.id as state_id, s.state, d.district FROM lms_district d LEFT JOIN lms_state s ON s.id = d.state AND s.active = ? WHERE d.id = ? AND d.active = ?";
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

function getAllDistrict() {
  return new Promise((resolve, reject) => {
    let finalOutput = [];
    const sql1 =
      "SELECT s.id as state_id, s.state FROM lms_district d LEFT JOIN lms_state s ON s.id = d.state AND s.active = ? AND d.active = ? GROUP BY s.state";
    const sql2 =
      "SELECT id, district FROM lms_district WHERE state = ? AND active = ?";
    pool.query(sql1, [ACTIVE, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      let fResult = JSON.parse(JSON.stringify(results));
      if (fResult.length > 0) {
        fResult.forEach((ste) => {
          pool.query(sql2, [ste.state_id, ACTIVE], (err, res) => {
            if (err) {
              reject(err.message);
              return;
            }
            let sResult = JSON.parse(JSON.stringify(res));
            let finalResult = { ...ste };
            finalResult.districts = sResult;
            finalOutput.push(finalResult);
            if (fResult.length === finalOutput.length) {
              resolve(finalOutput);
            }
          });
        });
      } else {
        resolve(fResult);
      }
    });
  });
}

module.exports = {
  createDistrict,
  updateDistrict,
  deleteDistrict,
  deleteDistrictByState,
  getDistrict,
  getAllDistrict,
  fKeyCheck,
};
