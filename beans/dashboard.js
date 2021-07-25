const { pool, ACTIVE } = require("../db");

function getRoutes(module, perm) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT `icon`, `url`, `url_name` FROM lms_route WHERE module = ? AND active = ? AND permission = ?";
    pool.query(sql, [module, ACTIVE, perm], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getSummary(module, perm) {
  return new Promise((resolve, reject) => {
    let sql = "";
    let data = [];
    if (module == "setup") {
      sql =
        "SELECT (SELECT count(*) FROM lms_medium WHERE active = ?) AS total_medium," +
        "(SELECT count(*) FROM lms_branch WHERE active = ?) AS total_branch," +
        "(SELECT count(*) FROM lms_state WHERE active = ?) AS total_state," +
        "(SELECT count(*) FROM lms_district WHERE active = ?) AS total_district," +
        "(SELECT count(*) FROM lms_reference WHERE active = ?) AS total_partner FROM DUAL";
      data = [ACTIVE, ACTIVE, ACTIVE, ACTIVE, ACTIVE];
    } else if (module == "nios") {
      sql =
        "SELECT (SELECT count(*) FROM lms_student WHERE active = ?) AS total_student," +
        "(SELECT count(*) FROM lms_student WHERE active = ? AND `left` = ?) AS left_student FROM DUAL";
      data = [ACTIVE, ACTIVE, ACTIVE];
    } else {
      sql =
        "SELECT (SELECT count(*) FROM lms_medium WHERE active = ?) AS total_medium," +
        "(SELECT count(*) FROM lms_branch WHERE active = ?) AS total_branch," +
        "(SELECT count(*) FROM lms_state WHERE active = ?) AS total_state," +
        "(SELECT count(*) FROM lms_district WHERE active = ?) AS total_district," +
        "(SELECT count(*) FROM lms_reference WHERE active = ?) AS total_partner," +
        "(SELECT count(*) FROM lms_student WHERE active = ?) AS total_student," +
        "(SELECT count(*) FROM lms_student WHERE active = ? AND `left` = ?) AS left_student FROM DUAL";
      data = [ACTIVE, ACTIVE, ACTIVE, ACTIVE, ACTIVE, ACTIVE, ACTIVE, ACTIVE];
    }
    pool.query(sql, data, (error, results) => {
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

module.exports = {
  getRoutes,
  getSummary,
};
