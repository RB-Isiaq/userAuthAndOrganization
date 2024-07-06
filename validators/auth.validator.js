const { check } = require("express-validator");

const registerValidation = [
  check("firstName", "First name is required").not().isEmpty(),
  check("lastName", "Last name is required").not().isEmpty(),
  check("email", "Valid email is required").isEmail(),
  check("password", "Password is required").not().isEmpty(),
  //   check("phone", "Should be a phone number").isMobilePhone(),
];
const loginValidation = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").not().isEmpty().withMessage("Password is required"),
];

module.exports = { loginValidation, registerValidation };
