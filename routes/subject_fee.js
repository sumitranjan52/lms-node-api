const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const subtype = require("../beans/subject_fee");

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
    const insertId = await subtype.createSubject(formdata);
    if (!insertId)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Record creation failed. Please try again later.",
        })
      );

    // formdata.id = insertId;

    // send final response
    return res.status(200).send(JSON.stringify(insertId));
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

route.put("/:id", auth, async (req, res) => {
  try {
    // validate request
    const id = req.params.id;
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );

    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send(JSON.stringify({ lmsmsg: error.details[0].message }));

    // insert into db
    let formdata = { ...req.body };
    formdata.id = id;
    formdata.modified = req.user;
    const updated = await subtype.updateSubject(formdata);
    if (updated.affectedRows === 0)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );

    // send final response
    return res
      .status(200)
      .send(JSON.stringify({ lmsmsg: "Record updated successfully" }));
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );

    // Foreign key check

    const result = await subtype.deleteSubject(id, req.user.id);
    if (result.affectedRows === 0)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );

    // send final response
    return res
      .status(200)
      .send(JSON.stringify({ lmsmsg: "Record deleted successfully" }));
  } catch (err) {
    console.log(err);
    res.status(500).send(
      JSON.stringify({
        lmsmsg: "Something went wrong. Please try again later.",
      })
    );
  }
});

route.get("/", auth, async (req, res) => {
  try {
    const result = await subtype.getAllSubjectList();
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

// route.get("/:id", auth, async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!id)
//       return res.status(400).send(
//         JSON.stringify({
//           lmsmsg: "Id is not provided. Please provide Id and try again.",
//         })
//       );

//     const subtype = await subtype.getsubtype(id);
//     if (!subtype)
//       return res.status(404).send(
//         JSON.stringify({
//           lmsmsg: "No record found.",
//         })
//       );

//     // send final response
//     return res.status(200).send(JSON.stringify(subtype));
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(
//       JSON.stringify({
//         lmsmsg: "Something went wrong. Please try again later.",
//       })
//     );
//   }
// });

route.get("/getGrplist/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).send(
        JSON.stringify({
          lmsmsg: "Id is not provided. Please provide Id and try again.",
        })
      );

    const subt = await subtype.getGrplist(id);
    if (!subt)
      return res.status(404).send(
        JSON.stringify({
          lmsmsg: "No record found.",
        })
      );

    // send final response
    return res.status(200).send(JSON.stringify(subt));
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
    subjectName: Joi.string()
      .min(3)
      .max(255)
      .pattern(/^[\w0-9 ]+$/, "required")
      .required(),
    theoryFee: Joi.number().min(0).max(99999999).required(),
    practicalFee: Joi.number().min(0).max(99999999).required(),
    std: Joi.string().min(1).max(255).required(),
    group: Joi.number().min(1).max(99999999).required(),
  });
  return schema.validate(reqData);
}

module.exports = route;
