const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const { phone, ...rest } = user;
  const payload = rest;

  const options = {
    expiresIn: "7d",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

module.exports = { generateToken };
