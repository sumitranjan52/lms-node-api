const { pool, ACTIVE, INACTIVE } = require("../db");

function createFormType(data) {
  return new Promise((resolve, reject) => {
    // { "std": "Secondary", "groupName": [ { "newGrpName": "gropA", "subLimit": "4402" } ] }
    const sql =
      "INSERT INTO `lms_grplist` (`class`, `group_name`, `sub_limit`, `created`) VALUES (?, ?, ?, ?)";
    const std = data["std"];
    var groupName = data["groupName"];
    const creatorId = data.created.id;
    console.log(data);
    groupName.forEach((element) => {
      pool.query(
        sql,
        [std, element.newGrpName, element.subLimit, creatorId],
        (error, results) => {
          if (error) {
            reject(error.message);
            return;
          }
          resolve(JSON.parse(JSON.stringify(results.insertId)));
        }
      );
    });
  });
}

function deleteFormType(id, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE lms_grplist SET active = ?, modified = ?, modified_on = CURRENT_TIMESTAMP WHERE class = ? AND active = ?";
    pool.query(sql, [INACTIVE, userId, id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
}

function getAllFormType() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT gl.id, gl.class, gl.group_name, gl.sub_limit, gl.created FROM lms_grplist gl WHERE gl.active = ?";
    pool.query(sql, [ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      let finalArrray = [];
      let clsA = [];
      let child = [];
      let className = [];
      results.forEach((el) => {
        //console.log(el);
        if (!clsA.includes(el["class"])) {
          clsA.push(el.class);
          className.push(el.class_name);
          child.push(el.group_name + "(" + el.sub_limit + ")");
        } else {
          let index = clsA.indexOf(el.class);
          child[index] += "," + el.group_name + "(" + el.sub_limit + ")";
        }
      });
      console.log(clsA);
      console.log(child);
      clsA.forEach((el, index) => {
        let gl = {};
        gl.class = el;
        gl.groupName = child[index];
        gl.className = className[index];
        finalArrray.push(gl);
      });
      console.log("---------------------------");
      console.log(JSON.parse(JSON.stringify(finalArrray)));
      resolve(JSON.parse(JSON.stringify(finalArrray)));
    });
  });
}

module.exports = {
  createFormType,
  deleteFormType,
  getAllFormType,
};

// testing data
// INSERT INTO `lms_class` (`class_name`, `quaterly_fee`, `monthly_fee`, `created`, `created_on`)
// VALUES ('Secondary', 1500 , 500, 1, NOW());
// INSERT INTO `lms_class` (`class_name`, `quaterly_fee`, `monthly_fee`, `created`, `created_on`)
// VALUES ('Senior Secondary', 1500 , 500, 1, NOW());
