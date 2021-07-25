const { pool, ACTIVE, INACTIVE } = require("../db");

function subjectFeePayment(data) {
    let ids = "";
    data.subjectList.forEach(element => {
        if(element.checked === true){
            ids += element.id + ",";
        }
    });
    let status = "";
    if(data.totalFee == (+data.paidFee)){
        status = "paid";
    }else{
        status = "unpaid";
    }
    console.log(ids + " " + status);
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_subjectFeePayment` (`studentId`, `subjectsId`, `paidAmount`, `status`, `modified`, `modified_on`) VALUES (?, ?, ?, ?, ?, now())";
    pool.query(
      sql,
      [
        data.studentId,
        ids,
        data.paidFee,
        status,
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

// function getsubjectFeePaymentForStudent(id) {
//   return new Promise((resolve, reject) => {
//     let sql = "SELECT subjectsId, paidAmount, status, modified, modified_on FROM `lms_subjectFeePayment` WHERE studentId = ? AND active = ?";
    
//     pool.query(sql, [id, ACTIVE], (error, results) => {
//       if (error) {
//         reject(error.message);
//         return;
//       }
//       resolve(JSON.parse(JSON.stringify(results)));
//     });
//   });
// }

// function getsubjectNames(ids){
    
//     return new Promise((resolve, reject) => {
//         let sql = "SELECT id, subject_name, class_id, theory_fee, practical_fee FROM lms_subject_fee WHERE id IN (?)";
        
//         pool.query(sql, [ids, ACTIVE], (error, results) => {
//           if (error) {
//             reject(error.message);
//             return;
//           }
//           resolve(JSON.parse(JSON.stringify(results)));
//         });
//       });
// }

function getsubjectFeePaymentForStudent(id) {
    return new Promise((resolve, reject) => {
      let finalOutput = [];
      const sql1 =
        "SELECT subjectsId, paidAmount, status, modified, modified_on FROM `lms_subjectFeePayment` WHERE studentId = ? AND active = ?";
      pool.query(sql1, [id, ACTIVE], (error, results) => {
        if (error) {
          reject(error.message);
          return;
        }
        let fResult = JSON.parse(JSON.stringify(results));
        if (fResult.length > 0) {
          fResult.forEach((element) => {
            const idsString = JSON.stringify(element.subjectsId);
            console.log(idsString);
            const ids = idsString.substring(1, idsString.length-2);
            console.log(ids);
            const sql2 =
            "SELECT id, subject_name, class_id, theory_fee, practical_fee FROM lms_subject_fee WHERE id IN ("+ ids +") AND active = ?";    
            pool.query(sql2, [ACTIVE], (err, res) => {
              if (err) {
                reject(err.message);
                return;
              }
              let sResult = JSON.parse(JSON.stringify(res));
              console.log(sResult);
              // element.subjectlist = sResult;
              let finalResult = { ...element };
              finalResult.subjectlist = sResult;
              finalOutput.push(finalResult);
              if (fResult.length === finalOutput.length) {
                  console.log('resolve ${finalOutput}');
                resolve(finalOutput);
              }
            });
          });
        //   console.log(fResult);
        //   resolve(fResult);
        } else {
          resolve(null);
        }
      });
    });
  }

module.exports = {
  subjectFeePayment,
  getsubjectFeePaymentForStudent
};
