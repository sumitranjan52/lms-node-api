const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const countryDb = require("../beans/country");

route.post("/", auth, async (req, res) => {
  res.status(400).json({
    lmsmsg: "Invalid request",
  });

  // try {
  //   // validate request
  //   const { error } = validate(req.body);
  //   if (error)
  //     return res
  //       .status(400)
  //       .json({ lmsmsg: error.details[0].message });

  //   // insert into db
  //   let medium = { ...req.body };
  //   medium.created = req.user;
  //   const insertId = await countryDb.createMedium(medium);
  //   if (!insertId)
  //     return res.status(400).json(
  //       {
  //         lmsmsg: "Record creation failed. Please try again later.",
  //       }
  //     );

  //   medium.id = insertId;

  //   // send final response
  //   return res.status(200).json(medium);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(
  //     {
  //       lmsmsg: "Something went wrong. Please try again later.",
  //     }
  //   );
  // }
});

route.put("/:id", auth, async (req, res) => {
  res.status(400).json({
    lmsmsg: "Invalid request",
  });
  // try {
  //   // validate request
  //   const id = req.params.id;
  //   if (!id)
  //     return res.status(400).json(
  //       {
  //         lmsmsg: "Id is not porovided. Please provide Id and try again.",
  //       }
  //     );

  //   const { error } = validate(req.body);
  //   if (error)
  //     return res
  //       .status(400)
  //       .json({ lmsmsg: error.details[0].message });

  //   // insert into db
  //   let medium = { ...req.body };
  //   medium.id = id;
  //   medium.modified = req.user;
  //   const updated = await countryDb.updateMedium(medium);
  //   if (updated.affectedRows === 0)
  //     return res.status(404).json(
  //       {
  //         lmsmsg: "No record found.",
  //       }
  //     );

  //   // send final response
  //   return res
  //     .status(200)
  //     .json({ lmsmsg: "Record updated successfully" });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(
  //     {
  //       lmsmsg: "Something went wrong. Please try again later.",
  //     }
  //   );
  // }
});

route.delete("/:id", auth, async (req, res) => {
  res.status(400).json({
    lmsmsg: "Invalid request",
  });
  // try {
  //   const id = req.params.id;
  //   if (!id)
  //     return res.status(400).json(
  //       {
  //         lmsmsg: "Id is not porovided. Please provide Id and try again.",
  //       }
  //     );

  //   // Foreign key check

  //   const deleted = await countryDb.deleteMedium(id, req.user.id);
  //   if (deleted.affectedRows === 0)
  //     return res.status(404).json(
  //       {
  //         lmsmsg: "No record found.",
  //       }
  //     );

  //   // send final response
  //   return res
  //     .status(200)
  //     .json({ lmsmsg: "Record deleted successfully" });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(
  //     {
  //       lmsmsg: "Something went wrong. Please try again later.",
  //     }
  //   );
  // }
});

route.get("/", auth, async (req, res) => {
  try {
    const countries = await countryDb.getAllCountry();
    if (!countries)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(countries);
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

    const country = await countryDb.getCountry(id);
    if (!country)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(country);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

// function validate(reqData) {
//   const schema = Joi.object({
//     country: Joi.string()
//       .min(1)
//       .max(255)
//       .pattern(/^[\w. ]+$/, "required")
//       .required(),
//   });
//   return schema.validate(reqData);
// }

module.exports = route;
