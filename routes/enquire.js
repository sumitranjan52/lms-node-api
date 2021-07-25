const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const enquireDb = require("../beans/enquire");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let insert = { ...req.body };
    insert.user = req.user;
    const insertId = await enquireDb.createEnquire(insert);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });

    // send final response
    return res.status(200).json({
      lmsmsg: "Record(s) added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/:type", auth, async (req, res) => {
  try {
    const type = req.params.type;
    if (!type)
      return res.status(400).json({
        lmsmsg: "Id is not provided. Please provide Id and try again.",
      });

    const district = await enquireDb.enquireList(type);
    if (!district)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(district);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    name:      Joi.string()
                  .min(3)
                  .max(20).required()
                  .pattern(/^[\w. ]+$/),
    contact:    Joi.number().integer().required(),
    courseType: Joi.string().min(1).max(20).required().pattern(/^[\w. ]+$/),
    remark: Joi.string().min(0).max(250).required().pattern(/^[\w. ]+$/)
  });
  return schema.validate(reqData);
} 

module.exports = route;
