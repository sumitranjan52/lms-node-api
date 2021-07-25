const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const standard = require("../beans/standard");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let cls = { ...req.body };
    cls.created = req.user;
    const insertId = await standard.createStandard(cls);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });

    cls.id = insertId;

    // send final response
    return res.status(200).json(cls);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.put("/:id", auth, async (req, res) => {
  try {
    // validate request
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let cls = { ...req.body };
    cls.id = id;
    cls.modified = req.user;
    const updated = await standard.updateStandard(cls);
    if (updated.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    // Foreign key check

    const deleted = await standard.deleteStandard(id, req.user.id);
    if (deleted.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/", auth, async (req, res) => {
  try {
    const classes = await standard.getAllStandard();
    if (!classes)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(classes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    const cls = await standard.getStandard(id);
    if (!cls)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(cls);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    className: Joi.string()
      .min(3)
      .max(255)
      .pattern(/^[\w\d \(\)]+$/, "required")
      .required(),
    monthlyFee: Joi.number().min(0).max(99999999),
    quaterlyFee: Joi.number().min(0).max(99999999),
  });
  return schema.validate(reqData);
}

module.exports = route;
