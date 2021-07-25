const { pool, ACTIVE, INACTIVE } = require("../db");
const utils = require("../utils");

function payExamFeeCash(data) {
  console.log(data.paymentDetails[0].date);
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_exam_fee` (`student_id`, `payment_type`, `deposit_date`, `fee_deposited`, `penalty`, `month`, `remarks`, `modified`, `modified_on`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now())";
    pool.query(
      sql,
      [
        data.studentId,
        data.paymentMode,
        utils.getSqlDate(data.paymentDetails[0].date),
        data.amount == "" ? 0 : data.amount,
        utils.emptyToNull(
          data.penaltyAmount == (undefined || null || "")
            ? "0"
            : data.penaltyAmount
        ),
        data.month,
        data.remark,
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

function payExamFeeCheque(data) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_exam_fee` (`student_id`, `payment_type`, `cheque_name`, `bank_name`, `cheque_number`, `deposit_date`, `fee_deposited`, `penalty`, `month`, `remarks`, `modified`, `modified_on`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())";
    pool.query(
      sql,
      [
        data.studentId,
        data.paymentMode,
        data.paymentDetails[0].payeeName,
        data.paymentDetails[0].bankName,
        data.paymentDetails[0].chequeNumber,
        utils.getSqlDate(data.paymentDetails[0].chequeDate),
        data.amount == "" ? 0 : data.amount,
        data.penaltyAmount == (null || "") ? 0 : data.penaltyAmount,
        data.month,
        data.remark,
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

function payExamFeeUPI(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO `lms_exam_fee` (`student_id`, `payment_type`, `deposit_date`, `transaction_number`, `fee_deposited`, `penalty`, `month`, `remarks`, `modified`, `modified_on`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())";
    pool.query(
      sql,
      [
        data.studentId,
        data.paymentMode,
        utils.getSqlDate(data.paymentDetails[0].date),
        data.paymentDetails[0].transactionId,
        data.amount == "" ? 0 : data.amount,
        data.penaltyAmount == (null || "") ? 0 : data.penaltyAmount,
        data.month,
        data.remark,
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

function getRemainingExamFee(id) {
  console.log(id);
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT fee_deposited FROM lms_exam_fee WHERE student_id = ? AND active = ?";
    pool.query(sql, [id, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return JSON.parse(JSON.stringify({ fee: 0 }));
      }
      console.log(results);
      let output = JSON.parse(JSON.stringify(results));
      let val = 0;
      output.forEach((element) => {
        val += element.fee_deposited;
      });

      resolve(JSON.parse(JSON.stringify({ fee: val })));
    });
  });
}

function getFeePaid(studentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, payment_type, fee_deposited, penalty, bank_name, cheque_number, cheque_name, transaction_number, " +
      "deposit_date, month, remarks FROM lms_exam_fee WHERE student_id = ? AND active = ?";
    pool.query(sql, [studentId, ACTIVE], (error, results) => {
      if (error) {
        reject(error.message);
        return;
      }

      let jsonData = JSON.parse(JSON.stringify(results));
      if (jsonData[0]) {
        let totalFee = 0;
        jsonData.forEach((val) => {
          totalFee += val.fee_deposited;
        });
        jsonData[0]["total_fee_deposit"] = totalFee;
      }

      resolve(jsonData);
    });
  });
}

module.exports = {
  payExamFeeCash,
  payExamFeeCheque,
  payExamFeeUPI,
  getRemainingExamFee,
  getFeePaid,
};
