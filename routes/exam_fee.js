const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const subtype = require("../beans/exam_fee");

route.post("/", auth, async (req, res) => {
  try {
    let formdata = { ...req.body };
    // validate request

    if(formdata.paymentMode == "Cash"){
      const { error } = validateCash(req.body);
      if (error)
      return res
        .status(400)
        .send(JSON.stringify({ lmsmsg: error.details[0].message }));
    }else if(formdata.paymentMode == "Cheque"){
      const { error } = validateCheque(req.body);
      if (error)
      return res
        .status(400)
        .send(JSON.stringify({ lmsmsg: error.details[0].message }));
    }else{
      const { error } = validateUPI(req.body);
      if (error)
      return res
        .status(400)
        .send(JSON.stringify({ lmsmsg: error.details[0].message }));
    }

    // insert into db
    formdata.created = req.user;
    
    if(formdata.paymentMode == "Cash"){
      const insertId = await subtype.payExamFeeCash(formdata);
      if (!insertId)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Record creation failed. Please try again later.",
        })
      );

          // formdata.id = insertId;

    // send final response
    return res.status(200).send(JSON.stringify(insertId));
    }else if(formdata.paymentMode == "Cheque"){
      const insertId = await subtype.payExamFeeCheque(formdata);
      if (!insertId)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Record creation failed. Please try again later.",
        })
      );

          // formdata.id = insertId;

    // send final response
    return res.status(200).send(JSON.stringify(insertId));
    }else{
      const insertId = await subtype.payExamFeeUPI(formdata);
      if (!insertId)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Record creation failed. Please try again later.",
        })
      );

          // formdata.id = insertId;

    // send final response
    return res.status(200).send(JSON.stringify(insertId));
    }
    

  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

route.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );

    const result = await subtype.getRemainingExamFee(id);
    if (!result)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );

    // send final response
    return res.status(200).send(JSON.stringify(result));
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

route.get("/pay/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );

    const result = await subtype.getFeePaid(id);
    if (!result)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );

    // send final response
    return res.status(200).send(JSON.stringify(result));
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});


function validateCash(reqData) {
  const schema = Joi.object({
    studentId: Joi.number()
      .min(1)
      .max(255)
      .required(),
    paymentMode: Joi.string().valid("Cash", "Cheque", "UPI"),
    amount: Joi.number().required(),
    penaltyAmount: Joi.number().required(),
    month: Joi.string().required(),
    remark: Joi.string().allow(""),
    paymentDetails: Joi.array()
      .items(
        Joi.object({
          date : Joi.date().required()
        })
      )
  });
  return schema.validate(reqData);
}

function validateCheque(reqData) {
  const schema = Joi.object({
    studentId: Joi.number()
      .min(1)
      .max(255)
      .required(),
    paymentMode: Joi.string().valid("Cash", "Cheque", "UPI"),
    amount: Joi.number().required(),
    penaltyAmount: Joi.number().required(),
    month: Joi.string().required(),
    remark: Joi.string().allow(""),
    paymentDetails: Joi.array()
      .items(
        Joi.object({
          payeeName : Joi.string().pattern(/^[\w0-9 ]+$/).required(),
          bankName : Joi.string().pattern(/^[\w0-9 ]+$/).required(),
          chequeNumber : Joi.string().required(),
          chequeDate : Joi.date().required()
        })
      )
  });
  return schema.validate(reqData);
}

function validateUPI(reqData) {
  const schema = Joi.object({
    studentId: Joi.number()
      .min(1)
      .max(255)
      .required(),
    paymentMode: Joi.string().valid("Cash", "Cheque", "UPI"),
    amount: Joi.number().required(),
    penaltyAmount: Joi.number().required(),
    month: Joi.string().required(),
    remark: Joi.string().allow(""),
    paymentDetails: Joi.array()
      .items(
        Joi.object({
          transactionId : Joi.string().min(0).max(99999999).required(),
          date : Joi.date().required()
        })
      )
  });
  return schema.validate(reqData);
}

module.exports = route;
