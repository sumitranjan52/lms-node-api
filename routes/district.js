const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const districtDb = require("../beans/district");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let district = { ...req.body };
    let insert = [];
    district.districts.forEach((value) => {
      let data = [district.state, value, req.user.id];
      insert.push(data);
    });
    const insertId = await districtDb.createDistrict(insert);
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

route.put("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validateUpdate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let district = { ...req.body };
    district.modified = req.user;
    const updated = await districtDb.updateDistrict(district);
    if (!updated)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record(s) updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/:id", auth, (req, res) => {
  deleteMethod(req, res);
});

route.delete("/s/:id", auth, (req, res) => {
  deleteMethod(req, res, true);
});

async function deleteMethod(req, res, state = false) {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    let deleted;
    if (state) {
      // Foreign key check
      let fKey = [...(await districtDb.fKeyCheck(id, "lms_student", "state"))];
      console.log(fKey);
      if (fKey.length > 0) {
        return res.status(400).json({
          lmsmsg: "Can not delete used record",
        });
      }

      deleted = await districtDb.deleteDistrictByState(id, req.user.id);
    } else {
      // Foreign key check
      let fKey = [
        ...(await districtDb.fKeyCheck(id, "lms_student", "district")),
      ];
      console.log(fKey);
      if (fKey.length > 0) {
        return res.status(400).json({
          lmsmsg: "Can not delete used record",
        });
      }

      deleted = await districtDb.deleteDistrict(id, req.user.id);
    }
    if (deleted.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record(s) deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
}

route.get("/", auth, async (req, res) => {
  try {
    const districts = await districtDb.getAllDistrict();
    if (!districts)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(districts);
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

    const district = await districtDb.getDistrict(id);
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
    state: Joi.number().min(1).max(99999999999999999999).required(),
    districts: Joi.array()
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

function validateUpdate(reqData) {
  const schema = Joi.object({
    districts: Joi.array().items(
      Joi.object({
        id: Joi.number().min(1).max(99999999999999999999).required(),
        stateId: Joi.number().min(1).max(99999999999999999999).required(),
        state: Joi.string()
          .min(3)
          .max(255)
          .pattern(/^[\w. ]+$/, "required"),
        district: Joi.string()
          .min(3)
          .max(255)
          .pattern(/^[\w. ]+$/, "required")
          .required(),
      })
    ),
  });
  return schema.validate(reqData);
}

module.exports = route;
