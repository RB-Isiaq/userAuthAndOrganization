const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
