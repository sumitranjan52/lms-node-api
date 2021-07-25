const { pool, ACTIVE, INACTIVE } = require("../db");

function createAdmission(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_student` (`ex_id`, `session_month`, `session_year`, `student_username`, `name`, `dob`, `father`, `mother`, `fmoccupation`, `sex`, `address`, `district`, `state`, `mobile`," +
      "`uid`, `phone`, `email`, `app_date`, `form_type`, `course_fee`, `branch`, `course_medium`, `ref_by`, `ref_to`, `isnios`, " +
      "`ai_centre`, `ref_no`, `enroll_no`, `std`, `school`, `toc`, `grp_subject`, `remark`, `prevQual`, `created`) VALUES (?)";
    pool.query(sql, [data], (error, results) => {
      if (error) {
        reject(error.sql + " # " + error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results.insertId)));
    });
  });
}

function updateAdmission(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_student SET name = ?, father = ?, mother = ?, fmoccupation = ?, sex = ?, address = ?, district = ?, state = ?, mobile = ?, " +
      "uid = ?, phone = ?, email = ?, form_type = ?, course_fee = ?, branch = ?, course_medium = ?, ref_by = ?, ref_to = ?, isnios = ?, " +
      "ai_centre = ?, ref_no = ?, enroll_no = ?, school = ?, toc = ?, grp_subject = ?, remark = ?, prevQual = ?, " +
      "modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ? AND `left` = ?";
    pool.query(sql, data, (error, results) => {
      if (error) {
        console.log("admission", error);
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function deleteAdmission(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_student SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function leftAdmission(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_student SET `left` = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [ACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getAdmission(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, student_username, name, dob, father, mother, fmoccupation, sex, address, mobile, " +
      "uid, phone, email, app_date, course_fee, course_medium, session_month, session_year, " +
      "ai_centre, ref_no, enroll_no, std, toc, grp_subject, remark, prevQual, " +
      "state, district, form_type, branch, ref_by, ref_to, school, isnios, ex_id " +
      "FROM lms_student WHERE `left` = ? AND active = ? AND id = ?";
    pool.query(sql, [INACTIVE, ACTIVE, id], (error, results) => {
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

function getAllAdmission() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, student_username, name, dob, father, mother, fmoccupation, sex, address, mobile, " +
      "uid, phone, email, app_date, course_fee, course_medium, session_month, school, " +
      "ai_centre, ref_no, enroll_no, std, toc, grp_subject, remark, prevQual, session_year, " +
      "state, district, form_type, branch, ref_by, ref_to, isnios, ex_id " +
      "FROM lms_student WHERE `left` = ? AND active = ?";
    pool.query(sql, [INACTIVE, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getAllLeftAdmission() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, student_username, name, dob, father, mother, fmoccupation, sex, address, mobile, " +
      "uid, phone, email, app_date, course_fee, course_medium, session_month, school, " +
      "ai_centre, ref_no, enroll_no, std, toc, grp_subject, remark, prevQual, session_year, " +
      "state, district, form_type, branch, ref_by, ref_to, isnios, ex_id " +
      "FROM lms_student WHERE `left` = ? AND active = ?";
    pool.query(sql, [ACTIVE, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = {
  createAdmission,
  updateAdmission,
  deleteAdmission,
  leftAdmission,
  getAdmission,
  getAllAdmission,
  getAllLeftAdmission,
};
