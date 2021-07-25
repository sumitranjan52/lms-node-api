const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const branchDb = require("../beans/branch");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let branch = { ...req.body };
    branch.created = req.user;
    const insertId = await branchDb.createBranch(branch);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });

    branch.id = insertId;

    // send final response
    return res.status(200).json(branch);
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
    let branch = { ...req.body };
    branch.id = id;
    branch.modified = req.user;
    const updated = await branchDb.updateBranch(branch);
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
    let fKey = [...(await branchDb.fKeyCheck(id, "lms_student", "branch"))];
    console.log(fKey);
    if (fKey.length > 0) {
      return res.status(400).json({
        lmsmsg: "Can not delete used record",
      });
    }

    const deleted = await branchDb.deleteBranch(id, req.user.id);
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
    const branches = await branchDb.getAllBranch();
    if (!branches)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(branches);
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

    const branch = await branchDb.getBranch(id);
    if (!branch)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(branch);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    branch: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[\w ]+$/, "required")
      .required(),
    address: Joi.string()
      .min(3)
      .max(500)
      .pattern(/^[\w\d ,-\/]+$/, "required")
      .required(),
  });
  return schema.validate(reqData);
}

module.exports = route;
