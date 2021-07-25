const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const subtype = require("../beans/subjectFeePayment");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send(JSON.stringify({ lmsmsg: error.details[0].message }));

    // insert into db
    let formdata = { ...req.body };
    formdata.created = req.user;
    const insertId = await subtype.subjectFeePayment(formdata);
    if (!insertId)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Record creation failed. Please try again later.",
        })
      );

    return res.status(200).send({ lmsmsg: "Record updated successfully" });
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
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );
    const result = await subtype.getsubjectFeePaymentForStudent(id);
    if (!result)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );
    // const resultJson = JSON.stringify(result);
    // console.log(resultJson);
    // let idsStrings =  JSON.stringify(resultJson.subjectsId);
    // console.log(idsStrings);
    // const arraySub = [];
    // result.forEach( async(element) => {
    //     const idsString = JSON.stringify(element.subjectsId);
    //     console.log(idsString);
    //     const ids = idsString.substring(0, idsString.length-1);
    //     console.log(ids);
    //     const result2 = await subtype.getsubjectNames(ids);
    //     arraySub.push(result2);
    // });
    // console.log(arraySub);
    // resultJson.subjects = arraySub;
    // send final response
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

function validate(reqData) {
  const schema = Joi.object({
    studentId: Joi.number()
      .min(1)
      .max(255)
      .required(),
    paidFee: Joi.number().min(0).max(99999999).required(),
    totalFee: Joi.number().min(0).max(99999999).required(),
    subjectList: Joi.array().items(
        Joi.object({
          id: Joi.number().min(1).max(999999999).required(),
          value: Joi.number().min(1).max(99999999).required(),
          name: Joi.string()
            .min(3)
            .max(255)
            .pattern(/^[\w. ]+$/, "required"),
         checked: Joi.boolean().required(),
        })
      )
  });
  return schema.validate(reqData);
}

module.exports = route;
