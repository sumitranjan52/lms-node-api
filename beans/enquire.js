const {pool, ACTIVE, INACTIVE} = require("../db");
const mysql = require("mysql");

function createEnquire(enquireForm) {
    console.log(enquireForm);
    return new Promise((resolve, reject) => {
        const sql =
      "INSERT INTO `lms_enquire` (`name`, `contact`, `courseType`, `remark`, `modified`, `modified_on`) VALUES (?,?,?,?,?,now())";
    pool.query(sql, [enquireForm.name, enquireForm.contact, enquireForm.courseType, enquireForm.remark, enquireForm.user.id], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(results)));
    });
    });
}

function enquireList(type) {
    console.log(type);
    return new Promise((resolve, reject)=>{
        const sql = "select * from `lms_enquire` where courseType = ?";

        pool.query(sql, type,(error, results)=>{
            if(error){
                reject(error.message);
                return;
            }
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
}

module.exports = {
    createEnquire,
    enquireList
}