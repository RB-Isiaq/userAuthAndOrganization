const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares");
const {
  getUserOrganizations,
  createOrganization,
} = require("../controllers/organization");

router.use(authMiddleware);

router.get("/", getUserOrganizations);
router.post("/", createOrganization);

module.exports = router;
