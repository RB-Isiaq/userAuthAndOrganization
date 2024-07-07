const express = require("express");
const router = express.Router();

router.get("/", (_, res) => res.send("hello world!"));

module.exports = router;
