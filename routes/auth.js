const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/", (req, res) => {
  console.log("Hello World!");

  res.send("Welcome home");
});

module.exports = router;
