const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const class_grplist = require("../beans/class_group_list");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    // const { error } = validate(req.body);
    // if (error)
    //   return res
    //     .status(400)
    //     .json(JSON.stringify({ lmsmsg: error.details[0].message }));

    // insert into db
    let formType = { ...req.body };
    formType.created = req.user;
    const insertId = class_grplist.createFormType(formType);
    console.log(formType);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });

    formType.id = insertId;

    // json final response
    return res.status(200).json(formType);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

// route.put("/:id", auth, async (req, res) => {
//   try {
//     // validate request
//     const id = req.params.id;
//     if (!id)
//       return res.status(400).json(
//         JSON.stringify({
//           lmsmsg: "Id is not provided. Please provide Id and try again.",
//         })
//       );

//     const { error } = validate(req.body);
//     if (error)
//       return res
//         .status(400)
//         .json(JSON.stringify({ lmsmsg: error.details[0].message }));

//     // insert into db
//     let formType = { ...req.body };
//     formType.id = id;
//     formType.modified = req.user;
//     const updated = await class_grplist.updateFormType(formType);
//     if (updated.affectedRows === 0)
//       return res.status(404).json(
//         JSON.stringify({
//           lmsmsg: "No record found.",
//         })
//       );

//     // json final response
//     return res
//       .status(200)
//       .json(JSON.stringify({ lmsmsg: "Record updated successfully" }));
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(
//       JSON.stringify({
//         lmsmsg: "Something went wrong. Please try again later.",
//       })
//     );
//   }
// });

route.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not provided. Please provide Id and try again.",
      });

    // Foreign key check

    const formType = await class_grplist.deleteFormType(id, req.user.id);
    if (formType.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // json final response
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
    const formTypes = await class_grplist.getAllFormType();
    if (!formTypes)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // json final response
    return res.status(200).json(formTypes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

// route.get("/:id", auth, async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!id)
//       return res.status(400).json(
//         JSON.stringify({
//           lmsmsg: "Id is not porovided. Please provide Id and try again.",
//         })
//       );

//     const formType = await formtype.getFormType(id);
//     if (!formType)
//       return res.status(404).json(
//         JSON.stringify({
//           lmsmsg: "No record found.",
//         })
//       );

//     // json final response
//     return res.status(200).json(JSON.stringify(formType));
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(
//       JSON.stringify({
//         lmsmsg: "Something went wrong. Please try again later.",
//       })
//     );
//   }
// });

function validate(reqData) {
  const schema = Joi.object({
    std: Joi.string()
      .min(3)
      .max(255)
      .pattern(/^[\w0-9 ]+$/, "required")
      .required(),
    // formFee: Joi.number().min(1).max(99999999).required(),
  });
  return schema.validate(reqData);
}

module.exports = route;
