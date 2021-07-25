const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const stateDb = require("../beans/state");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let state = { ...req.body };
    console.log(state);
    let data = state.state.map((st) => {
      return [st, req.user.id];
    });
    console.log("state", data);
    const insertId = await stateDb.createState(data);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });

    state.id = insertId;

    // send final response
    return res.status(200).json(state);
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
    let state = { ...req.body };
    console.log(state);
    state.id = id;
    state.modified = req.user;
    const updated = await stateDb.updateState(state);
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
    let fKey = [
      ...(await stateDb.fKeyCheck(id, "lms_district", "state")),
      ...(await stateDb.fKeyCheck(id, "lms_student", "state")),
    ];
    console.log(fKey);
    if (fKey.length > 0) {
      return res.status(400).json({
        lmsmsg: "Can not delete used record",
      });
    }

    const deleted = await stateDb.deleteState(id, req.user.id);
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
    const states = await stateDb.getAllState();
    if (!states)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(states);
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

    const state = await stateDb.getState(id);
    if (!state)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(state);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    // state: Joi.string()
    //   .min(3)
    //   .max(255)
    //   .pattern(/^[\w ]+$/, "required")
    //   .required(),
    state: Joi.array()
      .items(
        Joi.string()
          .min(3)
          .max(255)
          .pattern(/^[\w. ]+$/, "required")
          .required()
      )
      .required(),
  });
  return schema.validate(reqData);
}

module.exports = route;
