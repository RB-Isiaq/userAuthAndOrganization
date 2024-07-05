const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "No token provided",
      statusCode: 401,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Failed to authenticate token",
        statusCode: 401,
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
