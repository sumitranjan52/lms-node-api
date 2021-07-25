const { pool, ACTIVE, INACTIVE } = require("../db");

function createSubject(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_subject_fee` (`subject_name`, `class_id`, `group_id`, `theory_fee`, `practical_fee`, `created`) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      sql,
      [
        data.subjectName,
        data.std,
        data.group,
        data.theoryFee,
        data.practicalFee,
        data.created.id,
      ],
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

function updateSubject(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_subject_fee SET subject_name = ?, class_id = ?, group_id = ?, theory_fee = ?, practical_fee = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(
      sql,
      [
        data.subjectName,
        data.std,
        data.group,
        data.theoryFee,
        data.practicalFee,
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

function deleteSubject(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_subject_fee SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE id = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getAllSubjectList(input = undefined) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT  sf.id, sf.subject_name AS subjectName, sf.class_id, sf.group_id, sf.theory_fee AS theoryFee, 
      sf.practical_fee AS practicalFee, grp.group_name AS groupName 
      FROM lms_subject_fee sf JOIN lms_grplist grp 
      WHERE sf.group_id = grp.id AND sf.active = ? AND grp.active = ?`;
    if (input) {
      sql += ` AND sf.id IN (${input})`;
    }
    pool.query(sql, [ACTIVE, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getGrplist(id) {
  console.log(id);
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, group_name, sub_limit FROM lms_grplist WHERE class = ? AND active = ? ";
    pool.query(sql, [id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      console.log(results);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

module.exports = {
  createSubject,
  updateSubject,
  deleteSubject,
  getAllSubjectList,
  getGrplist,
};
