const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error").errorHandler;

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, "User not authenticated"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden access"));
      }
      req.user = user;
      next();
    });
  },
};
