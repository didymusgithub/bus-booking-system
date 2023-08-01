const jwt = require("jsonwebtoken");

// this middle wear is to help decode our authenticated token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.send({
        message: "Auth failed",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return res.send({
        message : "Auth failed",
        success: false,
    });
  }
};
