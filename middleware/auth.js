const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  let token = req.header("Authorization");

  if (!token)
    return res.status(401).json({
      lmsmsg: "Access Denied. No token provided",
    });

  try {
    if (token.includes("Bearer ", 0)) {
      token = token.substr(7);
    }
    const decoded = jwt.verify(token, config.get("secret_key"), {
      ignoreExpiration: true,
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      lmsmsg: "Access Denied. Invalid authentication key",
    });
  }
};
