const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const route = express.Router();
const user = require("../beans/user");
const auth = require("../middleware/auth");

route.post("/login", async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // fetch user from db
    const userData = await user.fetchUserByUsername(req.body.username);
    if (!userData)
      return res.status(400).json({ lmsmsg: "Invalid username or password" });

    // check password for validity
    const valid = await bcrypt.compare(req.body.password, userData.password);
    if (!valid)
      return res.status(400).json({ lmsmsg: "Invalid username or password" });

    // create jwt token
    delete userData["password"];
    const token = jwt.sign(userData, config.get("secret_key"), {
      expiresIn: 1800,
    });

    // attach to header and send response with auth true
    res.header("x-auth-token", token).status(200).json({ lmsmsg: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.post("/change-password", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validatePassword(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // fetch user from db
    const userData = await user.fetchUserByUsername(req.user.username);
    if (!userData)
      return res.status(400).json({ lmsmsg: "Logged in user is invalid" });

    // check password for validity
    const valid = await bcrypt.compare(req.body.oldPassword, userData.password);
    if (!valid)
      return res.status(400).json({ lmsmsg: "Old Password is invalid" });

    // update password
    let data = [
      await bcrypt.hash(req.body.password, 10),
      req.user.username,
      req.user.id,
      user.ACTIVE,
    ];
    const updated = await user.updatePassword(data);
    if (updated.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // attach to header and send response with auth true
    res.status(200).json({ lmsmsg: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(255)
      .pattern(/^[\w0-9]+/, "required")
      .required(),
    password: Joi.string().required(),
  });
  return schema.validate(reqData);
}

function validatePassword(reqData) {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(reqData);
}

module.exports = route;
