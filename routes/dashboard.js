const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const dashboardDb = require("../beans/dashboard");

route.get("/r/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg:
          "Module name is not porovided. Please provide module name and try again.",
      });

    let perm = "S";
    if (req.user.admin) perm = "A";
    else if (req.user.teacher) perm = "T";
    else perm = "S";

    let response = {};
    response["routes"] = await dashboardDb.getRoutes(id, perm);

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/s/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg:
          "Module name is not porovided. Please provide module name and try again.",
      });

    let perm = "S";
    if (req.user.admin) perm = "A";
    else if (req.user.teacher) perm = "T";
    else perm = "S";

    let response = {};
    response["dashboard"] = await dashboardDb.getSummary(id, perm);

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

module.exports = route;
